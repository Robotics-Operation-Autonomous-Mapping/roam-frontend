import { AppStatus } from "@/lib/supabase/client";

export const ALL_STATUSES: AppStatus[] = [
  "pending",
  "reviewed",
  "interview",
  "accepted",
  "rejected",
  "waitlisted",
];

export const STATUS_COLORS: Record<AppStatus, string> = {
  pending: "rgba(var(--status-pending-rgb), 1)",
  reviewed: "rgba(var(--status-reviewed-rgb), 1)",
  interview: "rgba(var(--status-interview-rgb), 1)",
  accepted: "rgba(var(--status-accepted-rgb), 1)",
  rejected: "rgba(var(--status-rejected-rgb), 1)",
  waitlisted: "rgba(var(--status-waitlisted-rgb), 1)",
};
