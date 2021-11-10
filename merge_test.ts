// deno port of https://github.com/jkcfg/jk/blob/master/std/merge.test.js
import { deep, deepWithKey, first, merge, replace } from "./merge.ts";
import { assertEquals, assertThrows } from "./deps.ts";

Deno.test("merge: default merging of primitive values", () => {
  assertEquals(merge(1, 2), 2);
  assertEquals(merge("a", "b"), "b");
  assertThrows(() => merge("a", 1));
  assertThrows(() => merge(true, "b"));
  assertEquals(merge([1, 2], [3, 4]), [3, 4]);
  assertEquals(merge({ foo: 1 }, { bar: 2 }), { foo: 1, bar: 2 });
});

const pod = {
  spec: {
    containers: [{
      name: "my-app",
      image: "busybox",
      command: ["sh", "-c", "echo Hello Kubernetes! && sleep 3600"],
    }, {
      name: "sidecar",
      image: "sidecar:v1",
    }],
  },
};

const sidecarImage = {
  spec: {
    containers: [{
      name: "sidecar",
      image: "sidecar:v2",
    }],
  },
};

Deno.test("merge: array of objects, merging objects identified by a key", () => {
  const result = merge(pod, sidecarImage, {
    spec: deep({
      containers: deepWithKey("name"),
    }),
  });

  assertEquals(result.spec.containers.length, 2);
  assertEquals(result.spec.containers[1].image, "sidecar:v2");
});

Deno.test("merge: pick the deep merge strategy when encountering an object as rule", () => {
  const result = merge(pod, sidecarImage, {
    spec: {
      containers: deepWithKey("name"),
    },
  });

  assertEquals(result.spec.containers.length, 2);
  assertEquals(result.spec.containers[1].image, "sidecar:v2");
});

Deno.test("deep: throw on wrong input type", () => {
  const sidecarImageNotObject = {
    spec: [{
      containers: [{
        name: "sidecar",
        image: "sidecar:v2",
      }],
    }],
  };

  const rules = {
    spec: deep({
      containers: deepWithKey("name"),
    }),
  };

  assertThrows(() => merge(pod, sidecarImageNotObject, rules));
});

Deno.test("deepWithKey: throw on wrong input type", () => {
  const sidecarImageNotArray = {
    spec: {
      containers: {
        name: "sidecar",
        image: "sidecar:v2",
      },
    },
  };

  const rules = {
    spec: deep({
      containers: deepWithKey("name"),
    }),
  };

  assertThrows(() => merge(pod, sidecarImageNotArray, rules));
});

Deno.test("first: basic", () => {
  const result = merge(pod, sidecarImage, {
    spec: {
      containers: first(),
    },
  });

  assertEquals(result.spec.containers.length, 2);
  assertEquals(result.spec.containers[0].name, "my-app");
  assertEquals(result.spec.containers[1].image, "sidecar:v1");
});

Deno.test("replace: basic", () => {
  const result = merge(pod, sidecarImage, {
    spec: {
      containers: replace(),
    },
  });

  assertEquals(result.spec.containers.length, 1);
  assertEquals(result.spec.containers[0].name, "sidecar");
});
