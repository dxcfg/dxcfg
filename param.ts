import { flagsParse } from "./deps.ts";

export const All = (defaults?: Record<string, unknown>): object | undefined => {
  const obj = flagsParse(Deno.args, { default: defaults });
  return obj;
};
export const String = (
  path: string,
  defaultValue?: string,
): string | undefined => {
  const obj = flagsParse(Deno.args, { default: { [path]: defaultValue } });
  return obj[path];
};
export const Boolean = (
  path: string,
  defaultValue?: boolean,
): boolean | undefined => {
  const obj = flagsParse(Deno.args, { default: { [path]: defaultValue } });
  return obj[path];
};
export const Number = (
  path: string,
  defaultValue?: number,
): number | undefined => {
  const obj = flagsParse(Deno.args, { default: { [path]: defaultValue } });
  return obj[path];
};
export const Object = (
  path: string,
  defaultValue?: object,
): object | undefined => {
  const obj = flagsParse(Deno.args, { default: { [path]: defaultValue } });
  return obj[path];
};
