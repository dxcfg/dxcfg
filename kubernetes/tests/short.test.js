import { long } from '../src/short/index.js';
import { api } from "../gen/mod.ts";
import { assertEquals } from "../../deps.ts";

// Add to this as the spec gets more complete ...
Deno.test('deployment', () => {
  const dep = {
    deployment: {
      name: 'foo-dep',
      namespace: 'foo-ns',
      labels: { app: 'foo' },
    }
  };
  assertEquals(long(dep), new api.apps.v1.createDeployment({
    metadata: {
      name: 'foo-dep',
      namespace: 'foo-ns',
      labels: { app: 'foo' },
    },
  }));
});

Deno.test('service', () => {
  const svc = {
    service: {
      name: 'bar-svc',
      namespace: 'bar-ns',
      type: 'node-port',
      selector: { app: 'bar' },
    }
  };
  assertEquals(long(svc), new api.core.v1.createService({
    metadata: {
      namespace: 'bar-ns',
      name: 'bar-svc',
    },
    spec: {
      type: 'NodePort',
      selector: { app: 'bar' }
    }
  }));
});
