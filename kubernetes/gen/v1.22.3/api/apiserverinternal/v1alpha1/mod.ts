/* Generated for api/apiserverinternal/v1alpha1/mod.ts */
import {
  ListMeta,
  ObjectMeta,
  Time,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";

/** An API server instance reports the version it can decode and the version it encodes objects to when persisting objects in the backend. */
export type ServerStorageVersion = {
  /** The ID of the reporting API server. */
  apiServerID?: string;

  /** The API server can decode objects encoded in these versions. The encodingVersion must be included in the decodableVersions. */
  decodableVersions?: string[];

  /** The API server encodes the object to this version when persisting it in the backend (e.g., etcd). */
  encodingVersion?: string;
};

/**
 Storage version of a specific resource. */
export type StorageVersion = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** The name is <group>.<resource>. */
  metadata?: ObjectMeta;

  /** Spec is an empty spec. It is here to comply with Kubernetes API style. */
  spec: StorageVersionSpec;

  /** API server instances report the version they can decode and the version they encode objects to when persisting objects in the backend. */
  status: StorageVersionStatus;
};
export function createStorageVersion<
  T extends Omit<StorageVersion, "apiVersion" | "kind">,
>(data: T): StorageVersion & T & Pick<StorageVersion, "apiVersion" | "kind"> {
  return {
    apiVersion: "internal.apiserver.k8s.io/v1alpha1",
    kind: "StorageVersion",
    ...data,
  };
}

/** Describes the state of the storageVersion at a certain point. */
export type StorageVersionCondition = {
  /** Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;

  /** A human readable message indicating details about the transition. */
  message?: string;

  /** If set, this represents the .metadata.generation that the condition was set based upon. */
  observedGeneration?: number;

  /** The reason for the condition's last transition. */
  reason: string;

  /** Status of the condition, one of True, False, Unknown. */
  status: string;

  /** Type of the condition. */
  type: string;
};

/** A list of StorageVersions. */
export type StorageVersionList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Items holds a list of StorageVersion */
  items: StorageVersion[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard list metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createStorageVersionList<
  T extends Omit<StorageVersionList, "apiVersion" | "kind">,
>(
  data: T,
): StorageVersionList & T & Pick<StorageVersionList, "apiVersion" | "kind"> {
  return {
    apiVersion: "internal.apiserver.k8s.io/v1alpha1",
    kind: "StorageVersionList",
    ...data,
  };
}

/** StorageVersionSpec is an empty spec. */
export type StorageVersionSpec = {};

/** API server instances report the versions they can decode and the version they encode objects to when persisting objects in the backend. */
export type StorageVersionStatus = {
  /** If all API server instances agree on the same encoding storage version, then this field is set to that version. Otherwise this field is left empty. API servers should finish updating its storageVersionStatus entry before serving write operations, so that this field will be in sync with the reality. */
  commonEncodingVersion?: string;

  /** The latest available observations of the storageVersion's state. */
  conditions?: StorageVersionCondition[];

  /** The reported versions per API server instance. */
  storageVersions?: ServerStorageVersion[];
};
