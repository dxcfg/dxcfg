import { apps, core } from '../api.ts';
import { transform, valueMap, mapper, drop } from './transform.js';

// Take a constructor (e.g., from the API) and return a transformer
// that will construct the API resource given a API resource "shape".
function makeResource(Ctor, spec) {
  return (v) => {
    const shape = transform(spec, v);
    let name = '';
    if (shape && shape.metadata && shape.metadata.name) {
      ({ metadata: { name } } = shape);
    }
    return new Ctor(name, shape);
  };
}

const topLevel = {
  version: 'apiVersion',
  // `kind` is not transformed here, rather used as the dispatch
  // mechanism, and supplied by the specific API resource constructor
};

const objectMeta = {
  // ObjectMeta
  name: 'metadata.name',
  namespace: 'metadata.namespace',
  labels: 'metadata.labels',
  annotations: 'metadata.annotations',
};

function volumeSpec(name, vol) {
  if (typeof vol === 'string') {
    return volumeSpec(name, { vol_type: vol });
  }
  const { vol_type: volType } = vol;
  let spec;
  switch (volType) {
    case 'empty_dir':
      spec = {
        name,
        emptyDir: transform({
          max_size: 'sizeLimit',
          medium: valueMap('medium', {
            memory: 'Memory',
          }),
        }, vol),
      };
      break;
    default:
      throw new Error(`vol_type ${volType} not supported`);
  }

  return spec;
}

function volumes(volumeMap) {
  const vols = [];
  // In the original shorts, the value of `name` is used in a
  // volume(mount)'s `store` field to refer back to a particular
  // volume. This _could_ be checked at generation time, with a little
  // extra bookkeeping.
  for (const [name, spec] of Object.entries(volumeMap)) {
    vols.push(volumeSpec(name, spec));
  }
  return {
    spec: { volumes: vols },
  };
}

function affinities() {
  throw new Error('affinity not supported yet');
}

function hostAliases(specs) {
  const aliases = [];
  for (const spec of specs) {
    const [ip, ...hostnames] = spec.split(' ');
    aliases.push({ ip, hostnames });
  }
  return {
    spec: { aliases },
  };
}

function hostMode(flags) {
  const spec = {};
  for (const flag of flags) {
    switch (flag) {
      case 'net':
        spec.hostNetwork = true;
        break;
      case 'pid':
        spec.hostPID = true;
        break;
      case 'ipc':
        spec.hostIPC = true;
        break;
      default:
        throw new Error(`host mode flag ${flag} unexpected`);
    }
  }
  return { spec };
}

function hostName(h) {
  const [hostname, ...subdomain] = h.split('.');
  const spec = { hostname };
  if (subdomain.length > 0) {
    spec.subdomain = subdomain.join('.');
  }
  return { spec };
}

function account(accountStr) {
  const [name, maybeAuto] = accountStr.split(':');
  const spec = { serviceAccountName: name };
  if (maybeAuto === 'auto') {
    spec.autoMountServiceAccountToken = true;
  }
  return { spec };
}

function tolerations() {
  throw new Error('tolerations not implemented yet');
}

function priority(p) {
  const { value } = p;
  const spec = { priority: value };
  if (p.class !== undefined) {
    spec.priorityClassName = p.class;
  }
  return { spec };
}

