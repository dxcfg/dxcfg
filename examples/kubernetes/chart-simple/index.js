import { param, write, Format } from '../../deps.ts';
import { api } from '../../deps.ts';

function resources(Values) {
  return [
    new api.apps.v1.createDeployment({
      metadata: {
        name: `${Values.name}-dep`,
      },
      spec: {
        template: {
          labels: { app: Values.app },
          spec: {
            containers: {
              hello: {
                image: `${Values.image.repository}:${Values.image.tag}`,
              },
            },
          },
        },
      },
    }),
    new api.core.v1.createService({
      metadata: {
        name: `${Values.name}-svc`,
        labels: { app: Values.app },
      },
      spec: {
        selector: {
          app: Values.app,
        },
      },
    })];
}

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1',
  },
};

const values = await param.object("values", defaults)
await write(resources(values), 'chart.yaml', { format: Format.MULTI_YAML })