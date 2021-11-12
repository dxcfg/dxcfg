import { read, parse, Encoding, Format, dir } from '../../../mod.ts';
import { values } from './values.js';
import { loadDir } from './template.js';
import { valuesForGenerate } from '../generate.js';

function chart(resourcesFn, defaults, paramMod) {
  // lift defaults into Promise, since it may or may not be one
  const vals = Promise.resolve(defaults).then(values(paramMod));
  return vals.then(resourcesFn);
}

function generateChart(resourcesFn, defaults, paramMod) {
  return chart(resourcesFn, defaults, paramMod).then(valuesForGenerate);
}

const readStr = path => read(path, { encoding: Encoding.String });
const parseYAML = str => parse(str, Format.YAML);

// loadTemplates :: (string -> template, path) -> values -> Promise [resource]
function loadTemplates(compile, path = 'templates') {
  return loadDir({ compile, parse: parseYAML, readString: readStr, dir }, path);
}

// loadModuleTemplates :: (string -> template, <resources import>, path) ->
//                          values -> Promise [resources]
function loadModuleTemplates(compile, resources, path = 'templates') {
  const readModuleStr = p => resources.read(p, { encoding: Encoding.String });
  const funcs = { compile, parse: parseYAML, readString: readModuleStr, dir: resources.dir };
  return loadDir(funcs, path);
}

export { chart, generateChart, loadTemplates, loadModuleTemplates };