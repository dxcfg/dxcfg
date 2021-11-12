import { generateConfigMap, generateSecret } from '../src/overlay/generators.js';
import { v1 as core } from "https://deno.land/x/deploykit@0.0.22/generated/k8s/v1.18.3/api/core/mod.ts";
import { fs } from './mock.js';
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test('empty configmap', () => {
  const gen = generateConfigMap((f, { encoding }) => {
    throw new Error('unexpected read of ${f}');
  });
  return gen({ name: 'foo-conf' }).then((v) => {
    assertEquals(v, new core.createConfigMap({ metadata: { name: 'foo-conf' }, data: {} }));
  })
});

Deno.test('files and literals', () => {
  const { read } = fs({}, {
    'config/foo.yaml': { string: 'foo: bar' },
  });
  const readStr = f => read(f, { encoding: 'string' });
  const gen = generateConfigMap(readStr);
  const conf = {
    name: 'foo-conf',
    files: ['config/foo.yaml'],
    literals: ['some.property=some.value'],
  };
  return gen(conf).then((v) => {
    assertEquals(v, new core.createConfigMap({
      metadata: { name: 'foo-conf' },
      data: {
        'foo.yaml': 'foo: bar',
        'some.property': 'some.value',
      }
    }));
  });
});

Deno.test('secret from literal', () => {
  // this relies on a known base64 encoding:
  // 'foobar' -> 'Zm9vYmFy' (NB no trailing newline)
  const foobar = 'foobar';
  const foobarEncoded = 'Zm9vYmFy';
  const read = () => {
    return Promise.resolve(new Uint8Array([102, 111, 111, 98, 97, 114]));
  };
  const gen = generateSecret(read);
  const conf = {
    name: 'foo-secret',
    files: ['foo.bin'],
    literals: ['foo.literal=foobar'],
  };

  return gen(conf).then((v) => {
    assertEquals(v, new core.createSecret({
      metadata: { name: 'foo-secret' },
      data: {
        'foo.bin': foobarEncoded,
        'foo.literal': foobarEncoded,
      }
    }));
  });
});
