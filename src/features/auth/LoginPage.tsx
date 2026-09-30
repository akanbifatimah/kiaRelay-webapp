import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate, type Location } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { PasswordField } from "../../components/PasswordField";
import { useToast } from "../../components/toast/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { isAuthenticated, login } from "./authStorage";
import { findMemberByEmail, touchMember, updateMember } from "../access/teamMembers";
import { DEV_PASSWORD, isInvitePending } from "../access/teamMembersData";
import { logAudit } from "../access/auditLog";
import { businessLogin, findBusinessByEmail, getBusinessSession } from "../business/businessAccounts";
import { DevLoginHint } from "./DevLoginHint";

interface LoginFormValues {
  email: string;
  password: string;
}

// The one sign-in page for everyone (PM decision, 2026-09-29). The account
// decides where you land: KiaRelay admins go to the dashboard (their role then
// decides what they see there), KiaRelay Business users go to their company
// account. New companies register from the link below the form.
// TODO: dev-only mock credential check — replace with a real POST
// /auth/login that returns the user's type and role, once the backend exists.
export function LoginPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit } = useForm<LoginFormValues>({ defaultValues: { email: "", password: "" } });

  if (isAuthenticated()) return <Navigate to="/" replace />;
  if (getBusinessSession()) return <Navigate to="/business/account" replace />;

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";

  function onSubmit(values: LoginFormValues) {
    const member = findMemberByEmail(values.email);
    if (member) {
      if (values.password !== (member.password ?? DEV_PASSWORD)) return showToast("error", "Invalid email or password.");
      if (!member.active) return showToast("error", "This account has been deactivated. Contact a Super Admin to restore access.");
      login(member.email);
      touchMember(member.id);
      logAudit({ actor: member.name, category: "auth", action: "Signed in", target: member.email });
      // First sign-in with an invite's temporary password (TC-09) accepts it.
      if (isInvitePending(member) && member.invite) {
        updateMember(member.id, { invite: { ...member.invite, acceptedAt: new Date().toISOString() } });
        logAudit({ actor: member.name, category: "users", action: "Accepted invite", target: member.email });
        showToast("success", `Welcome, ${member.name.split(" ")[0]}. Set your own password in My Account.`);
        return navigate("/account", { replace: true });
      }
      showToast("success", `Welcome back, ${member.name.split(" ")[0]}.`);
      // A restricted "from" page just shows Access Restricted via the shell's guard.
      return navigate(from, { replace: true });
    }

    const business = findBusinessByEmail(values.email);
    if (!business || business.password !== values.password) return showToast("error", "Invalid email or password.");
    businessLogin(business.owner.email);
    showToast("success", `Welcome back, ${business.owner.firstName}.`);
    navigate("/business/account", { replace: true });
  }

  return (
    <AuthLayout>
      <div className="pb-6 text-center">
        <h1 className="text-lg font-semibold text-text">Welcome back</h1>
        <p className="text-body mt-1 text-text-muted">Sign in to your KiaRelay account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={control}
          name="email"
          label="Email Address"
          placeholder="you@company.com"
          icon={<Mail className="h-4 w-4" />}
          rules={{ required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } }}
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
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        No account yet?{" "}
        <Link to="/business/register" className="font-semibold text-primary hover:underline">
          Register your company
        </Link>
      </p>

      {/* Shown on deployed builds too, so testers can find the accounts
          (client request, 2026-09-25). Hide it by setting
          VITE_SHOW_DEV_ACCOUNTS=false in the host's environment and redeploying.
          TODO: remove before going public — it lists working credentials. */}
      {import.meta.env.VITE_SHOW_DEV_ACCOUNTS !== "false" && <DevLoginHint />}
    </AuthLayout>
  );
}
