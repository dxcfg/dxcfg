
// Encode a native string (UTF16) of ASCII characters as an array of UTF8 bytes.
function ascii2bytes(str) {
  const result = new Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    result[i] = str.charCodeAt(i);
  }
  return result;
}

export { ascii2bytes };
