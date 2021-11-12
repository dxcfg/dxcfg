const isTemplateFile = info => (!info.isDir && info.name.endsWith('.yaml'));

// { readString, compile } -> filename -> Promise (values -> resource)
const loadTemplate = ({ readString, parse, compile }) => async function load(path) {
  const file = await readString(path);
  const template = compile(file);
  return values => parse(template({ values }));
};

function flatMap(fn, array) {
  return [].concat(...array.map(fn));
}

// { readString, compile, dir } -> values -> Promise [string]
const loadDir = ({ readString, parse, compile, dir }, path = 'templates') => async function templates(values) {
  const load = loadTemplate({ readString, compile, parse });
  const d = dir(path);
  const loadTempl = info => load(info.path);
  const allTempl = await Promise.all(d.files.filter(isTemplateFile).map(loadTempl));
  return flatMap(t => t(values), allTempl);
};

export { loadDir, loadTemplate };