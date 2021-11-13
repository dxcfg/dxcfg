/* Generated for api/authentication/v1/mod.ts */
import {
  ObjectMeta,
  Time,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";

/** BoundObjectReference is a reference to an object that a token is bound to. */
export type BoundObjectReference = {
  /** API version of the referent. */
  apiVersion?: string;

  /** Kind of the referent. Valid kinds are 'Pod' and 'Secret'. */
  kind?: string;

  /** Name of the referent. */
  name?: string;

  /** UID of the referent. */
  uid?: string;
};

/** TokenRequest requests a token for a given service account. */
export type TokenRequest = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Spec holds information about the request being evaluated */
  spec: TokenRequestSpec;

  /** Status is filled in by the server and indicates whether the token can be authenticated. */
  status?: TokenRequestStatus;
};
export function createTokenRequest<
  T extends Omit<TokenRequest, "apiVersion" | "kind">,
>(data: T): TokenRequest & T & Pick<TokenRequest, "apiVersion" | "kind"> {
  return {
    apiVersion: "authentication.k8s.io/v1",
    kind: "TokenRequest",
    ...data,
  };
}

/** TokenRequestSpec contains client provided parameters of a token request. */
export type TokenRequestSpec = {
  /** Audiences are the intendend audiences of the token. A recipient of a token must identitfy themself with an identifier in the list of audiences of the token, and otherwise should reject the token. A token issued for multiple audiences may be used to authenticate against any of the audiences listed but implies a high degree of trust between the target audiences. */
  audiences: string[];

  /** BoundObjectRef is a reference to an object that the token will be bound to. The token will only be valid for as long as the bound object exists. NOTE: The API server's TokenReview endpoint will validate the BoundObjectRef, but other audiences may not. Keep ExpirationSeconds small if you want prompt revocation. */
  boundObjectRef?: BoundObjectReference;

  /** ExpirationSeconds is the requested duration of validity of the request. The token issuer may return a token with a different validity duration so a client needs to check the 'expiration' field in a response. */
  expirationSeconds?: number;
};

/** TokenRequestStatus is the result of a token request. */
export type TokenRequestStatus = {
  /** ExpirationTimestamp is the time of expiration of the returned token. */
  expirationTimestamp: Time;

  /** Token is the opaque bearer token. */
  token: string;
};

/** TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver. */
export type TokenReview = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Spec holds information about the request being evaluated */
  spec: TokenReviewSpec;

  /** Status is filled in by the server and indicates whether the request can be authenticated. */
  status?: TokenReviewStatus;
};
export function createTokenReview<
  T extends Omit<TokenReview, "apiVersion" | "kind">,
>(data: T): TokenReview & T & Pick<TokenReview, "apiVersion" | "kind"> {
  return {
    apiVersion: "authentication.k8s.io/v1",
    kind: "TokenReview",
    ...data,
  };
}

/** TokenReviewSpec is a description of the token authentication request. */
export type TokenReviewSpec = {
  /** Audiences is a list of the identifiers that the resource server presented with the token identifies as. Audience-aware token authenticators will verify that the token was intended for at least one of the audiences in this list. If no audiences are provided, the audience will default to the audience of the Kubernetes apiserver. */
  audiences?: string[];

  /** Token is the opaque bearer token. */
  token?: string;
};

/** TokenReviewStatus is the result of the token authentication request. */
export type TokenReviewStatus = {
  /** Audiences are audience identifiers chosen by the authenticator that are compatible with both the TokenReview and token. An identifier is any identifier in the intersection of the TokenReviewSpec audiences and the token's audiences. A client of the TokenReview API that sets the spec.audiences field should validate that a compatible audience identifier is returned in the status.audiences field to ensure that the TokenReview server is audience aware. If a TokenReview returns an empty status.audience field where status.authenticated is "true", the token is valid against the audience of the Kubernetes API server. */
  audiences?: string[];

  /** Authenticated indicates that the token was associated with a known user. */
  authenticated?: boolean;

  /** Error indicates that the token couldn't be checked */
  error?: string;

  /** User is the UserInfo associated with the provided token. */
  user?: UserInfo;
};

/** UserInfo holds the information about the user needed to implement the user.Info interface. */
export type UserInfo = {
  /** Any additional information provided by the authenticator. */
  extra?: {
    [key: string]: string[];
  };

  /** The names of groups this user is a part of. */
  groups?: string[];

  /** A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs. */
  uid?: string;

  /** The name that uniquely identifies this user among all active users. */
  username?: string;
};
