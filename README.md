# dxcfg

Configuration as code tooling for the masses. `Opinionated` port of
[jkcfg](https://jkcfg.github.io/#/) API to deno.

## Principles

- Keep the API surface small and obvious.
- Free of opinions on how configuration should be managed.
- Don’t reproduce features from other tools: helm, kustomize, cdktf etc. rather
  provide integrations to call them.
- Don’t write custom APIs for components: grafana, tekton etc. Use the official
  SDK or expose a generated typescript api from openapi or CRD spec .
