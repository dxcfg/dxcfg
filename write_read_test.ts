import { assertEquals } from "./deps.ts";
import { write } from "./write.ts";
import { read } from "./read.ts";

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
