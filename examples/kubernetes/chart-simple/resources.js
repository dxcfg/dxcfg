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

export default resources;
