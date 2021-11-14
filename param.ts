import { getValue, setValue } from "./deps.ts";
import { read, readSync } from "./read.ts";
import { merge } from "./merge.ts";

const splitkv = (str: string): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};
  const [key, ...rest] = str.split("=");
  const value = rest.join("=");
  if (!key.includes(".")) {
    obj[key] = value;
    return obj;
  }
  setValue(obj, key, value);
  return obj;
};

const parseParams = async (
  defaults?: Record<string, unknown>,
  args?: string[],
): Promise<Record<string, unknown>> => {
  let params: Record<string, unknown> = {};
  if (!args || args.length == 0) {
    args = Deno.args;
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-p" || arg === "--parameter") {
      const param = splitkv(args[i + 1]);
      params = merge(params, param);
    }
    if (arg === "-f" || arg === "--parameters") {
      const param = await read(args[i + 1]);
      params = merge(params, param);
    }
  }

  params = merge(defaults, params);

  return params;
};

const parseParamsSync = (
  defaults?: Record<string, unknown>,
  args?: string[],
): Record<string, unknown> => {
  if (!args || args.length == 0) {
    args = Deno.args;
  }
  let params: Record<string, unknown> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-p" || arg === "--parameter") {
      const param = splitkv(args[i + 1]);
      params = merge(params, param);
    }
    if (arg === "-f" || arg === "--parameters") {
      const param = readSync(args[i + 1]);
      params = merge(params, param);
    }
  }
  params = merge(defaults, params);
  return params;
};

export class param {
  private static async getParamValue(
    key: string,
    defaultValue?: unknown,
    args?: string[],
  ): Promise<unknown> {
    const defaults: Record<string, unknown> = {};
    if (!key) {
      throw new Error("key is undefined");
    }
    if (defaultValue) {
      if (!key.includes(".")) {
        defaults[key] = defaultValue;
      } else {
        setValue(defaults, key, defaultValue);
      }
    }
    const params = await parseParams(defaults, args);
    return getValue(params, key);
  }
  static async all(
    defaults?: Record<string, unknown>,
    args?: string[],
  ): Promise<Record<string, unknown>> {
    const params = await parseParams(defaults, args);
    return params;
  }
  static async string(
    key: string,
    defaultValue?: string,
    args?: string[],
  ): Promise<string> {
    const paramValue = await this.getParamValue(key, defaultValue, args);
    return paramValue as string;
  }
  static async number(
    key: string,
    defaultValue?: number,
    args?: string[],
  ): Promise<number> {
    // deno-lint-ignore no-explicit-any
    let defaultValueStr: any;
    if (defaultValue) {
      defaultValueStr = String(defaultValue);
    }
    const paramValue = await this.getParamValue(
      key,
      defaultValueStr,
      args,
    );
    return Number(paramValue);
  }
  static async boolean(
    key: string,
    defaultValue?: boolean,
    args?: string[],
  ): Promise<boolean> {
    // deno-lint-ignore no-explicit-any
    let defaultValueStr: any;
    if (defaultValue) {
      defaultValueStr = String(defaultValue);
    }
    const paramValue = await this.getParamValue(
      key,
      defaultValueStr,
      args,
    );
    return Boolean(paramValue);
  }
  static async object(
    key: string,
    defaultValue?: Record<string, unknown>,
    args?: string[],
  ): Promise<Record<string, unknown>> {
    const paramValue = await this.getParamValue(key, defaultValue, args);
    return paramValue as Record<string, unknown>;
  }
}

export class paramSync {
  private static getParamValue(
    key: string,
    defaultValue?: unknown,
    args?: string[],
  ): unknown {
    const defaults: Record<string, unknown> = {};
    if (!key) {
      throw new Error("key is undefined");
    }
    if (defaultValue) {
      if (!key.includes(".")) {
        defaults[key] = defaultValue;
      } else {
        setValue(defaults, key, defaultValue);
      }
    }
    const params = parseParamsSync(defaults, args);
    return getValue(params, key);
  }
  static all(
    defaults?: Record<string, unknown>,
    args?: string[],
  ): Record<string, unknown> {
    const params = parseParamsSync(defaults, args);
    return params;
  }
  static string(
    key: string,
    defaultValue?: string,
    args?: string[],
  ): string {
    const paramValue = this.getParamValue(key, defaultValue, args);
    return paramValue as string;
  }
  static number(
    key: string,
    defaultValue?: number,
    args?: string[],
  ): number {
    // deno-lint-ignore no-explicit-any
    let defaultValueStr: any;
    if (defaultValue) {
      defaultValueStr = String(defaultValue);
    }
    const paramValue = this.getParamValue(key, defaultValueStr, args);
    return Number(paramValue);
  }
  static boolean(
    key: string,
    defaultValue?: boolean,
    args?: string[],
  ): boolean {
    // deno-lint-ignore no-explicit-any
    let defaultValueStr: any;
    if (defaultValue) {
      defaultValueStr = String(defaultValue);
    }
    const paramValue = this.getParamValue(key, defaultValueStr, args);
    return Boolean(paramValue);
  }
  static object(
    key: string,
    defaultValue?: Record<string, unknown>,
    args?: string[],
  ): Record<string, unknown> {
    const paramValue = this.getParamValue(key, defaultValue, args);
    return paramValue as Record<string, unknown>;
  }
}
