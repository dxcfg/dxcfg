import { ajv, ValidateFunction } from "./deps.ts";

export function validateWithObject(
  obj: any,
  schema: Record<string, any>,
): boolean {
  const validate: ValidateFunction = ajv.compile(schema);
  if (!validate(obj)) throw new Error(ajv.errorsText(validate.errors));
  else {
    return true;
  }
}

export function validateWithFile(
  obj: any,
  schemaPath: string,
): boolean {
  const schema = JSON.parse(Deno.readTextFileSync(schemaPath));
  const validate: ValidateFunction = ajv.compile(schema);
  if (!validate(obj)) throw new Error(ajv.errorsText(validate.errors));
  else {
    return true;
  }
}
