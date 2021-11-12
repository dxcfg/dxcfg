import { long } from './index.js';
import { valuesForGenerate } from '../generate.js';

export function generateFromShorts(shorts) {
  const longs = Promise.all(shorts.map(async (v) => {
    const s = await Promise.resolve(v);
    return long(s);
  }));
  return valuesForGenerate(longs);
}
