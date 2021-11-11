import { dataFromFiles, dataFromDir } from '../src/overlay/data.js';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const foo = `---
conf:
  config1: 1
  config2: 2
`;

const bar = `---
stuff:
  - 1
  - 2
  - 3
`;

import { fs, Encoding } from './mock.js';

const { dir, read } = fs({
  'config': {
    files: [
      { name: 'foo.yaml', isdir: false },
      { name: 'bar.yaml', isdir: false },
      { name: 'baz', isdir: true }
    ]
  },
}, {
  'config/foo.yaml': { string: foo },
  'config/bar.yaml': { string: bar },
});

Deno.test('data from files', () => {
  const files = ['config/foo.yaml', 'config/bar.yaml']
  const readFile = f => read(f, { encoding: Encoding.String });
  dataFromFiles(readFile, files).then(v => {
    assertEquals(v, new Map([
      ['config/foo.yaml', foo],
      ['config/bar.yaml', bar],
    ]));
  });
});

Deno.test('generate data from dir', () => {
  const data = dataFromDir({ dir, read, Encoding });
  return data('config').then(d => assertEquals(d, new Map([
    ['foo.yaml', foo],
    ['bar.yaml', bar],
  ])));
});
