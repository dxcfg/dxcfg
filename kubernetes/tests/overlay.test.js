import { compile } from '../src/overlay/compile.js';
import { fs, Encoding } from './mock.js';
import { v1 as core } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/core/mod.ts";
import { merge, deepWithKey } from '../../mod.ts';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test('trivial overlay: no bases, resources, patches', () => {
  const { read } = fs({}, {});
  const o = compile({ read, Encoding });
  return o('config', {}).then((v) => {
    assertEquals(v, []);
  });
});


const deployment = {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: 'deploy1',
    namespace: 'test-ns',
  },
  spec: {
    template: {
      spec: {
        containers: [
          { name: 'test', image: 'tester:v1' },
        ],
      },
    },
  },
};

const service = {
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: 'service1',
    namespace: 'test-ns',
  },
};


Deno.test('load resources', () => {
  const kustomize = {
    resources: ['deployment.yaml', 'service.yaml'],
  };
  const files = {
    './deployment.yaml': { json: deployment },
    './service.yaml': { json: service },
  };
  const o = compile(fs({}, files));
  return o('.', kustomize).then((v) => {
    assertEquals(v, [deployment, service]);
  });
});

Deno.test('load resources with generatedResources', () => {
  const files = {
    './deployment.yaml': { json: deployment },
  };
  const o = compile(fs({}, files));

  const kustomize = {
    resources: ['deployment.yaml'],
    generatedResources: [Promise.resolve([service])],
  };


  return o('.', kustomize).then((v) => {
    assertEquals(v, [service, deployment]);
  });
});

Deno.test('user-provided transformation', () => {
  const files = {
    './service.yaml': { json: service },
  };
  const o = compile(fs({}, files));

  const insertSidecar = (v) => {
    if (v.kind === 'Deployment') {
      return merge(v, {
        spec: {
          template: {
            spec: {
              containers: [{ name: 'sidecar', image: 'side:v1' }],
            },
          },
        },
      }, {
        spec: {
          template: {
            spec: {
              containers: deepWithKey('name'),
            }
          }
        }
      });
    }
    return v;
  };

  const kustom = {
    resources: ['service.yaml'],
    generatedResources: [Promise.resolve([deployment])],
    transformations: [insertSidecar],
  };

  return o('.', kustom).then((v) => {
    assertEquals(v, [insertSidecar(deployment), service]);
    const [d,] = v;
    // transformed deployment has extra container
    assertEquals(d.spec.template.spec.containers.length, 2);
    // original deployment has no extra container
    assertEquals(deployment.spec.template.spec.containers.length, 1);
  });
});

Deno.test('compose bases', () => {
  const subkustomize = {
    resources: ['deployment.yaml'],
  };
  const kustomize = {
    bases: ['sub'],
    resources: ['service.yaml'],
  }
  const files = {
    './service.yaml': { json: service },
    './sub/kustomization.yaml': { json: subkustomize },
    './sub/deployment.yaml': { json: deployment },
  };

  const o = compile(fs({}, files));

  return o('.', kustomize).then((v) => {
    assertEquals(v, [deployment, service]);
  });
});

Deno.test('patch resource', () => {
  const commonLabels = { app: 'foobar' };
  const commonAnnotations = { awesome: 'true' };

  const patch = {
    apiVersion: deployment.apiVersion,
    kind: deployment.kind,
    metadata: deployment.metadata,
    spec: {
      replicas: 10,
    },
  };

  const patchedDeployment = {
    ...deployment,
    metadata: {
      ...deployment.metadata,
      labels: commonLabels,
      annotations: commonAnnotations,
    },
    spec: {
      ...deployment.spec,
      replicas: 10,
    },
  };
  const patchedService = {
    ...service,
    metadata: {
      ...service.metadata,
      labels: commonLabels,
      annotations: commonAnnotations,
    }
  };

  const files = {
    './service.yaml': { json: service },
    './deployment.yaml': { json: deployment },
    './patch.yaml': { json: patch },
  };

  const kustomize = {
    commonLabels,
    commonAnnotations,
    resources: ['service.yaml', 'deployment.yaml'],
    patches: ['patch.yaml'],
  };

  const o = compile(fs({}, files));

  return o('.', kustomize).then((v) => {
    assertEquals(v, [patchedService, patchedDeployment]);
  });
});

Deno.test('generate resources', () => {
  const kustomize = {
    configMapGenerator: [
      {
        name: 'foobar',
        literals: ['foo=bar'],
        files: ['bar'],
      },
    ],
    secretGenerator: [
      {
        name: 'ssshh',
        literals: ['foo=foobar'],
      }
    ],
  };
  const files = {
    './bar': { string: 'foo' },
  };

  const configmap = new core.createConfigMap({
    metadata: {
      name: 'foobar',
    },
    data: {
      'foo': 'bar',
      'bar': 'foo',
    }
  });
  const secret = new core.createSecret({
    metadata: {
      name: 'ssshh',
    },
    data: {
      'foo': 'Zm9vYmFy',
    }
  });

  const o = compile(fs({}, files));

  return o('.', kustomize).then((v) => {
    //console.log(v[0], configmap)
    assertEquals(JSON.stringify(v), JSON.stringify([configmap, secret]))
    //assertEquals(v, [configmap, secret]);
  });
});
