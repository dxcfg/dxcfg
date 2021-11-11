import { valuesForGenerate } from '../src/generate.js';
import { core, apps } from '../src/api.ts';
import { assertEquals, assertObjectMatch } from "https://deno.land/std/testing/asserts.ts";

Deno.test('valuesForGenerate', () => {
  const output = {};
  const write = ({ file, value }) => {
    output[file] = value;
  };

  // I'm mostly checking whether it gets the paths and so on correct.
  const resources = [
    new core.v1.Namespace('foo', {}),
    new apps.v1.Deployment('bar', {
      metadata: { namespace: 'foo' },
    }),
    new core.v1.Service('foosrv', {
      metadata: { namespace: 'foo' },
    }),
  ];

  return valuesForGenerate(resources).then(files => {
    files.forEach(write);
    assertEquals(output['foo-namespace.yaml'], new core.v1.Namespace('foo', {}))
    assertEquals(output['foo/bar-deployment.yaml'], new apps.v1.Deployment('bar', {
      metadata: { namespace: 'foo' },
    }))
    assertEquals(output['foo/foosrv-service.yaml'], new core.v1.Service('foosrv', {
      metadata: { namespace: 'foo' },
    }))
  });
});

Deno.test('valuesForGenerate (flatten)', () => {
  const output = {};
  const write = ({ file, value }) => {
    output[file] = value;
  };

  // I'm mostly checking whether it gets the paths and so on correct.
  const resources = [
    new core.v1.Namespace('foo', {}),
    new apps.v1.Deployment('bar', {
      metadata: { namespace: 'foo' },
    }),
    new core.v1.Service('foosrv', {
      metadata: { namespace: 'foo' },
    }),
  ];

  return valuesForGenerate(resources, { namespaceDirs: false }).then(files => {
    files.forEach(write);
    assertEquals(output['foo-namespace.yaml'], new core.v1.Namespace('foo', {}))
    assertEquals(output['bar-deployment.yaml'], new apps.v1.Deployment('bar', {
      metadata: { namespace: 'foo' },
    }))
    assertEquals(output['foosrv-service.yaml'], new core.v1.Service('foosrv', {
      metadata: { namespace: 'foo' },
    }))
  });
});
