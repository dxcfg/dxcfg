import { merge } from '../../../mod.ts';

// Given a means of getting parameters, and a specification of the
// Values (including their defaults), compile a struct of values for
// instantiating a chart. To discriminate the values from other
// parameters, an option is the prefix; by default, we expect the
// command-line values to be passed as e.g., `-p values.image.tag=v1`,
// and any file(s) (e.g., passed as `-f value.json`) to be of the form
//
// ```
// values:
//   image:
//     repository: helloworld
// ```
const values = (param, opts = {}) => function compile(defaults) {
  const { prefix = 'values' } = opts;
  const commandLine = param.Object(prefix, {});
  return merge(defaults, commandLine);
};

export { values };
