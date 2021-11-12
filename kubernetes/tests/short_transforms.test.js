import { relocate, valueMap, transform, thread, mapper, drop } from '../src/short/transform.js';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";


[
  { path: '', result: 'value' },
  { path: 'foo', result: { foo: 'value' } },
  { path: 'foo.bar.baz', result: { foo: { bar: { baz: 'value' } } } },
].forEach(({ path, result }) => {
  Deno.test(`relocate ${path}`, () => {
    const rel = relocate(path);
    assertEquals(rel('value'), result);
  })
});


[
  { field: 'foo', map: { value: 'eulav' }, result: { 'foo': 'eulav' } },
].forEach(({ field, map, result }) => {
  Deno.test(`valueMap ${field}`, () => {
    const vmap = valueMap(field, map);
    assertEquals(vmap('value'), result);
  })
});


Deno.test('transform function', () => {
  const fn = _ => ({ always: 'replaced' });
  const spec = { top: fn };
  const value = { top: { value: 'discarded' } };
  assertEquals(transform(spec, value),
    { always: 'replaced' }
  );
});

Deno.test('transform relocate', () => {
  const spec = { top: 'to.the.bottom' };
  const value = { top: 'value' };
  assertEquals(transform(spec, value),
    { to: { the: { bottom: 'value' } } }
  );
});

Deno.test('transform recurse', () => {
  const spec = { top: { sub: 'renamed' } };
  const value = { top: { sub: 'value' } };
  assertEquals(transform(spec, value),
    { renamed: 'value' }
  );
});

Deno.test('transform thread', () => {
  const spec = {
    field: thread(valueMap('other', { 'value': 'eulav' }),
      'nested.down.here')
  };
  const value = { field: 'value' };

  assertEquals(transform(spec, value),
    {
      nested: {
        down: {
          here: {
            other: 'eulav',
          }
        }
      }
    }
  );
});

Deno.test('transform drop', () => {
  const partPodSpec = {
    containers: [mapper({ name: 'name', image: 'image' }), 'spec.containers'],
    node: 'spec.nodeName',
    restart_policy: valueMap('spec.restartPolicy', {
      'always': 'Always',
      'on-failure': 'OnFailure',
      'never': 'Never',
    }),
  };
  const partDeploymentSpec = {
    name: 'metadata.name',
    ...drop('spec.template', partPodSpec),
  };

  const shortVal = {
    name: 'hellodep',
    node: 'barnode',
    restart_policy: 'never',
    containers: [
      { name: 'hello', image: 'helloworld' },
    ],
  };

  assertEquals(transform(partDeploymentSpec, shortVal), {
    metadata: { name: shortVal.name },
    spec: {
      template: {
        spec: {
          nodeName: shortVal.node,
          restartPolicy: 'Never',
          containers: [
            { name: 'hello', image: 'helloworld' },
          ],
        },
      },
    },
  });
});

Deno.test('transform all', () => {
  const spec = {
    version: 'apiVersion',
    name: 'metadata.name',
    labels: 'metadata.labels',
    recreate: thread(v => (v) ? 'Recreate' : 'RollingUpdate', 'spec.strategy.type'),
  };

  const value = {
    version: 'apps/v1',
    name: 'foo-dep',
    labels: { app: 'foo' },
    recreate: false,
  };

  assertEquals(transform(spec, value),
    {
      apiVersion: 'apps/v1',
      spec: {
        strategy: {
          type: 'RollingUpdate',
        }
      },
      metadata: {
        name: 'foo-dep',
        labels: { app: 'foo' },
      },
    }
  );
});
