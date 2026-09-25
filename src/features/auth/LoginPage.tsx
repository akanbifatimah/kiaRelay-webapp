import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate, type Location } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "../../components/Button";
import { PasswordField } from "../../components/PasswordField";
import { useToast } from "../../components/toast/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { isAuthenticated, login } from "./authStorage";
import { findMemberByEmail, touchMember } from "../access/teamMembers";
import { DEV_PASSWORD } from "../access/teamMembersData";
import { logAudit } from "../access/auditLog";
import { DevLoginHint } from "./DevLoginHint";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

// TODO: dev-only mock credential check — replace with a real POST
// /auth/login call once the backend exists. Any active member of the admin
// team (features/access/teamMembersData.ts) can sign in with the shared dev
// password; their role/modules then decide what they see.

export function LoginPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
  });

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";

  function onSubmit(values: LoginFormValues) {
    const member = findMemberByEmail(values.email);
    if (!member || values.password !== (member.password ?? DEV_PASSWORD)) return showToast("error", "Invalid email or password.");
    if (!member.active) return showToast("error", "This account has been deactivated. Contact a Super Admin to restore access.");
    login(member.email);
    touchMember(member.id);
    logAudit({ actor: member.name, category: "auth", action: "Signed in", target: member.email });
    showToast("success", `Welcome back, ${member.name.split(" ")[0]}.`);
    // A restricted "from" page would just show Access Restricted — the
    // shell's route guard handles that, so no special-casing here.
    navigate(from, { replace: true });
  }

  return (
    <AuthLayout>
      <p className="pb-6 text-center text-sm text-text-muted">Logistics Command Center</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">Email Address</span>
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                <input
                  {...field}
                  type="email"
                  placeholder="admin@kiarelay.com"
                  className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </label>
          )}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">Password</span>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordField control={control} name="password" label="" rules={{ required: "Password is required" }} />
        </div>

        <Controller
          name="remember"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                {...field}
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              Remember me on this device
            </label>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      {/* Shown on deployed builds too, so testers can find the role accounts
          (client request, 2026-09-25). Hide it by setting
          VITE_SHOW_DEV_ACCOUNTS=false in the host's environment and redeploying.
          TODO: remove before going public — it lists working credentials. */}
      {import.meta.env.VITE_SHOW_DEV_ACCOUNTS !== "false" && <DevLoginHint />}

      <hr className="my-6 border-border" />
      <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secure Enterprise Login
      </p>
    </AuthLayout>
  );
}
