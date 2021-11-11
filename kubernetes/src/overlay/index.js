import { valuesForGenerate } from '../generate.js';
import { compile } from './compile.js';

// overlay is compile
function overlay(path, config, opts = {}) {
  const compileFunc = compile(opts);
  return compileFunc(path, config);
}

function kustomization(path) {
  return overlay(path, { bases: [path] }, { file: 'kustomization.yaml' });
}

function generateKustomization(path) {
  const resources = kustomization(path);
  return valuesForGenerate(resources);
}

export { overlay, kustomization, generateKustomization };
