# Generate a multi resource yaml file using handlebarjs templates

Here we use [handlebarsjs](https://handlebarsjs.com/) to generate a
multi-resource yaml file.

```bash
deno run --allow-read --allow-write index.js -f default.yaml
```

creates a multi-resource yaml: `chart.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helloworld-dep
spec:
  template:
    labels:
      app: hello
    spec:
      containers:
        hello:
          image: 'weaveworks/helloworld:v1'
---
apiVersion: v1
kind: Service
metadata:
  name: helloworld-svc
  labels:
    app: hello
spec:
  selector:
    app: hello
```

One can pass `values.<val>` from the command line to override the defaults:

```bash
deno run --allow-read --allow-write index.js -p values.name=demo -p values.image.tag=v2
```

creates a multi-resource yaml: `chart.yaml`

```yaml
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
