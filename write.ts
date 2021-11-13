import { tomlStringify, yamlStringify } from "./deps.ts";

export enum Format {
  FromExtension,
  JSON,
  YAML,
  TOML,
  RAW,
  MULTI_JSON, // multiple json documents delimited by \n
  MULTI_YAML, // multiple yaml documents delimited by ---\n
}

export interface WriteOptions {
  format?: Format;
  indent?: number;
}

function valuesFormatFromPath(path: string): Format {
  const ext = path.split(".").pop();
  switch (ext) {
    case "yaml":
    case "yml":
      return Format.YAML;
    case "json":
      return Format.JSON;
    case "toml":
      return Format.TOML;
    default:
      return Format.RAW;
  }
}

export function formatText(
  value: any,
  path = "",
  opts: WriteOptions = {},
): string {
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
    case Format.MULTI_YAML:
      if (!Array.isArray(value)) {
        throw new Error("expected array for Format.MULTI_YAML");
      }
      return value.map((v) => yamlStringify(v, { indent: indent })).join(
        "---\n",
      );

    case Format.YAML:
      return yamlStringify(value, { indent: indent });
    case Format.TOML:
      return tomlStringify(value);
    case Format.MULTI_JSON:
      if (!Array.isArray(value)) {
        throw new Error("expected array for Format.MULTI_JSON");
      }
      return value.map((v) => JSON.stringify(v, null, indent)).join(
        "\n",
      );
    case Format.JSON:
      return JSON.stringify(value, null, indent);
    case Format.RAW:
      return value.toString();
    default:
      break;
  }
  return value.toString();
}

export function write(
  value: any,
  path = "",
  opts: WriteOptions = {},
): Promise<void> {
  return Deno.writeTextFile(path, formatText(value, path, opts));
}

export function writeSync(
  value: any,
  path = "",
  opts: WriteOptions = {},
): void {
  Deno.writeTextFileSync(path, formatText(value, path, opts));
}
