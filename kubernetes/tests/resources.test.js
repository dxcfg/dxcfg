import { iterateContainers } from '../src/resources.js';
import { v1 as batch, v1beta1 as batchv1beta1 } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/batch/mod.ts";
import { v1 as apps } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/apps/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test('find all containers in a Deployment', () => {
  const dep = new apps.createDeployment({
    metadata: {
      name: 'foo',
      namespace: 'foons',
    },
    spec: {
      template: {
        spec: {
          initContainers: [
            { name: 'container1' },
          ],
          containers: [
            { name: 'container2' },
          ],
          otherContainers: [
            { name: 'container3' }
          ],
        },
      },
    }
  });
  const names = Array.from(iterateContainers(dep)).map(({ name }) => name);
  assertEquals(names, ['container1', 'container2']);
});

Deno.test('find all containers in a Job', () => {
  const dep = new batch.createJob({
    metadata: {
      name: 'job',
      namespace: 'foons',
    },
    spec: {
      template: {
        spec: {
          initContainers: [
            { name: 'container1' },
          ],
          containers: [
            { name: 'container2' },
          ],
          otherContainers: [
            { name: 'container3' }
          ],
        },
      },
    }
  });
  const names = Array.from(iterateContainers(dep)).map(({ name }) => name);
  assertEquals(names, ['container1', 'container2']);
});

Deno.test('find all containers in a CronJob', () => {
  const job = new batchv1beta1.createCronJob({
    metadata: {
      name: 'foo',
      namespace: 'foons',
    },
    spec: {
      jobTemplate: {
        spec: {
          template: {
            spec: {
              initContainers: [
                { name: 'container1' },
              ],
              containers: [
                { name: 'container2' },
              ],
              otherContainers: [
                { name: 'container3' }
              ],
            },
          },
        },
      },
    }
  });
  const names = Array.from(iterateContainers(job)).map(({ name }) => name);
  assertEquals(names, ['container1', 'container2']);
});
