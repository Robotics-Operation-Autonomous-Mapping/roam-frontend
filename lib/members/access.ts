import type { Member, MemberRole } from "./types";

export function canAccessRecruitment(role: MemberRole): boolean {
  return role === "admin" || role === "lead";
}

export function canAccessAllMembers(role: MemberRole): boolean {
  return role === "admin";
}

export function canAccessCompose(role: MemberRole): boolean {
  return role === "admin";
}

export function isLead(member: Pick<Member, "role">): boolean {
  return member.role === "lead" || member.role === "admin";
}
