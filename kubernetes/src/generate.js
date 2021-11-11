// Given an array (or a promise of an array) of Kubernetes resources,
// return a list of values suitable for use with `jk generate`
async function valuesForGenerate(resources, opts = {}) {
  const { prefix = '', namespaceDirs = true } = opts;
  const all = await Promise.resolve(resources);
  return all.map((r) => {
    const filename = `${r.metadata.name}-${r.kind.toLowerCase()}.yaml`;
    let path = filename;
    if (namespaceDirs && r.metadata.namespace) {
      path = `${r.metadata.namespace}/${filename}`;
    }
    if (prefix !== '') {
      path = `${prefix}/${path}`;
    }
    return { file: path, value: r };
  });
}

export { valuesForGenerate };
