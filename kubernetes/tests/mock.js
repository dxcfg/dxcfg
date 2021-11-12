const dir = dirs => path => {
  if (path in dirs) {
    return dirs[path];
  }
  throw new Error(`path not found ${path}`);
};

const read = files => async function r(path, { encoding }) {
  if (path in files) {
    const encodings = files[path];
    if (encoding in encodings) {
      return encodings[encoding];
    }
    throw new Error(`no value for encoding "${encoding}"`);
  }
  throw new Error(`file not found ${path}`);
};

function fs(dirs, files) {
  return {
    dir: dir(dirs),
    read: read(files),
    Encoding: Encoding,
  };
}

// It's not important what the values are, just that we use them
// consistently.
const Encoding = Object.freeze({
  String: 'string',
  JSON: 'json',
  Bytes: 'bytes',
});

export { fs, Encoding };