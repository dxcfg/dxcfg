import { param } from '../../deps.ts';
import billing from "./billing.js"
import * as k from './kubernetes.js';
import { PrometheusRule } from './alert.js';
import { writeSync } from '../../deps.ts'

const service = await param.object('service', billing);

const ns = service.namespace;
const name = service.name;


[
    { path: `${ns}/${name}-ns.yaml`, value: k.Namespace(service) },
    { path: `${ns}/${name}-deploy.yaml`, value: k.Deployment(service) },
    { path: `${ns}/${name}-svc.yaml`, value: k.Service(service) },
    { path: `${ns}/${name}-ingress.yaml`, value: k.Ingress(service) },
    { path: `${ns}/${name}-prometheus-rule.yaml`, value: PrometheusRule(service) },
].forEach((f) => {
    writeSync(f.value, f.path)
});
