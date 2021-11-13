An example to generate a dockerfile

```bash
deno run --allow-write --allow-read dockerfile.js -f my-service.yaml
```

creates a `Dockerfile`

```dockerfile
FROM alpine:3.8

EXPOSE 80

COPY my-service /
ENTRYPOINT /my-service
```
