import { values } from '../src/chart/values.js';
import { assertEquals } from "../../deps.ts";

function params(obj = {}) {
  return { object: (k, d) => (obj.hasOwnProperty(k)) ? obj[k] : d };
}

Deno.test('empty values and empty defaults', () => {
  const vals = values(params({}));
  assertEquals(vals({}), {})
});

Deno.test('defaults', () => {
  const vals = values(params({}));
  assertEquals(vals({ app: 'foo' }), { app: 'foo' });
});

Deno.test('defaults and values', () => {
  const commandLine = { image: { repository: 'helloworld' } };
  const vals = values(params({ values: commandLine }));
  assertEquals(vals({ image: { tag: 'v1' } }), {
    image: {
      repository: 'helloworld',
      tag: 'v1',
    }
  });
});

Deno.test('values override defaults', () => {
  const vals = values(params({ values: { app: 'bar' } }));
  assertEquals(vals({ app: 'foo' }), { app: 'bar' });
});
