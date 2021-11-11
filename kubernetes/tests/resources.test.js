import { iterateContainers } from '../src/resources.js';
import { apps, batch } from '../src/api.ts';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test('find all containers in a Deployment', () => {
  const dep = new apps.v1.Deployment('foo', {
    metadata: {
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
  const dep = new batch.v1.Job('job', {
    metadata: {
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
  const job = new batch.v1beta1.CronJob('foo', {
    metadata: {
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
