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
          - name: hello
            image: 'weaveworks/helloworld:v1'
---
apiVersion: v1
kind: Service
metadata:
  name: helloworld-svc
spec:
  selector:
    app: hello
```
