KUBE_SCHEMA_ORG:=yannh
KUBE_SCHEMA_REPO:=kubernetes-json-schema
KUBE_SCHEMA_SHA1:=752d01fde722dc4f3dab1c6aa2e9f32c88446f5c
SCHEMA_DIR:=build/raw/${KUBE_SCHEMA_REPO}-${KUBE_SCHEMA_SHA1}
COPIED_MARK:=build/.copied.${KUBE_SCHEMA_SHA1}

.PHONY: all dist clean gen test

all: gen

gen:
	GO111MODULE=on go run ./cmd/apigen/ cmd/apigen/specs/swagger-v1.13.0.json cmd/apigen/templates ./src/

src/api.ts: gen
src/shapes.ts: gen

dist: clean src/api.ts src/shapes.ts ${COPIED_MARK}
	cp -R build/schemas src/

clean:
	rm -f src/api.ts src/shapes.ts
	rm -rf src/shemas
	rm -rf ./build
	
test:
	deno test --allow-write --allow-read --ignore=src/api.ts

${COPIED_MARK}: ${SCHEMA_DIR}
	rm -rf ./build/schemas
	GO111MODULE=on go run ./cmd/dedup/ ${SCHEMA_DIR} ./build/schemas
	touch ${COPIED_MARK}

${SCHEMA_DIR}:
	mkdir -p build
	git clone --depth 1 --no-checkout "https://github.com/${KUBE_SCHEMA_ORG}/${KUBE_SCHEMA_REPO}" ${SCHEMA_DIR}
	cd ${SCHEMA_DIR} && \
	git sparse-checkout init --cone && \
	git ls-tree -d -r HEAD --name-only | grep -E "v.*-local" | xargs git sparse-checkout add && \
  git read-tree -mu HEAD
