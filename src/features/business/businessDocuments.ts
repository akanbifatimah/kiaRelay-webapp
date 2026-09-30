import { FileSignature, FileText, ShieldCheck, type LucideIcon } from "lucide-react";
import type { BusinessDocumentKey } from "./businessTypes";

/** The three required "Business verification" documents, in design order. */
export const BUSINESS_DOCUMENTS: { key: BusinessDocumentKey; title: string; description: string; icon: LucideIcon }[] = [
  { key: "registration", title: "Business Registration", description: "Articles of Incorporation or LLC filing.", icon: FileText },
  { key: "taxId", title: "Tax ID (W-9 / EIN)", description: "IRS W-9 or EIN confirmation letter.", icon: FileSignature },
  { key: "insurance", title: "Insurance Certificate", description: "Must show active commercial auto coverage.", icon: ShieldCheck },
];
