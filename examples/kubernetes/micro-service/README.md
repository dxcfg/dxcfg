# `micro-service.js`

An example generating various artefacts from a high level micro-service
definition. This example generates:

- `Namespace`, `Deployment`, `Service` and `Ingress` Kubernetes objects,
- A Prometheus alert stored in a `PrometheusRule` custom resource, ready to be
  picked up by the [Prometheus operator][prom-operator].

```bash
deno run --allow-read --allow-write index.js
```
