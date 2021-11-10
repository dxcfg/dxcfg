import { Format } from "./write.ts";
import { tomlParse, yamlParse } from "./deps.ts";

export interface ReadOptions {
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

export async function read(
  path = "",
  opts: ReadOptions = {},
): Promise<Record<string, never>> {
  const { format = Format.FromExtension } = opts;
  let readFormat = format;
  if (readFormat === Format.FromExtension && path) {
    readFormat = valuesFormatFromPath(path);
  }
  const text = await Deno.readTextFile(path);
  const promise = new Promise<Record<string, never>>((resolve, reject) => {
    // the resolve / reject functions control the fate of the promise
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
      default:
        reject(new Error(`unknown format: ${format}`));
        break;
    }
  });

  return promise;
}
