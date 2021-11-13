import { iterateContainers } from '../src/resources.js';
import { api } from "../gen/mod.ts";
import { assertEquals } from "../../deps.ts";

Deno.test('find all containers in a Deployment', () => {
  const dep = new api.apps.v1.createDeployment({
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
  const dep = new api.batch.v1.createJob({
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
  const job = new api.batch.v1beta1.createCronJob({
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
