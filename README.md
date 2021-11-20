# dxcfg

[![dxcfg ci](https://github.com/dxcfg/dxcfg/workflows/ci/badge.svg)](https://github.com/dxcfg/dxcfg)
[![codecov](https://codecov.io/gh/dxcfg/dxcfg/branch/main/graph/badge.svg?token=KEKZ52NXGP)](https://codecov.io/gh/dxcfg/dxcfg)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/dxcfg/mod.ts)

`dxcfg` allows you to use javascript/typescript to generate configuration in the
[Deno](https://deno.land) sandbox.

- For `developers` it can be used a familiar and expressive `frontend`.
- For `operators` it can be used as a `backend` for enforcing schema validation,
  security policies, resource usage policies and `hermeticity`:
  [see hermeticity example](./examples/hermeticity).

Its an `opinionated` port of [jkcfg](https://jkcfg.github.io/#/) API to deno and
is a `work in progress`.

## Example Usage

Let's generate a multi resource yaml file using template literals. Here we use
[template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
to generate a multi-resource yaml file.

`index.js` uses the generated kubernetes types from the
[dxcfg_kubernetes](https://github.com/dxcfg/dxcfg_kubernetes) module.

```js
import { Format, param, write } from "https://deno.land/x/dxcfg@v0.2.1/mod.ts";
import { api } from "https://deno.land/x/dxcfg_kubernetes@v0.1.0/mod.ts";

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
    }),
  ];
}

const defaults = {
  name: "helloworld",
  app: "hello",
  image: {
    repository: "weaveworks/helloworld",
    tag: "v1",
  },
};

const values = await param.object("values", defaults);
await write(resources(values), "chart.yaml", { format: Format.MULTI_YAML });
```

Run with deno:

```bash
deno run --unstable --allow-read --allow-write index.js -p values.name=demo -p values.image.tag=v2
```

which writes a `chart.yaml`:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-dep
spec:
  template:
    labels:
      app: hello
    spec:
      containers:
        hello:
          image: 'weaveworks/helloworld:v2'
---
apiVersion: v1
kind: Service
metadata:
  name: demo-svc
  labels:
    app: hello
spec:
  selector:
    app: hello
```

See more in [examples](./examples)

## Principles

- Keep the API surface small and obvious.
- Free of opinions on how configuration should be managed.
- Don’t reproduce features from other tools: helm, kustomize, cdktf etc. rather
  provide integrations to call them.
- Don’t write custom APIs for components: grafana, tekton etc. Use the official
  SDK or expose a generated typescript api from openapi or CRD spec .

## Roadmap

- An example complex deployment pipeline on top of GKE/GCP
- A typescript API for an efficient buildkit builder(written in Rust)