function envVars(envs) {
  const env = [];
  const envFrom = [];
  /* eslint-disable no-continue */
  for (const e of envs) {
    if (typeof e === 'string') {
      const [name, value] = e.split('=');
      env.push({ name, value });
      continue;
    }

    // There are two kinds of env entry using references: `env` which
    // refers to a specific field in a ConfigMap or Secret, and
    // `envFrom` which imports all values from ConfigMap or Secret,
    // possibly with a prefix. In shorts, which is meant is determined
    // by the presence of a third segment of the (':'-delimited)
    // `from` value.
    const { from, key, required } = e;
    const [kind, name, field] = from.split(':');

    // If no field is given in `from`, it's an `envFrom`
    if (field === undefined) {
      const ref = { name };
      if (required !== undefined) ref.optional = !required;
      const allFrom = { prefix: key };
      switch (kind) {
        case 'config':
          allFrom.configMapRef = ref;
          break;
        case 'secret':
          allFrom.secretRef = ref;
          break;
        default:
          throw new Error(`kind for envVar of ${kind} not supported`);
      }
      envFrom.push(allFrom);
      continue;
    }

    // If a field is given, it's an `env`. In this case, the `key`
    // value is the name of the env var, and the field is the key in
    // the referenced resource.
    const ref = { key: field, name };
    if (required !== undefined) ref.optional = !required;
    const valueFrom = {};
    switch (kind) {
      case 'config':
        valueFrom.configMapKeyRef = ref;
        break;
      case 'secret':
        valueFrom.secretKeyRef = ref;
        break;
      default:
        throw new Error(`kind for envVar of ${kind} not supported`);
    }
    env.push({ name: key, valueFrom });
  }
  return { env, envFrom };
}

function resource(res) {
  return ({ min, max }) => {
    const resources = {};
    if (min !== undefined) resources.requests = { [res]: min };
    if (max !== undefined) resources.limits = { [res]: max };
    return { resources };
  };
}

const action = {
  command: args => ({ exec: { command: args } }),
  net: () => { throw new Error('net actions not implemented yet'); },
};

const probe = {
  ...action,
  delay: 'initialDelaySeconds',
  timeout: 'timeoutSeconds',
  interval: 'periodSeconds',
  min_count_success: 'successThreshold',
  min_count_failure: 'failureThreshold',
};

const portRe = /(?:(tcp|udp):\/\/)?(?:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):)?(?:(\d{1,5}):)?(\d{1,5})/;

function ports(pp) {
  function parseContainerPort(p) {
    let spec = p;
    let name;
    if (typeof p === 'object') {
      for (name of Object.keys(p)) {
        spec = p[name];
        break;
      }
    } else {
      spec = String(p);
    }
    const [/* scheme */, protocol, hostIP, hostPort, containerPort] = spec.match(portRe);
    const port = {
      name,
      protocol: protocol && protocol.toUpperCase(),
      hostIP,
      hostPort,
      containerPort,
    };
    Object.keys(port).forEach(k => port[k] === undefined && delete port[k]);
    return port;
  }
  return { ports: pp.map(parseContainerPort) };
}

/* eslint-disable quote-props */
const volumeMount = {
  mount: 'mountPath',
  store: 'name',
  propagation: valueMap('mountPropagation', {
    'host-to-container': 'HostToContainer',
    'bidirectional': 'Bidirectional',
  }),
};

/* eslint-disable quote-props */
const containerSpec = {
  name: 'name',
  command: 'command',
  args: 'args',
  env: envVars,
  image: 'image',
  pull: valueMap('imagePullPolicy', {
    'always': 'Always',
    'never': 'Never',
    'if-not-present': 'IfNotPresent',
  }),
  on_start: [action, 'lifecycle.postStart'],
  pre_stop: [action, 'lifecycle.preStop'],
  cpu: resource('cpu'),
  mem: resource('memory'),
  cap_add: 'securityContext.capabilities.add',
  cap_drop: 'securityContext.capabilities.drop',
  privileged: 'securityContext.privileged',
  allow_escalation: 'securityContext.allowPrivilegeEscalation',
  rw: [v => !v, 'securityContext.readOnlyRootFilesystem'],
  ro: 'securityContext.readOnlyRootFilesystem',
  force_non_root: 'securityContext.runAsNonRoot',
  uid: 'securityContext.runAsUser',
  selinux: 'securityContext.seLinuxOptions',
  liveness_probe: [probe, 'livenessProbe'],
  readiness_probe: [probe, 'readinessProbe'],
  expose: ports,
  stdin: 'stdin',
  stdin_once: 'stdinOnce',
  tty: 'tty',
  wd: 'workingDir',
  termination_message_path: 'terminationMessagePath',
  terminal_message_policy: valueMap('terminationMessagePolicy', {
    file: 'File',
    'fallback-to-logs-on-error': 'FallbackToLogsOnError',
  }),
  volume: [mapper(volumeMount), 'volumeMounts'],
};

