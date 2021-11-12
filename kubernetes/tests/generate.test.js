import { valuesForGenerate } from '../src/generate.js';
import { v1 as core } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/core/mod.ts";
import { v1 as apps } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/apps/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test('valuesForGenerate', () => {
  const output = {};
  const write = ({ file, value }) => {
    output[file] = value;
  };

  // I'm mostly checking whether it gets the paths and so on correct.
  const resources = [
    new core.createNamespace({ metadata: { name: 'foo' } }),
    new apps.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }),
    new core.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
    }),
  ];

  return valuesForGenerate(resources).then(files => {
    files.forEach(write);
    assertEquals(output['foo-namespace.yaml'], new core.createNamespace({ metadata: { name: 'foo' } }))
    assertEquals(output['foo/bar-deployment.yaml'], new apps.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }))
    assertEquals(output['foo/foosrv-service.yaml'], new core.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
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
    new core.createNamespace({ metadata: { name: 'foo' } }),
    new apps.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }),
    new core.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
    }),
  ];

  return valuesForGenerate(resources, { namespaceDirs: false }).then(files => {
    files.forEach(write);
    assertEquals(output['foo-namespace.yaml'], new core.createNamespace({ metadata: { name: 'foo' } }),)
    assertEquals(output['bar-deployment.yaml'], new apps.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }))
    assertEquals(output['foosrv-service.yaml'], new core.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
    }))
  });
});

