import { ascii2bytes } from '../src/ascii2bytes.js';
import { assertEquals, base64encode } from "../../deps.ts";

Deno.test('ascii2bytes', () => {
  assertEquals(ascii2bytes('ABC'), [65, 66, 67])
});

// from RFC 4648
[
  ['f', 'Zg=='],
  ["fo", "Zm8="],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg=="],
  ["fooba", "Zm9vYmE="],
  ["foobar", "Zm9vYmFy"],
].forEach(([input, output]) => {
  Deno.test(`'${input}' -> '${output}' `, () => {
    assertEquals(base64encode(ascii2bytes(input)), output);
  });
});
