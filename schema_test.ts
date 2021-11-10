import { assertEquals, assertThrows } from "./deps.ts";
import { validateWithFile, validateWithObject } from "./schema.ts";

const schema = {
  "properties": {
    "foo": { "type": "string" },
    "bar": { "type": "number", "maximum": 3 },
  },
};

Deno.test("valididate with schema object", () => {
  const obj1 = { "foo": "abc", "bar": 4 };
  const obj2 = { "foo": "abc", "bar": 2 };
  assertThrows(() => validateWithObject(obj1, schema));
  assertEquals(validateWithObject(obj2, schema), true);
});

Deno.test("valididate with schema file", async () => {
  const obj1 = { "foo": "abc", "bar": 4 };
  const obj2 = { "foo": "abc", "bar": 2 };
  const tmp = Deno.makeTempFileSync({ suffix: ".json" });
  await Deno.writeTextFile(tmp, JSON.stringify(schema));
  assertThrows(() => validateWithFile(obj1, tmp));
  assertEquals(validateWithFile(obj2, tmp), true);
});
