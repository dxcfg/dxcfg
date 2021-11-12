import { long } from '../src/short/index.js';
import { v1 as core } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/core/mod.ts";
import { v1 as apps } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/apps/mod.ts";
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
  assertEquals(long(dep), new apps.createDeployment({
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
  assertEquals(long(svc), new core.createService({
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
