/* Generated for kube-aggregator/pkg/apis/apiregistration/v1/mod.ts */
import {
  ListMeta,
  ObjectMeta,
  Time,
} from "../../../../../apimachinery/pkg/apis/meta/v1/mod.ts";

/** APIService represents a server for a particular GroupVersion. Name must be "version.group". */
export type APIService = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Spec contains information for locating and communicating with a server */
  spec?: APIServiceSpec;

  /** Status contains derived information about an API server */
  status?: APIServiceStatus;
};
export function createAPIService<
  T extends Omit<APIService, "apiVersion" | "kind">,
>(data: T): APIService & T & Pick<APIService, "apiVersion" | "kind"> {
  return {
    apiVersion: "apiregistration.k8s.io/v1",
    kind: "APIService",
    ...data,
  };
}

/** APIServiceCondition describes the state of an APIService at a particular point */
export type APIServiceCondition = {
  /** Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;

  /** Human-readable message indicating details about last transition. */
  message?: string;

  /** Unique, one-word, CamelCase reason for the condition's last transition. */
  reason?: string;

  /** Status is the status of the condition. Can be True, False, Unknown. */
  status: string;

  /** Type is the type of the condition. */
  type: string;
};

/** APIServiceList is a list of APIService objects. */
export type APIServiceList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Items is the list of APIService */
  items: APIService[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard list metadata More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createAPIServiceList<
  T extends Omit<APIServiceList, "apiVersion" | "kind">,
>(data: T): APIServiceList & T & Pick<APIServiceList, "apiVersion" | "kind"> {
  return {
    apiVersion: "apiregistration.k8s.io/v1",
    kind: "APIServiceList",
    ...data,
  };
}

/** APIServiceSpec contains information for locating and communicating with a server. Only https is supported, though you are able to disable certificate verification. */
export type APIServiceSpec = {
  /** CABundle is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. If unspecified, system trust roots on the apiserver are used. */
  caBundle?: string;

  /** Group is the API group name this server hosts */
  group?: string;

  /** GroupPriorityMininum is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones. Note that other versions of this group might specify even higher GroupPriorityMininum values such that the whole group gets a higher priority. The primary sort is based on GroupPriorityMinimum, ordered highest number to lowest (20 before 10). The secondary sort is based on the alphabetical comparison of the name of the object.  (v1.bar before v1.foo) We'd recommend something like: *.k8s.io (except extensions) at 18000 and PaaSes (OpenShift, Deis) are recommended to be in the 2000s */
  groupPriorityMinimum: number;

  /** InsecureSkipTLSVerify disables TLS certificate verification when communicating with this server. This is strongly discouraged.  You should use the CABundle instead. */
  insecureSkipTLSVerify?: boolean;

  /** Service is a reference to the service for this API server.  It must communicate on port 443. If the Service is nil, that means the handling for the API groupversion is handled locally on this server. The call will simply delegate to the normal handler chain to be fulfilled. */
  service?: ServiceReference;

  /** Version is the API version this server hosts.  For example, "v1" */
  version?: string;

  /** VersionPriority controls the ordering of this API version inside of its group.  Must be greater than zero. The primary sort is based on VersionPriority, ordered highest to lowest (20 before 10). Since it's inside of a group, the number can be small, probably in the 10s. In case of equal version priorities, the version string will be used to compute the order inside a group. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10. */
  versionPriority: number;
};

/** APIServiceStatus contains derived information about an API server */
export type APIServiceStatus = {
  /** Current service state of apiService. */
  conditions?: APIServiceCondition[];
};

/** ServiceReference holds a reference to Service.legacy.k8s.io */
export type ServiceReference = {
  /** Name is the name of the service */
  name?: string;

  /** Namespace is the namespace of the service */
  namespace?: string;

  /** If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive). */
  port?: number;
};
