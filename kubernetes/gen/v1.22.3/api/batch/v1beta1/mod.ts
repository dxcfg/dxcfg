/* Generated for api/batch/v1beta1/mod.ts */
import { ObjectReference } from "../../core/v1/mod.ts";
import {
  ListMeta,
  ObjectMeta,
  Time,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";
import { JobSpec } from "../v1/mod.ts";

/** CronJob represents the configuration of a single cron job. */
export type CronJob = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Specification of the desired behavior of a cron job, including the schedule. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#spec-and-status */
  spec?: CronJobSpec;

  /** Current status of a cron job. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#spec-and-status */
  status?: CronJobStatus;
};
export function createCronJob<T extends Omit<CronJob, "apiVersion" | "kind">>(
  data: T,
): CronJob & T & Pick<CronJob, "apiVersion" | "kind"> {
  return { apiVersion: "batch/v1beta1", kind: "CronJob", ...data };
}

/** CronJobList is a collection of cron jobs. */
export type CronJobList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** items is the list of CronJobs. */
  items: CronJob[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard list metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createCronJobList<
  T extends Omit<CronJobList, "apiVersion" | "kind">,
>(data: T): CronJobList & T & Pick<CronJobList, "apiVersion" | "kind"> {
  return { apiVersion: "batch/v1beta1", kind: "CronJobList", ...data };
}

/** CronJobSpec describes how the job execution will look like and when it will actually run. */
export type CronJobSpec = {
  /** Specifies how to treat concurrent executions of a Job. Valid values are: - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one */
  concurrencyPolicy?: string;

  /** The number of failed finished jobs to retain. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1. */
  failedJobsHistoryLimit?: number;

  /** Specifies the job that will be created when executing a CronJob. */
  jobTemplate: JobTemplateSpec;

  /** The schedule in Cron format, see https:en.wikipedia.orgwikiCron. */
  schedule: string;

  /** Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones. */
  startingDeadlineSeconds?: number;

  /** The number of successful finished jobs to retain. This is a pointer to distinguish between explicit zero and not specified. Defaults to 3. */
  successfulJobsHistoryLimit?: number;

  /** This flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false. */
  suspend?: boolean;
};

/** CronJobStatus represents the current state of a cron job. */
export type CronJobStatus = {
  /** A list of pointers to currently running jobs. */
  active?: ObjectReference[];

  /** Information when was the last time the job was successfully scheduled. */
  lastScheduleTime?: Time;

  /** Information when was the last time the job successfully completed. */
  lastSuccessfulTime?: Time;
};

/** JobTemplateSpec describes the data a Job should have when created from a template */
export type JobTemplateSpec = {
  /** Standard object's metadata of the jobs created from this template. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Specification of the desired behavior of the job. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#spec-and-status */
  spec?: JobSpec;
};
