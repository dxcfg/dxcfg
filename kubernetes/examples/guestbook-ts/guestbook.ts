import * as std from '@jkcfg/std';
import * as k8s from '@jkcfg/kubernetes/api';

const redisLabels = {
  app: 'redis',
  role: 'master',
  tier: 'backend',
};

const deployment = new k8s.apps.v1.Deployment('redis-master', { 
  metadata: {
    labels: {
      app: 'redis',
    },
  },
  spec: {
    selector: {
      matchLabels: redisLabels,
    },
    replicas: 1,
    template: {
      metadata: {
          labels: redisLabels,
      },
      spec: {
        containers: [{
          name: 'master',
          image: 'redis',
          resources: {
            requests: {
              cpu: '100m',
              memory: '100Mi',
            }
          },
          ports: [{
            containerPort: 6379,
          }],
        }],
      },
    },
  }
});

std.write(deployment, 'redis-master-deployment.yaml');
