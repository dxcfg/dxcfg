import { merge } from '../../../mod.ts';
import { iterateContainers } from '../resources.js';

// Interpret a series of transformations expressed either as object
// patches (as in the argument to `patch` in this module), or
// functions. Usually the first argument will be an object,
// representing an initial value, but it can be a function (that will
// be given an empty object as its argument).
function mix(...transforms) {
  let r = {};

  for (const transform of transforms) {
    switch (typeof transform) {
      case 'object':
        r = merge(r, transform);
        break;
      case 'function':
        r = transform(r);
        break;
      default:
        throw new TypeError('only objects and functions allowed as arguments');
    }
  }

  return r;
}


// resourceMatch returns a predicate which gives true if the given
// object represents the same resource as `template`, false otherwise.
function resourceMatch(target) {
  // NaN is used for mandatory fields; if these are not present in the
  // template, nothing will match it (since NaN does not equal
  // anything, even itself).
  const { apiVersion = NaN, kind = NaN, metadata = {} } = target;
  const { name = NaN, namespace } = metadata;
  return (obj) => {
    const { apiVersion: v, kind: k, metadata: m } = obj;
    if (v !== apiVersion || k !== kind) return false;
    const { name: n, namespace: ns } = m;
    if (n !== name || ns !== namespace) return false;
    return true;
  };
}

// patchResource returns a function that will patch the given object
// if it refers to the same resource, and otherwise leave it
// untouched.
function patchResource(p) {
  const match = resourceMatch(p);
  return v => (match(v) ? merge(v, p) : v);
}

// commonMetadata returns a tranformation that will indiscriminately
// add the given labels and annotations to every resource.
function commonMetadata({ commonLabels = null, commonAnnotations = null, namespace = null }) {
  // This isn't quite as cute as it could be; naively, just assembling a patch
  //     { metadata: { labels: commonLabels, annotations: commonAnnotations }
  // doesn't work, as it will assign null (or empty) values where they are not
  // present.
  const metaPatches = [];
  if (commonLabels !== null) {
    metaPatches.push({ metadata: { labels: commonLabels } });
  }
  if (commonAnnotations !== null) {
    metaPatches.push({ metadata: { annotations: commonAnnotations } });
  }
  if (namespace !== null) {
    metaPatches.push({ metadata: { namespace } });
  }
  return r => mix(r, ...metaPatches);
}

// rewriteImageRefs applies the given rewrite function to each image
// ref used in a resource. TBD(michael): should this use a zipper, so
// as to not mutate?
const rewriteImageRefs = rewrite => (resource) => {
  for (const container of iterateContainers(resource)) {
    container.image = rewrite(container.image);
  }
  return resource;
};

export { patchResource, commonMetadata, rewriteImageRefs };
