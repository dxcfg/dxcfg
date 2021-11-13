import { valuesForGenerate } from '../src/generate.js';
import { api } from "../gen/mod.ts";
import { assertEquals } from "../../deps.ts";

Deno.test('valuesForGenerate', () => {
  const output = {};
  const write = ({ file, value }) => {
    output[file] = value;
  };

  // I'm mostly checking whether it gets the paths and so on correct.
  const resources = [
    new api.core.v1.createNamespace({ metadata: { name: 'foo' } }),
    new api.apps.v1.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }),
    new api.core.v1.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
    }),
  ];

  return valuesForGenerate(resources).then(files => {
    files.forEach(write);
    assertEquals(output['foo-namespace.yaml'], new api.core.v1.createNamespace({ metadata: { name: 'foo' } }))
    assertEquals(output['foo/bar-deployment.yaml'], new api.apps.v1.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }))
    assertEquals(output['foo/foosrv-service.yaml'], new api.core.v1.createService({
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
    new api.core.v1.createNamespace({ metadata: { name: 'foo' } }),
    new api.apps.v1.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }),
    new api.core.v1.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
    }),
  ];

  return valuesForGenerate(resources, { namespaceDirs: false }).then(files => {
    files.forEach(write);
    assertEquals(output['foo-namespace.yaml'], new api.core.v1.createNamespace({ metadata: { name: 'foo' } }),)
    assertEquals(output['bar-deployment.yaml'], new api.apps.v1.createDeployment({
      metadata: { namespace: 'foo', name: "bar" },
    }))
    assertEquals(output['foosrv-service.yaml'], new api.core.v1.createService({
      metadata: { namespace: 'foo', name: 'foosrv' },
    }))
  });
});

