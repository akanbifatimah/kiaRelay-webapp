import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { BusinessAccount } from "../businessTypes";

const COPY: Record<BusinessAccount["status"], { title: string; body: string; label: string; icon: typeof Clock; tone: string }> = {
  pending: {
    title: "Application Submitted",
    body: "We're reviewing your business details. You'll receive an email within 1 business day.",
    label: "Under Review",
    icon: Clock,
    tone: "bg-primary/10 text-primary",
  },
  verified: {
    title: "You're all set!",
    body: "Your company is verified and invoice billing is active. Book and track deliveries in the KiaRelay app by choosing KiaRelay Business.",
    label: "Verified",
    icon: CheckCircle2,
    tone: "bg-success/10 text-success",
  },
  rejected: {
    title: "We couldn't verify your company",
    body: "Some details didn't match our records. Contact support and we'll help you fix it.",
    label: "Needs Attention",
    icon: XCircle,
    tone: "bg-danger/10 text-danger",
  },
};

// The "Verification Status" design (Application Submitted / You're all set),
// laid out for desktop: illustration beside the message and status card.
// It reads the live account, so an admin's decision shows up here.
export function BusinessStatusHero({ account }: { account: BusinessAccount }) {
  const copy = COPY[account.status];
  return (
    <Card className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
      <img src="/business/verification-status.webp" alt="" className="aspect-square w-full max-w-56 rounded-3xl object-cover" />
      <div className="flex flex-1 flex-col gap-4 text-center sm:text-left">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">{copy.title}</h1>
          <p className="mt-2 text-sm text-text-muted">{copy.body}</p>
        </div>
        <div className="flex items-center gap-3 rounded-(--radius-card) border border-border p-4 text-left">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", copy.tone)}>
            <copy.icon className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-xs text-text-muted">Status</p>
            <p className="font-semibold text-text">{copy.label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Ref No.</p>
            <p className="font-semibold text-text">#{account.reference}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
