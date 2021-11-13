/* Generated for api/events/v1beta1/mod.ts */
import { EventSource, ObjectReference } from "../../core/v1/mod.ts";
import {
  ListMeta,
  MicroTime,
  ObjectMeta,
  Time,
} from "../../../apimachinery/pkg/apis/meta/v1/mod.ts";

/** Event is a report of an event somewhere in the cluster. It generally denotes some state change in the system. Events have a limited retention time and triggers and messages may evolve with time.  Event consumers should not rely on the timing of an event with a given Reason reflecting a consistent underlying trigger, or the continued existence of events with that Reason.  Events should be treated as informative, best-effort, supplemental data. */
export type Event = {
  /** action is what action was takenfailed regarding to the regarding object. It is machine-readable. This field can have at most 128 characters. */
  action?: string;

  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** deprecatedCount is the deprecated field assuring backward compatibility with core.v1 Event type. */
  deprecatedCount?: number;

  /** deprecatedFirstTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type. */
  deprecatedFirstTimestamp?: Time;

  /** deprecatedLastTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type. */
  deprecatedLastTimestamp?: Time;

  /** deprecatedSource is the deprecated field assuring backward compatibility with core.v1 Event type. */
  deprecatedSource?: EventSource;

  /** eventTime is the time when this Event was first observed. It is required. */
  eventTime: MicroTime;

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard object's metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ObjectMeta;

  /** note is a human-readable description of the status of this operation. Maximal length of the note is 1kB, but libraries should be prepared to handle values up to 64kB. */
  note?: string;

  /** reason is why the action was taken. It is human-readable. This field can have at most 128 characters. */
  reason?: string;

  /** regarding contains the object this Event is about. In most cases it's an Object reporting controller implements, e.g. ReplicaSetController implements ReplicaSets and this event is emitted because it acts on some changes in a ReplicaSet object. */
  regarding?: ObjectReference;

  /** related is the optional secondary object for more complex actions. E.g. when regarding object triggers a creation or deletion of related object. */
  related?: ObjectReference;

  /** reportingController is the name of the controller that emitted this Event, e.g. `kubernetes.iokubelet`. This field cannot be empty for new Events. */
  reportingController?: string;

  /** reportingInstance is the ID of the controller instance, e.g. `kubelet-xyzf`. This field cannot be empty for new Events and it can have at most 128 characters. */
  reportingInstance?: string;

  /** series is data about the Event series this event represents or nil if it's a singleton Event. */
  series?: EventSeries;

  /** type is the type of this event (Normal, Warning), new types could be added in the future. It is machine-readable. */
  type?: string;
};
export function createEvent<T extends Omit<Event, "apiVersion" | "kind">>(
  data: T,
): Event & T & Pick<Event, "apiVersion" | "kind"> {
  return { apiVersion: "events.k8s.io/v1beta1", kind: "Event", ...data };
}

/** EventList is a list of Event objects. */
export type EventList = {
  /** APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#resources */
  apiVersion?: string;

  /** items is a list of schema objects. */
  items: Event[];

  /** Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#types-kinds */
  kind?: string;

  /** Standard list metadata. More info: https:git.k8s.iocommunitycontributorsdevelsig-architectureapi-conventions.md#metadata */
  metadata?: ListMeta;
};
export function createEventList<
  T extends Omit<EventList, "apiVersion" | "kind">,
>(data: T): EventList & T & Pick<EventList, "apiVersion" | "kind"> {
  return { apiVersion: "events.k8s.io/v1beta1", kind: "EventList", ...data };
}

/** EventSeries contain information on series of events, i.e. thing that wasis happening continuously for some time. */
export type EventSeries = {
  /** count is the number of occurrences in this series up to the last heartbeat time. */
  count: number;

  /** lastObservedTime is the time when last Event from the series was seen before last heartbeat. */
  lastObservedTime: MicroTime;
};
