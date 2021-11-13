/* Generated for api/batch/v1/mod.ts */
import { ObjectReference, PodTemplateSpec } from "../../core/v1/mod.ts";
import {
  LabelSelector,
  ListMeta,
  ObjectMeta,
  Time,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";

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
  return { apiVersion: "batch/v1", kind: "CronJob", ...data };
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
  return { apiVersion: "batch/v1", kind: "CronJobList", ...data };
}

/** CronJobSpec describes how the job execution will look like and when it will actually run. */
export type CronJobSpec = {
  /** Specifies how to treat concurrent executions of a Job. Valid values are: - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one */
  concurrencyPolicy?: string;

  /** The number of failed finished jobs to retain. Value must be non-negative integer. Defaults to 1. */
  failedJobsHistoryLimit?: number;

  /** Specifies the job that will be created when executing a CronJob. */
  jobTemplate: JobTemplateSpec;

  /** The schedule in Cron format, see https:en.wikipedia.orgwikiCron. */
  schedule: string;

  /** Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones. */
  startingDeadlineSeconds?: number;

  /** The number of successful finished jobs to retain. Value must be non-negative integer. Defaults to 3. */
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

/** Job represents the configuration of a single job. */
export type Job = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Specification of the desired behavior of a job. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#spec-and-status */
  spec?: JobSpec;

  /** Current status of a job. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#spec-and-status */
  status?: JobStatus;
};
export function createJob<T extends Omit<Job, "apiVersion" | "kind">>(
  data: T,
): Job & T & Pick<Job, "apiVersion" | "kind"> {
  return { apiVersion: "batch/v1", kind: "Job", ...data };
}

/** JobCondition describes current state of a job. */
export type JobCondition = {
  /** Last time the condition was checked. */
  lastProbeTime?: Time;

  /** Last time the condition transit from one status to another. */
  lastTransitionTime?: Time;

  /** Human readable message indicating details about last transition. */
  message?: string;

  /** (brief) reason for the condition's last transition. */
  reason?: string;

  /** Status of the condition, one of True, False, Unknown. */
  status: string;

  /** Type of job condition, Complete or Failed. */
  type: string;
};

