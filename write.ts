import { tomlStringify, yamlStringify } from "./deps.ts";
import { valuesFormatFromPath } from "./read.ts";

export enum Format {
  FromExtension,
  JSON,
  YAML,
  TOML,
  RAW,
}

export interface WriteOptions {
  format?: Format;
  indent?: number;
}

export function write(
  value: any,
  path = "",
  opts: WriteOptions = {},
): Promise<void> {
  if (value === undefined) {
    throw TypeError("cannot write undefined value");
  }

  const {
    format = Format.FromExtension,
    indent = 2,
  } = opts;

  let writeFormat = format;
  if (writeFormat === Format.FromExtension && path) {
    writeFormat = valuesFormatFromPath(path);
  }

  switch (writeFormat) {
    case Format.YAML:
      return Deno.writeTextFile(path, yamlStringify(value, { indent: indent }));
    case Format.TOML:
      return Deno.writeTextFile(path, tomlStringify(value));
    case Format.JSON:
      return Deno.writeTextFile(path, JSON.stringify(value, null, indent));
    case Format.RAW:
      return Deno.writeTextFile(path, value.toString());
    default:
      break;
  }
  return Deno.writeTextFile(path, value.toString());
}
