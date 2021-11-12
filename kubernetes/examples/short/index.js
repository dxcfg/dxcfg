// An example of using shortened forms to represent resources.

import { valuesForGenerate } from '@jkcfg/kubernetes/generate';
import { generateFromShorts } from '@jkcfg/kubernetes/short/generate';

const deployment = {
  deployment: {
    name: 'foo-dep',
    namespace: 'foo-ns',
    pod_meta: {
      labels: { app: 'hello' },
    },
    recreate: false,
    replicas: 5,
    max_extra: 1,
    max_unavailable: 2,
    progress_deadline: 30,
    containers: [
      {
        name: 'hello',
        image: 'helloworld',
      },
    ],
  }
};

const service = {
  service: {
    name: 'foo-svc',
    namespace: 'foo-ns',
    selector: { app: 'hello' },
  },
};

export default generateFromShorts([deployment, service]);
