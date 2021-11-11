// traverse returns the value found by successively indexing elements
// of `path`, or `def` if any are not present.
function traverse(path, object, def) {
  let obj = object;
  for (const elem of path) {
    if (!Object.prototype.hasOwnProperty.call(obj, elem)) {
      return def;
    }
    obj = obj[elem];
  }
  return obj;
}

// Yields all the container definitions used in a resource.
function* iterateContainers(resource) {
  // this is mildly hacky; check for the usual places that image refs
  // are found
  for (const path of [
    ['spec', 'template', 'spec', 'initContainers'],
    ['spec', 'template', 'spec', 'containers'],
    ['spec', 'jobTemplate', 'spec', 'template', 'spec', 'initContainers'],
    ['spec', 'jobTemplate', 'spec', 'template', 'spec', 'containers'],
  ]) {
    const containers = traverse(path, resource, []);
    for (let i = 0; i < containers.length; i++) {
      yield containers[i];
    }
  }
}

export { iterateContainers };
