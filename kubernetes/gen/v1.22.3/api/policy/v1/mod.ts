/* Generated for api/policy/v1/mod.ts */
import { IntOrString } from "../../../apimachinery/pkg/util/intstr/mod.ts";
import {
  Condition,
  DeleteOptions,
  LabelSelector,
  ListMeta,
  ObjectMeta,
  Time,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";

/** Eviction evicts a pod from its node subject to certain policies and safety constraints. This is a subresource of Pod.  A request to cause such an eviction is created by POSTing to ...pods<pod name>evictions. */
export type Eviction = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** DeleteOptions may be provided */
  deleteOptions?: DeleteOptions;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** ObjectMeta describes the pod that is being evicted. */
  metadata?: ObjectMeta;
};
export function createEviction<T extends Omit<Eviction, "apiVersion" | "kind">>(
  data: T,
): Eviction & T & Pick<Eviction, "apiVersion" | "kind"> {
  return { apiVersion: "policy/v1", kind: "Eviction", ...data };
}

/** PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods */
export type PodDisruptionBudget = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Specification of the desired behavior of the PodDisruptionBudget. */
  spec?: PodDisruptionBudgetSpec;

  /** Most recently observed status of the PodDisruptionBudget. */
  status?: PodDisruptionBudgetStatus;
};
export function createPodDisruptionBudget<
  T extends Omit<PodDisruptionBudget, "apiVersion" | "kind">,
>(
  data: T,
): PodDisruptionBudget & T & Pick<PodDisruptionBudget, "apiVersion" | "kind"> {
  return { apiVersion: "policy/v1", kind: "PodDisruptionBudget", ...data };
}

/** PodDisruptionBudgetList is a collection of PodDisruptionBudgets. */
export type PodDisruptionBudgetList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Items is a list of PodDisruptionBudgets */
  items: PodDisruptionBudget[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createPodDisruptionBudgetList<
  T extends Omit<PodDisruptionBudgetList, "apiVersion" | "kind">,
>(
  data: T,
):
  & PodDisruptionBudgetList
  & T
  & Pick<PodDisruptionBudgetList, "apiVersion" | "kind"> {
  return { apiVersion: "policy/v1", kind: "PodDisruptionBudgetList", ...data };
}

/** PodDisruptionBudgetSpec is a description of a PodDisruptionBudget. */
export type PodDisruptionBudgetSpec = {
  /** An eviction is allowed if at most "maxUnavailable" pods selected by "selector" are unavailable after the eviction, i.e. even in absence of the evicted pod. For example, one can prevent all voluntary evictions by specifying 0. This is a mutually exclusive setting with "minAvailable". */
  maxUnavailable?: IntOrString;

  /** An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%". */
  minAvailable?: IntOrString;

  /** Label query over pods whose evictions are managed by the disruption budget. A null selector will match no pods, while an empty ({}) selector will select all pods within the namespace. */
  selector?: LabelSelector;
};

/** PodDisruptionBudgetStatus represents information about the status of a PodDisruptionBudget. Status may trail the actual state of a system. */
export type PodDisruptionBudgetStatus = {
  /** Conditions contain conditions for PDB. The disruption controller sets the DisruptionAllowed condition. The following are known values for the reason field (additional reasons could be added in the future): - SyncFailed: The controller encountered an error and wasn't able to compute
              the number of allowed disruptions. Therefore no disruptions are
              allowed and the status of the condition will be False.
- InsufficientPods: The number of pods are either at or below the number
                    required by the PodDisruptionBudget. No disruptions are
                    allowed and the status of the condition will be False.
- SufficientPods: There are more pods than required by the PodDisruptionBudget.
                  The condition will be True, and the number of allowed
                  disruptions are provided by the disruptionsAllowed property. */
  conditions?: Condition[];

  /** current number of healthy pods */
  currentHealthy: number;

  /** minimum desired number of healthy pods */
  desiredHealthy: number;

  /** DisruptedPods contains information about pods whose eviction was processed by the API server eviction subresource handler but has not yet been observed by the PodDisruptionBudget controller. A pod will be in this map from the time when the API server processed the eviction request to the time when the pod is seen by PDB controller as having been marked for deletion (or after a timeout). The key in the map is the name of the pod and the value is the time when the API server processed the eviction request. If the deletion didn't occur and a pod is still there it will be removed from the list automatically by PodDisruptionBudget controller after some time. If everything goes smooth this map should be empty for the most of the time. Large number of entries in the map may indicate problems with pod deletions. */
  disruptedPods?: {
    [key: string]: Time;
  };

  /** Number of pod disruptions that are currently allowed. */
  disruptionsAllowed: number;

  /** total number of pods counted by this disruption budget */
  expectedPods: number;

  /** Most recent generation observed when updating this PDB status. DisruptionsAllowed and other status information is valid only if observedGeneration equals to PDB's object generation. */
  observedGeneration?: number;
};
