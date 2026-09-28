import type { TeamMember } from "../access/teamMembers";

/** How the signed-in admin takes part in the Support Department workflow. */
export type SupportPersona = "lead-support" | "support-staff" | "lead-tech" | "tech-staff" | "admin";

export function supportPersona(member: TeamMember | undefined): SupportPersona {
  const role = member?.role;
  return role === "lead-support" || role === "support-staff" || role === "lead-tech" || role === "tech-staff" ? role : "admin";
}

export interface SupportCaps {
  /** Customer queue: see every ticket (leads) vs. only assigned ones (staff). */
  seeAllCustomer: boolean;
  assignCustomer: boolean;
  /** Staff → Lead Support: "please escalate this to Technical". */
  requestEscalation: boolean;
  escalateToTech: boolean;
  /** Close a resolved customer ticket (and notify the customer). */
  closeCustomer: boolean;
  seeAllTechnical: boolean;
  createTechIssue: boolean;
  assignTechnical: boolean;
  /** Verify a technical resolution and close it (sends it back to Lead Support). */
  verifyTechnical: boolean;
  /** Start / resolve tickets assigned to you. */
  workAssigned: boolean;
}

const NONE: SupportCaps = {
  seeAllCustomer: false, assignCustomer: false, requestEscalation: false, escalateToTech: false, closeCustomer: false,
  seeAllTechnical: false, createTechIssue: false, assignTechnical: false, verifyTechnical: false, workAssigned: true,
};

// The role definitions from the Support Department spec (TC-16, 2026-09-28).
// Admins outside the department who hold the Support module (Super Admin,
// Operations Admin, Custom) keep full access, as before.
const CAPS: Record<SupportPersona, SupportCaps> = {
  "lead-support": { ...NONE, seeAllCustomer: true, assignCustomer: true, escalateToTech: true, closeCustomer: true },
  "support-staff": { ...NONE, requestEscalation: true },
  "lead-tech": { ...NONE, seeAllTechnical: true, createTechIssue: true, assignTechnical: true, verifyTechnical: true },
  "tech-staff": { ...NONE },
  admin: {
    seeAllCustomer: true, assignCustomer: true, requestEscalation: false, escalateToTech: true, closeCustomer: true,
    seeAllTechnical: true, createTechIssue: true, assignTechnical: true, verifyTechnical: true, workAssigned: true,
  },
};

export const supportCaps = (member: TeamMember | undefined): SupportCaps => CAPS[supportPersona(member)];

export const personaTitle: Record<SupportPersona, string> = {
  "lead-support": "Lead Support",
  "support-staff": "Support Staff",
  "lead-tech": "Lead Technical Support",
  "tech-staff": "Technical Support Staff",
  admin: "Admin",
};
