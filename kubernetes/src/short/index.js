// "Short" forms for API objects.
//
// This is the inspiration and target format: https://docs.koki.io/short/

import kinds from './kinds.js';

// long takes a short description and turns it into a full API object.
function long(obj) {
  const [kind] = Object.keys(obj);
  const tx = kinds[kind];
  if (tx === undefined) {
    throw new Error(`unknown kind: ${kind}`);
  }
  return tx(obj[kind]);
}

export { long };
