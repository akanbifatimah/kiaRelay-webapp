interface EmailStepHeaderProps {
  step: number;
  title: string;
}

export function EmailStepHeader({ step, title }: EmailStepHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-text text-xs font-semibold text-white">
          {step}
        </span>
        <h2 className="text-sm font-semibold text-text">{title}</h2>
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Step {step} of 3</span>
    </div>
  );
}
