import { assertEquals } from "./deps.ts";
import { Format, write } from "./write.ts";
import { read, readSync } from "./read.ts";

const expected = {
  name: "Alice",
  beverage: "Club-Mate",
  monitors: 2,
  languages: [
    "python",
    "haskell",
    "c++",
    "68k assembly",
  ],
};

const runWriteReadTest = async (tmp: string) => {
  await write(expected, tmp);
  const actual = await read(tmp);
  assertEquals(actual, expected);
};

Deno.test("write and read json: format from file extension", async () => {
  await runWriteReadTest(Deno.makeTempFileSync({ suffix: ".json" }));
});

Deno.test("write and read yaml: format from file extension", async () => {
  await runWriteReadTest(Deno.makeTempFileSync({ suffix: ".yaml" }));
});

Deno.test("write and read toml: format from file extension", async () => {
  await runWriteReadTest(Deno.makeTempFileSync({ suffix: ".toml" }));
});

Deno.test("read multi json", () => {
  const multiJsonStr = `{"a":"b"}
{"x":"y"}`;

  const multiJson = [{
    a: "b",
  }, {
    x: "y",
  }];
  const tmp = Deno.makeTempFileSync({ suffix: ".json" });
  Deno.writeTextFileSync(tmp, multiJsonStr);
  const actual = readSync(tmp);
  assertEquals(actual, multiJson);
});

Deno.test("read and write multi json", async () => {
  const multiJson = [{
    a: "b",
  }, {
    x: "y",
  }];
  const tmp = Deno.makeTempFileSync({ suffix: ".json" });
  await write(multiJson, tmp, { format: Format.MULTI_JSON });
  const actual = await read(tmp);
  assertEquals(actual, multiJson);
});

Deno.test("read multi yaml", () => {
  const multiYamlStr = `
---
id: 1
name: Alice
---
id: 2
name: Bob
---
id: 3
name: Eve
  `;

  const multiYaml = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }, {
    id: 3,
    name: "Eve",
  }];
  const tmp = Deno.makeTempFileSync({ suffix: ".yaml" });
  Deno.writeTextFileSync(tmp, multiYamlStr);
  const actual = readSync(tmp);
  assertEquals(actual, multiYaml);
});

Deno.test("read write multi yaml", async () => {
  const multiYaml = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }, {
    id: 3,
    name: "Eve",
  }];
  const tmp = Deno.makeTempFileSync({ suffix: ".yaml" });
  await write(multiYaml, tmp, { format: Format.MULTI_YAML });
  const actual = await read(tmp);
  assertEquals(actual, multiYaml);
});
