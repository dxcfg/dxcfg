import * as param from "./param.ts";
import { assertEquals } from "./deps.ts";

Deno.test("param.String", () => {
  assertEquals(param.String("key", "hello"), "hello");
});
