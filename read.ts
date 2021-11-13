import { Format } from "./write.ts";
import { readJsonLines, tomlParse, yamlParse, yamlParseAll } from "./deps.ts";

export enum Encoding {
  Bytes = 0,
  String = 1,
  JSON = 2,
}

export interface ReadOptions {
  encoding?: Encoding;
  format?: Format;
}

function valuesFormatFromPath(path: string): Format {
  const ext = path.split(".").pop();
  switch (ext) {
    case "yaml":
    case "yml":
      return Format.MULTI_YAML;
    case "json":
      return Format.MULTI_JSON;
    case "toml":
      return Format.TOML;
    default:
      return Format.RAW;
  }
}

function parseText(text: string, encoding: Encoding, readFormat: Format): any {
  switch (encoding) {
    case Encoding.String:
      return text;
    case Encoding.Bytes:
      return new TextEncoder().encode(text);
    case Encoding.JSON:
      switch (readFormat) {
        case Format.MULTI_JSON: {
          const arr = readJsonLines(text);
          if (arr.length <= 1) {
            return JSON.parse(text);
          }
          return arr;
        }
        case Format.MULTI_YAML:
          if (!text.includes("---\n")) {
            return yamlParse(text);
          }
          return yamlParseAll(text);
        case Format.TOML:
          return tomlParse(text);
        case Format.RAW:
          return text;

        default:
          throw new Error(`unknown format: ${readFormat}`);
      }
    default:
      new Error(`unknown encoding: ${encoding}`);
      break;
  }

  return text;
}

export async function read(path = "", opts: ReadOptions = {}): Promise<any> {
  const { encoding = Encoding.JSON, format = Format.FromExtension } = opts;
  let readFormat = format;
  if (readFormat === Format.FromExtension && path) {
    readFormat = valuesFormatFromPath(path);
  }
  const text = await Deno.readTextFile(path);
  return parseText(text, encoding, readFormat);
}

export function readSync(path = "", opts: ReadOptions = {}): Promise<any> {
  const { encoding = Encoding.JSON, format = Format.FromExtension } = opts;
  let readFormat = format;
  if (readFormat === Format.FromExtension && path) {
    readFormat = valuesFormatFromPath(path);
  }
  const text = Deno.readTextFileSync(path);
  return parseText(text, encoding, readFormat);
}
