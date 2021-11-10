import { flagsParse } from "./deps.ts";
export const param = (defaults?: Record<string, unknown>): object => {
  const obj = flagsParse(Deno.args, { default: defaults });
  return {
    all: (): object | undefined => {
      return obj;
    },
    String: (path: string, defaultValue?: string): string | undefined => {
      return obj[path] || defaultValue;
    },
    Boolean: (path: string, defaultValue?: boolean): boolean | undefined => {
      return obj[path] || defaultValue;
    },
    Number: (path: string, defaultValue?: number): number | undefined => {
      return obj[path] || defaultValue;
    },
    Object: (path: string, defaultValue?: object): object | undefined => {
      return obj[path] || defaultValue;
    },
  };
};
