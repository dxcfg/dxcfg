import { Format } from "./write.ts";
import { tomlParse, tomlStringify, yamlParse, yamlStringify } from "./deps.ts";

// deno-lint-ignore no-explicit-any
export function parse(input: string, format?: Format): any {
  switch (format) {
    case Format.JSON:
      return JSON.parse(input);
    case Format.YAML:
      return yamlParse(input);
    case Format.TOML:
      return tomlParse(input);
    default:
      throw (new Error(`unknown format: ${format}`));
  }
}

// deno-lint-ignore no-explicit-any
export function stringify(obj: any, format?: Format): any {
  switch (format) {
    case Format.JSON:
      return JSON.stringify(obj);
    case Format.YAML:
      return yamlStringify(obj);
    case Format.TOML:
      return tomlStringify(obj);
    default:
      throw (new Error(`unknown format: ${format}`));
  }
}
