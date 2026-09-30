import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OnboardingCarousel } from "./OnboardingCarousel";
import { RegisterStepper } from "./RegisterStepper";

interface RegisterShellProps {
  step: number;
  onBack?: () => void;
  children: ReactNode;
}

// Web layout for "Sign Up: Business" (2026-09-29). On desktop the mobile
// onboarding slides rotate in a navy panel on the left; the form column
// keeps the design's navy "Register your business" banner and stepper.
// Below lg, the side panel drops away and it reads like the mobile screen.
export function RegisterShell({ step, onBack, children }: RegisterShellProps) {
  const back = "inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white";
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden bg-navy-brand lg:sticky lg:top-0 lg:block lg:h-screen">
        <OnboardingCarousel />
      </aside>
      <main className="flex min-w-0 flex-col">
        <header className="relative overflow-hidden bg-navy-brand px-6 pb-6 pt-5 sm:px-10">
          <img src="/business/signup-business.webp" alt="" className="absolute inset-y-0 right-0 h-full w-1/2 object-cover object-top opacity-50 mask-[linear-gradient(to_right,transparent,black_40%)]" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between">
              {onBack ? (
                <button type="button" onClick={onBack} className={back}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <Link to="/login" className={back}>
                  <ArrowLeft className="h-4 w-4" />
                  Sign in
                </Link>
              )}
              <img src="/business/logo.png" alt="KiaRelay" className="h-8 w-auto rounded bg-white/95 px-1.5 py-0.5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Register your business</h1>
              <p className="mt-1 text-sm text-white/75">Set up invoicing and team access</p>
            </div>
            <div className="max-w-md">
              <RegisterStepper step={step} />
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-10">{children}</div>
      </main>
    </div>
  );
}
