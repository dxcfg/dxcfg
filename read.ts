import { Format } from "./write.ts";
import { tomlParse, yamlParse } from "./deps.ts";

export enum Encoding {
  Bytes = 0,
  String = 1,
  JSON = 2,
}

export interface ReadOptions {
  encoding?: Encoding;
  format?: Format;
}

export function valuesFormatFromPath(path: string): Format {
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

export async function read(path = "", opts: ReadOptions = {}): Promise<any> {
  const { encoding = Encoding.JSON, format = Format.FromExtension } = opts;
  let readFormat = format;
  if (readFormat === Format.FromExtension && path) {
    readFormat = valuesFormatFromPath(path);
  }
  const text = await Deno.readTextFile(path);
  const promise = new Promise<any>((resolve, reject) => {
    switch (encoding) {
      case Encoding.String:
        resolve(text);
        break;
      case Encoding.Bytes:
        resolve(new TextEncoder().encode(text));
        break;
      case Encoding.JSON:
        switch (readFormat) {
          case Format.JSON:
            resolve(JSON.parse(text));
            break;
          case Format.YAML:
            resolve(yamlParse(text) as any);
            break;
          case Format.TOML:
            resolve(tomlParse(text) as any);
            break;
          case Format.RAW:
            resolve(text);
            break;
          default:
            reject(new Error(`unknown format: ${format}`));
            break;
        }
        break;
      default:
        reject(new Error(`unknown encoding: ${encoding}`));
        break;
    }
  });

  return promise;
}

export function readSync(path = "", opts: ReadOptions = {}): unknown {
  const { encoding = Encoding.JSON, format = Format.FromExtension } = opts;
  let readFormat = format;
  if (readFormat === Format.FromExtension && path) {
    readFormat = valuesFormatFromPath(path);
  }
  const text = Deno.readTextFileSync(path);
  switch (encoding) {
    case Encoding.String:
      return text;
    case Encoding.Bytes:
      return new TextEncoder().encode(text);
    case Encoding.JSON:
      switch (readFormat) {
        case Format.JSON:
          return JSON.parse(text);
        case Format.YAML:
          return yamlParse(text);
        case Format.TOML:
          return tomlParse(text);
        case Format.RAW:
          return text;
        default:
          throw new Error(`unknown format: ${format}`);
      }
    default:
      throw new Error(`unknown encoding: ${encoding}`);
  }
}
