/**
 * The validate module exports a default value for use with `jk
 * validate`.
 */
import { validateWithFile, param } from '../../mod.ts';
import { schemaPath } from './schema.js';

const defaultK8sVersion = 'v1.16.0';

export function validateSchema(k8sVersion, value) {
  const path = schemaPath(k8sVersion, value.apiVersion, value.kind);
  return validateWithFile(value, `schemas/${path}`)
}

export default function validate(value) {
  const k8sVersion = param.String('k8s-version', defaultK8sVersion)
  return validateSchema(k8sVersion, value);
}