/** JobList is a collection of jobs. */
export type JobList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** items is the list of Jobs. */
  items: Job[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard list metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createJobList<T extends Omit<JobList, "apiVersion" | "kind">>(
  data: T,
): JobList & T & Pick<JobList, "apiVersion" | "kind"> {
  return { apiVersion: "batch/v1", kind: "JobList", ...data };
}

/** JobSpec describes how the job execution will look like. */
export type JobSpec = {
  /** Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be positive integer. If a Job is suspended (at creation or through an update), this timer will effectively be stopped and reset when the Job is resumed again. */
  activeDeadlineSeconds?: number;

  /** Specifies the number of retries before marking this job failed. Defaults to 6 */
  backoffLimit?: number;

  /** CompletionMode specifies how Pod completions are tracked. It can be `NonIndexed` (default) or `Indexed`.

`NonIndexed` means that the Job is considered complete when there have been .spec.completions successfully completed Pods. Each Pod completion is homologous to each other.

`Indexed` means that the Pods of a Job get an associated completion index from 0 to (.spec.completions - 1), available in the annotation batch.kubernetes.iojob-completion-index. The Job is considered complete when there is one successfully completed Pod for each index. When value is `Indexed`, .spec.completions must be specified and `.spec.parallelism` must be less than or equal to 10^5. In addition, The Pod name takes the form `$(job-name)-$(index)-$(random-string)`, the Pod hostname takes the form `$(job-name)-$(index)`.

This field is beta-level. More completion modes can be added in the future. If the Job controller observes a mode that it doesn't recognize, the controller skips updates for the Job. */
  completionMode?: string;

  /** Specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https:kubernetes.iodocsconceptsworkloadscontrollersjobs-run-to-completion */
  completions?: number;

  /** manualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensionsv1beta1` API. More info: https:kubernetes.iodocsconceptsworkloadscontrollersjobs-run-to-completion#specifying-your-own-pod-selector */
  manualSelector?: boolean;

  /** Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https:kubernetes.iodocsconceptsworkloadscontrollersjobs-run-to-completion */
  parallelism?: number;

  /** A label query over pods that should match the pod count. Normally, the system sets this field for you. More info: https:kubernetes.iodocsconceptsoverviewworking-with-objectslabels#label-selectors */
  selector?: LabelSelector;

  /** Suspend specifies whether the Job controller should create Pods or not. If a Job is created with suspend set to true, no Pods are created by the Job controller. If a Job is suspended after creation (i.e. the flag goes from false to true), the Job controller will delete all active Pods associated with this Job. Users must design their workload to gracefully handle this. Suspending a Job will reset the StartTime field of the Job, effectively resetting the ActiveDeadlineSeconds timer too. Defaults to false.

This field is beta-level, gated by SuspendJob feature flag (enabled by default). */
  suspend?: boolean;

  /** Describes the pod that will be created when executing a job. More info: https:kubernetes.iodocsconceptsworkloadscontrollersjobs-run-to-completion */
  template: PodTemplateSpec;

  /** ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes. This field is alpha-level and is only honored by servers that enable the TTLAfterFinished feature. */
  ttlSecondsAfterFinished?: number;
};

/** JobStatus represents the current state of a Job. */
export type JobStatus = {
  /** The number of actively running pods. */
  active?: number;

  /** CompletedIndexes holds the completed indexes when .spec.completionMode = "Indexed" in a text format. The indexes are represented as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7". */
  completedIndexes?: string;

  /** Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. The completion time is only set when the job finishes successfully. */
  completionTime?: Time;

  /** The latest available observations of an object's current state. When a Job fails, one of the conditions will have type "Failed" and status true. When a Job is suspended, one of the conditions will have type "Suspended" and status true; when the Job is resumed, the status of this condition will become false. When a Job is completed, one of the conditions will have type "Complete" and status true. More info: https:kubernetes.iodocsconceptsworkloadscontrollersjobs-run-to-completion */
  conditions?: JobCondition[];

  /** The number of pods which reached phase Failed. */
  failed?: number;

  /** Represents time when the job controller started processing a job. When a Job is created in the suspended state, this field is not set until the first time it is resumed. This field is reset every time a Job is resumed from suspension. It is represented in RFC3339 form and is in UTC. */
  startTime?: Time;

  /** The number of pods which reached phase Succeeded. */
  succeeded?: number;

  /** UncountedTerminatedPods holds the UIDs of Pods that have terminated but the job controller hasn't yet accounted for in the status counters.

The job controller creates pods with a finalizer. When a pod terminates (succeeded or failed), the controller does three steps to account for it in the job status: (1) Add the pod UID to the arrays in this field. (2) Remove the pod finalizer. (3) Remove the pod UID from the arrays while increasing the corresponding
    counter.

This field is alpha-level. The job controller only makes use of this field when the feature gate PodTrackingWithFinalizers is enabled. Old jobs might not be tracked using this field, in which case the field remains null. */
  uncountedTerminatedPods?: UncountedTerminatedPods;
};

/** JobTemplateSpec describes the data a Job should have when created from a template */
export type JobTemplateSpec = {
  /** Standard object's metadata of the jobs created from this template. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** Specification of the desired behavior of the job. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#spec-and-status */
  spec?: JobSpec;
};

/** UncountedTerminatedPods holds UIDs of Pods that have terminated but haven't been accounted in Job status counters. */
export type UncountedTerminatedPods = {
  /** Failed holds UIDs of failed Pods. */
  failed?: string[];

  /** Succeeded holds UIDs of succeeded Pods. */
  succeeded?: string[];
};
