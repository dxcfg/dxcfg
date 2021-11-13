import { patchResource, rewriteImageRefs } from '../src/transform/index.js';
import { api } from "../gen/mod.ts";
import { assertEquals } from "../../deps.ts";

// for the match predicate
const template = {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: 'dep1',
    namespace: 'foo-ns',
  },
};

const resource = {
  ...template,
  spec: {
    replicas: 1,
    containers: [
      { name: 'foo', image: 'foo:v1' },
    ],
  }
};

Deno.test('matches nothing', () => {
  const p = patchResource({});
  assertEquals(p(resource), resource);
});

Deno.test('patch something', () => {
  // to make a patch, use the template so it matches, then add a field
  // to be changed.
  const templ = { ...template };
  templ.spec = { replicas: 6 };
  const p = patchResource(templ);

  // the expected result will be the resource, but with the
  // spec.replicas field changed. NB we have to be careful to clone
  // the spec, rather than assigning into it.
  const expected = { ...resource };
  expected.spec = { ...resource.spec, replicas: 6 };
  assertEquals(p(resource), expected);
});

Deno.test('naive rewriteImageRefs', () => {
  const dep = new api.apps.v1.createDeployment({
    metadata: {
      name: 'foo',
      namespace: 'foons',
    },
    spec: {
      template: {
        spec: {
          initContainers: [
            {
              name: 'c1',
              image: 'foo:v1',
            }
          ],
        },
      },
    },
  });
  const dep2 = rewriteImageRefs(_ => 'bar:v1')(dep);
  assertEquals(dep2.spec.template.spec.initContainers[0].image, 'bar:v1');
});
