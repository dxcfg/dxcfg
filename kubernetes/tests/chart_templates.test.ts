import { loadDir } from "../src/chart/template.js";
import { assertEquals, HandlebarsJS } from "../../deps.ts";
// deno-lint-ignore no-explicit-any
const compile = (HandlebarsJS as any).compile;

const dir = (path: string) => {
  if (path === "templates") {
    return {
      path,
      files: [
        { path: `templates/foo.yaml`, isDir: false, name: "foo.yaml" },
        { path: `templates/bar.yaml`, isDir: false, name: "bar.yaml" },
      ],
    };
  }
  throw new Error(`dir ${path} does not exist`);
};
const fooYAML = `
This is just some text.
`;

const barYAML = `
This is some text with a {{ values.variable }} reference.
`;

const readString = (path: string) => {
  switch (path) {
    case "templates/foo.yaml":
      return fooYAML;
    case "templates/bar.yaml":
      return barYAML;
  }
  throw new Error(`file ${path} not found`);
};

Deno.test("load a dir of templates", () => {
  const templates = loadDir({
    dir,
    readString,
    compile,
    parse: (s: any) => [s],
  });
  const out = templates({ variable: "handlebars" });
  return out.then(([foo, bar]) => {
    assertEquals(foo, fooYAML);
    assertEquals(
      (bar as string).trim(),
      "This is some text with a handlebars reference.",
    );
  });
});
