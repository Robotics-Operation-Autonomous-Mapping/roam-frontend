import type { Member, MemberRole } from "./types";

/** Recruitment dashboard — admins + leads see all applications */
export function canAccessRecruitment(role: MemberRole): boolean {
  return role === "admin" || role === "lead";
}

/** All-members CMS — captains / admins only */
export function canAccessAllMembers(role: MemberRole): boolean {
  return role === "admin";
}

/** Email composer — captains / admins only */
export function canAccessCompose(role: MemberRole): boolean {
  return role === "admin";
}

export function isAdmin(member: Pick<Member, "role">): boolean {
  return member.role === "admin";
}

export function isLead(member: Pick<Member, "role">): boolean {
  return member.role === "lead" || member.role === "admin";
}
