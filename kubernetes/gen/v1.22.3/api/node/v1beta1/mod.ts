/* Generated for api/node/v1beta1/mod.ts */
import { Quantity } from "../../../apimachinery/pkg/api/resource/mod.ts";
import {
  ListMeta,
  ObjectMeta,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";
import { Toleration } from "../../core/v1/mod.ts";

/** Overhead structure represents the resource overhead associated with running a pod. */
export type Overhead = {
  /** PodFixed represents the fixed resource overhead associated with running a pod. */
  podFixed?: {
    [key: string]: Quantity;
  };
};

/** RuntimeClass defines a class of container runtime supported in the cluster. The RuntimeClass is used to determine which container runtime is used to run all containers in a pod. RuntimeClasses are (currently) manually defined by a user or cluster provisioner, and referenced in the PodSpec. The Kubelet is responsible for resolving the RuntimeClassName reference before running the pod.  For more details, see https:git.k8s.ioenhancementskepssig-node585-runtime-class */
export type RuntimeClass = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Handler specifies the underlying runtime and configuration that the CRI implementation will use to handle pods of this class. The possible values are specific to the node & CRI configuration.  It is assumed that all handlers are available on every node, and handlers of the same name are equivalent on every node. For example, a handler called "runc" might specify that the runc OCI runtime (using native Linux containers) will be used to run the containers in a pod. The Handler must be lowercase, conform to the DNS Label (RFC 1123) requirements, and is immutable. */
  handler: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. For more details, see https:git.k8s.ioenhancementskepssig-node688-pod-overheadREADME.md This field is beta-level as of Kubernetes v1.18, and is only honored by servers that enable the PodOverhead feature. */
  overhead?: Overhead;

  /** Scheduling holds the scheduling constraints to ensure that pods running with this RuntimeClass are scheduled to nodes that support it. If scheduling is nil, this RuntimeClass is assumed to be supported by all nodes. */
  scheduling?: Scheduling;
};
export function createRuntimeClass<
  T extends Omit<RuntimeClass, "apiVersion" | "kind">,
>(data: T): RuntimeClass & T & Pick<RuntimeClass, "apiVersion" | "kind"> {
  return { apiVersion: "node.k8s.io/v1beta1", kind: "RuntimeClass", ...data };
}

/** RuntimeClassList is a list of RuntimeClass objects. */
export type RuntimeClassList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Items is a list of schema objects. */
  items: RuntimeClass[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard list metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createRuntimeClassList<
  T extends Omit<RuntimeClassList, "apiVersion" | "kind">,
>(
  data: T,
): RuntimeClassList & T & Pick<RuntimeClassList, "apiVersion" | "kind"> {
  return {
    apiVersion: "node.k8s.io/v1beta1",
    kind: "RuntimeClassList",
    ...data,
  };
}

/** Scheduling specifies the scheduling constraints for nodes supporting a RuntimeClass. */
export type Scheduling = {
  /** nodeSelector lists labels that must be present on nodes that support this RuntimeClass. Pods using this RuntimeClass can only be scheduled to a node matched by this selector. The RuntimeClass nodeSelector is merged with a pod's existing nodeSelector. Any conflicts will cause the pod to be rejected in admission. */
  nodeSelector?: {
    [key: string]: string;
  };

  /** tolerations are appended (excluding duplicates) to pods running with this RuntimeClass during admission, effectively unioning the set of nodes tolerated by the pod and the RuntimeClass. */
  tolerations?: Toleration[];
};
