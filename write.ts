import {
  ensureFile,
  ensureFileSync,
  tomlStringify,
  yamlStringify,
} from "./deps.ts";

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
  if (!path) {
    return Format.RAW;
  }
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

export function stringify(
  value: any,
  opts: WriteOptions = {},
): string {
  if (value === undefined) {
    throw TypeError("cannot write undefined value");
  }
  const {
    format = Format.MULTI_JSON,
    indent = 2,
  } = opts;

  switch (format) {
    case Format.MULTI_YAML:
      if (!Array.isArray(value)) {
        throw new Error("expected array for Format.MULTI_YAML");
      }
      return value.map((v) =>
        yamlStringify(v, { indent: indent, skipInvalid: true })
      ).join(
        "---\n",
      );

    case Format.YAML:
      return yamlStringify(value, { indent: indent, skipInvalid: true });
    case Format.TOML:
      return tomlStringify(value);
    case Format.MULTI_JSON:
      if (!Array.isArray(value)) {
        throw new Error("expected array for Format.MULTI_JSON");
      }
      return value.map((v) => JSON.stringify(v)).join(
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

export async function write(
  value: any,
  path = "",
  opts: WriteOptions = {},
): Promise<void> {
  if (!value) {
    throw new Error("value is undefined");
  }

  const {
    format = Format.FromExtension,
    indent = 2,
  } = opts;

  let writeFormat = format;
  if (writeFormat === Format.FromExtension && path) {
    writeFormat = valuesFormatFromPath(path);
  }
  await ensureFile(path);
  return Deno.writeTextFile(
    path,
    stringify(value, { format: writeFormat, indent: indent }),
  );
}

export function writeSync(
  value: any,
  path = "",
  opts: WriteOptions = {},
): void {
  if (!value) {
    throw new Error("value is undefined");
  }

  const {
    format = Format.FromExtension,
    indent = 2,
  } = opts;

  let writeFormat = format;
  if (writeFormat === Format.FromExtension && path) {
    writeFormat = valuesFormatFromPath(path);
  }

  ensureFileSync(path);
  Deno.writeTextFileSync(
    path,
    stringify(value, { format: writeFormat, indent: indent }),
  );
}
