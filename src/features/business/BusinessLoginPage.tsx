import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { PasswordField } from "../../components/PasswordField";
import { useToast } from "../../components/toast/ToastContext";
import { BUSINESS_BRAND } from "../../constants/brand";
import { DEV_PASSWORD } from "../access/teamMembersData";
import { AuthLayout } from "../auth/AuthLayout";
import { businessLogin, findBusinessByEmail, getBusinessSession } from "./businessAccounts";

interface BusinessLoginValues {
  email: string;
  password: string;
}

// KiaRelay Business sign-in (TC-15, 2026-09-28). Reached from the welcome
// page at /business, which also carries registration and the staff link.
// Separate from the staff login at /login.
// TODO: POST /business/auth/login once the backend exists.
export function BusinessLoginPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<BusinessLoginValues>({ defaultValues: { email: "", password: "" } });

  if (getBusinessSession()) return <Navigate to="/business/account" replace />;

  function onSubmit(values: BusinessLoginValues) {
    const account = findBusinessByEmail(values.email);
    if (!account || account.password !== values.password) return showToast("error", "Invalid email or password.");
    businessLogin(account.email);
    showToast("success", `Welcome, ${account.contactName.split(" ")[0]}.`);
    navigate("/business/account", { replace: true });
  }

  return (
    <AuthLayout backTo="/business">
      <div className="pb-6 text-center">
        <h1 className="text-lg font-semibold text-text">Welcome back</h1>
        <p className="text-body mt-1 text-text-muted">Sign in to your {BUSINESS_BRAND} account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={control}
          name="email"
          label="Work Email"
          placeholder="you@company.com"
          icon={<Mail className="h-4 w-4" />}
          rules={{ required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } }}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">Password</span>
            <Link to="/business/forgot-password" className="text-xs text-primary hover:underline">
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
          Register
        </Link>
      </p>

      {/* Same testing aid as the admin login (see LoginPage), collapsed so it
          doesn't crowd the form. TODO: remove before going public. */}
      {import.meta.env.VITE_SHOW_DEV_ACCOUNTS !== "false" && (
        <details className="mt-4 text-center text-xs text-text-muted">
          <summary className="cursor-pointer hover:text-text">Demo account</summary>
          <p className="mt-2">
            <span className="font-mono text-text">business.demo@kiarelay.com</span> / <span className="font-mono text-text">{DEV_PASSWORD}</span>
          </p>
        </details>
      )}
    </AuthLayout>
  );
}