/* eslint-disable object-shorthand */
const podTemplateSpec = {
  volumes: volumes,
  affinity: affinities,
  node: 'spec.nodeName',
  containers: [mapper(containerSpec), 'spec.containers'],
  init_containers: [mapper(containerSpec), 'spec.initContainers'],
  dns_policy: valueMap('spec.dnsPolicy', {
    'cluster-first': 'ClusterFirst',
    'cluster-first-with-host-net': 'ClusterFirstWithHostNet',
    'default': 'Default',
  }),
  host_aliases: hostAliases,
  host_mode: hostMode,
  hostname: hostName,
  registry_secrets: [mapper(name => ({ name })), 'spec.imagePullSecrets'],
  restart_policy: valueMap('spec.restartPolicy', {
    'always': 'Always',
    'on-failure': 'OnFailure',
    'never': 'Never',
  }),
  scheduler_name: 'spec.schedulerName',
  account: account,
  tolerations: tolerations,
  termination_grace_period: 'spec.terminationGracePeriodSeconds',
  active_deadline: 'spec.activeDeadlineSeconds',
  priority: priority,
  fs_gid: 'spec.securityContext.fsGroup',
  gids: 'spec.securityContext.supplementalGroups',
};

const podSpec = {
  ...topLevel,
  ...objectMeta,
  ...podTemplateSpec,
};

const deploymentSpec = {
  ...topLevel,
  ...objectMeta,
  // metadata (labels, annotations) are used in the pod template
  pod_meta: drop('spec.template', objectMeta),
  // these are particular to deployments
  replicas: 'spec.replicas',
  recreate: valueMap('spec.strategy.type', {
    true: 'Recreate',
    false: 'RollingUpdate',
  }),
  max_unavailable: 'spec.strategy.rollingUpdate.maxUnavailable',
  max_extra: 'spec.strategy.rollingUpdate.maxSurge',
  min_ready: 'spec.minReadySeconds',
  max_revs: 'spec.revisionHistoryLimit',
  progress_deadline: 'spec.progressDeadlineSeconds',
  paused: 'spec.paused',
  selector: 'spec.selector.matchLabels',
  // most of the pod spec fields appear as a pod template
  ...drop('spec.template', podTemplateSpec),
};

function sessionAffinity(value) {
  switch (typeof value) {
    case 'boolean':
      return { sessionAffinity: 'ClientIP' };
    case 'number':
      return {
        sessionAffinity: 'ClientIP',
        sessionAffinityConfig: {
          clientIP: {
            timeoutSeconds: value,
          },
        },
      };
    default:
      throw new Error(`service stickiness of type ${typeof value} not supported`);
  }
}

const serviceSpec = {
  ...topLevel,
  ...objectMeta,
  cname: 'spec.externalName',
  type: valueMap('spec.type', {
    'cluster-ip': 'ClusterIP',
    'load-balancer': 'LoadBalancer',
    'node-port': 'NodePort',
  }),
  selector: 'spec.selector',
  external_ips: 'externalIPs',
  // port, node_port, ports -> TODO
  cluster_ip: 'clusterIP',
  unready_endpoints: 'publishNotReadyAddresses',
  route_policy: valueMap('externalTrafficPolicy', {
    'node-local': 'Node',
    'cluster-wide': 'Cluster',
  }),
  stickiness: sessionAffinity,
  lb_ip: 'loadBalancerIP',
  lb_client_ips: 'loadBalancerSourceRanges',
  healthcheck_port: 'healthCheckNodePort',
};

// TODO all the other ones.
// TODO register new transforms (e.g., for custom resources).

export default {
  namespace: makeResource(core.v1.Namespace, objectMeta),
  pod: makeResource(core.v1.Pod, podSpec),
  deployment: makeResource(apps.v1.Deployment, deploymentSpec),
  service: makeResource(core.v1.Service, serviceSpec),
};
