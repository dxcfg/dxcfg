/**
 * The schema module calculates access to Kubernetes JSON Schema
 * definitions. It's kept separate from validate.js so that only one
 * is tied to the jk runtime (by using resources).
 */

// schemaPath returns the path to the schema for a given Kubernetes
// object, starting from wherever schemas are kept.
export function schemaPath(k8sVersion, apiVersion, kind) {
  // this reproduces the logic from the tool that generates the
  // schemas:
  //
  //     https://github.com/instrumenta/openapi2jsonschema/blob/master/openapi2jsonschema/command.py#L132
  //
  // and ff.
  const groupVersion = apiVersion.split('/');
  // 'apps/v1' vs 'v1'
  if (groupVersion.length > 1) {
    // 'apiextensions.k8s.io' vs 'apps'
    const [group] = groupVersion[0].split('.');
    groupVersion[0] = group;
  }
  const kindGroupVersion = [kind, ...groupVersion];
  return `${k8sVersion}-local/${kindGroupVersion.join('-').toLowerCase()}.json`;
}
