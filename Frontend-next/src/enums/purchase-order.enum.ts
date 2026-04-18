export enum POStatus {
  DRAFT = "DRAFT",
  CONFIRMED = "CONFIRMED",
  PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum POPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

export type POStatusType = `${POStatus}`;
export type POPriorityType = `${POPriority}`;
