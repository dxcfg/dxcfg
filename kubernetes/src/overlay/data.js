// dataFromFiles reads the contents of each file given and returns a
// Map of the filenames to file contents.
async function dataFromFiles(readEncoded, files) {
  const result = new Map();
  await Promise.all(files.map(f => readEncoded(f).then((c) => {
    result.set(f, c);
  })));
  return result;
}

// Given `dir` and `read` procedures, construct a map of file basename
// to file contents (as strings).
const dataFromDir = ({ dir, read, Encoding }) => async function data(path) {
  const d = dir(path);
  const files = d.files.filter(({ isdir }) => !isdir).map(({ name }) => name);
  const readFile = f => read(`${path}/${f}`, { encoding: Encoding.String });
  return dataFromFiles(readFile, files);
};

export { dataFromFiles, dataFromDir };
