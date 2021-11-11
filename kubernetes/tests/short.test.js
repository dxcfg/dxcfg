import { long } from '../src/short/index.js';
import { apps, core } from '../src/api.ts';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

// Add to this as the spec gets more complete ...
Deno.test('deployment', () => {
  const dep = {
    deployment: {
      name: 'foo-dep',
      namespace: 'foo-ns',
      labels: { app: 'foo' },
    }
  };
  assertEquals(long(dep), new apps.v1.Deployment('foo-dep', {
    metadata: {
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
  assertEquals(long(svc), new core.v1.Service('bar-svc', {
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
