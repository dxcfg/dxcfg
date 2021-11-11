// This module provides procedures for applying Kustomize-like
// [overlays](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/kustomization.yaml).
//
// In Kustomize, a configuration is given in a `kustomization.yaml`
// file; here we'll interpret an object (which can of course be loaded
// from a file). In a `kustomization.yaml` you refer to files from
// which to load or generate resource manifests, and transformations
// to apply to all or some resources.
//
// The mechanism for composing configurations is to name `bases` in
// the `kustomization.yaml` file; these are evaluated and included in
// the resources.
//
// The approach taken here is
//   1. assemble all the transformations mentioned in various ways in the kustomize object;
//   2. assemble all the resources, including from bases, in the kustomize object;
//   3. run each resource through the transformations.
//
// Easy peasy!

import { patchResource, commonMetadata } from '../transform/index.js';
import { generateConfigMap, generateSecret } from './generators.js';

const flatten = array => [].concat(...array);
const pipeline = (...fns) => v => fns.reduce((acc, val) => val(acc), v);

// The compile function here is parameterised with the means of
// reading files:
//
//     compile :: { read, Encoding } -> base path, object -> Promise [Resource]
const compile = ({ read, Encoding }, opts = {}) => async function recurse(base, overlayObj) {
  const { file = 'kustomization.yaml' } = opts;
  const readObj = f => read(`${base}/${f}`, { encoding: Encoding.JSON });
  const readStr = f => read(`${base}/${f}`, { encoding: Encoding.String });
  const readBytes = f => read(`${base}/${f}`, { encoding: Encoding.Bytes });

  const {
    // these are all fields interpreted by kustomize
    resources: resourceFiles = [],
    bases: baseFiles = [],
    patches: patchFiles = [],
    configMapGenerator = [],
    secretGenerator = [],

    // you can supply your own transformations as functions here
    transformations = [],
    // you can supply Promise [resource] values here, e.g., by calling chart(...)
    generatedResources = [],
  } = overlayObj;

  const patches = [];
  patchFiles.forEach((f) => {
    patches.push(readObj(f).then(patchResource));
  });

  // TODO: add the other kinds of transformation: imageTags, ..?

  const resources = generatedResources;

  baseFiles.forEach((f) => {
    const obj = readObj(`${f}/${file}`);
    resources.push(obj.then(o => recurse(`${base}/${f}`, o)));
  });

  resources.push(Promise.all(resourceFiles.map(readObj)));
  resources.push(Promise.all(configMapGenerator.map(generateConfigMap(readStr))));
  resources.push(Promise.all(secretGenerator.map(generateSecret(readBytes))));

  const transform = pipeline(...transformations,
    ...await Promise.all(patches),
    commonMetadata(overlayObj));
  return Promise.all(resources).then(flatten).then(rs => rs.map(transform));
};

export { compile };