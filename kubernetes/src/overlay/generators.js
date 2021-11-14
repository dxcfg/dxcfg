import { dataFromFiles } from './data.js';
import { path, base64encode } from '../../../deps.ts';
import { ascii2bytes } from '../ascii2bytes.js';
import { api } from "../../gen/mod.ts";
const generateConfigMap = readStr => function generate(config) {
  const {
    name,
    files = [],
    literals = [],
  } = config;

  const data = {};
  literals.forEach((s) => {
    const [k, v] = s.split('=');
    data[k] = v;
  });
  const fileContents = dataFromFiles(readStr, files);
  return fileContents.then((d) => {
    d.forEach((v, k) => {
      data[path.basename(k)] = v;
    });
    return new api.core.v1.createConfigMap({
      metadata: {
        name: name,
      },
      data: data,
    });
  });
};

// In Kustomize, secrets are generally created from the result of
// shelling out to some command (e.g., create an SSH key). Often these
// won't be repeatable actions -- the usual mode of operation is such
// that the value of the secret is cannot be used outside the
// configuration. For example, a random password is constructed, and
// supplied to both a server and the client that needs to connect to
// it.
//
// Since we don't want to let the outside world in, with its icky
// non-determinism, generateSecret here allows
//
//   - strings (so long as they are ASCII; supporting UTF8 is possible, but would
//     need re-encoding)
//   - files, read as bytes
//
// This changes how you can use generated secrets: instead of creating
// shared secrets internal to the configuration, as above, it is
// mostly for things supplied from outside, e.g., via
// parameters. Instead of the config being variations on `command`
// (see
// https://github.com/kubernetes-sigs/kustomize/blob/master/pkg/types/kustomization.go),
// there are much the same fields as for ConfigMaps, the difference
// being that the values end up being encoded base64.
const generateSecret = readBytes => function generate(config) {
  const {
    name,
    files = [],
    literals = [],
  } = config;

  const data = {};
  literals.forEach((s) => {
    const [k, v] = s.split('=');
    data[k] = base64encode(ascii2bytes(v));
  });
  const fileContents = dataFromFiles(readBytes, files);
  return fileContents.then((d) => {
    d.forEach((v, k) => {
      data[path.basename(k)] = base64encode(v);
    });
    return new api.core.v1.createSecret({
      metadata: {
        name: name,
      },
      data: data,
    });
  });
};

export { generateConfigMap, generateSecret };
