import { schemaPath } from '../src/schema.js';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const k8s = 'v1.16.0'; // just for the sake of supplying something

Deno.test('service v1', () => {
  assertEquals(schemaPath(k8s, 'v1', 'Service'), `${k8s}-local/service-v1.json`);
});

Deno.test('deployment apps/v1', () => {
  assertEquals(schemaPath(k8s, 'apps/v1', 'Deployment'), `${k8s}-local/deployment-apps-v1.json`);
});

Deno.test('customresourcedefinition apiextensions.k8s.io/v1beta1', () => {
  assertEquals(schemaPath(k8s, 'apiextensions.k8s.io/v1beta1', 'CustomResourceDefinition'), `${k8s}-local/customresourcedefinition-apiextensions-v1beta1.json`);
});
