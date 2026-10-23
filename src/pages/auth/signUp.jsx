import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { AuthLayout } from "@/layout/dashboard/authLayout";
import PasswordField from "@/components/PasswordField";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signUp, getAuthErrorMessage } from "@/services/auth";
import { getSafeReturnTo } from "@/utils/authNavigation";
import { signUpSchema } from "@/utils/authSchemas";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const actionLock = useRef(false);
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const isBusy = form.formState.isSubmitting || googleLoading;

  const onSubmit = async ({ fullName, email, password }) => {
    if (actionLock.current) return;
    actionLock.current = true;
    try {
      await signUp(fullName, email, password);
      toast.success("Account created. Check your inbox and spam folder to verify your email.");
      navigate("/email-verify", {
        replace: true,
        state: { from: location.state?.from },
      });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      actionLock.current = false;
    }
  };

  const handleGoogleSignUp = async () => {
    if (actionLock.current) return;
    actionLock.current = true;
    setGoogleLoading(true);

    try {
      const user = await signInWithGoogle();
      if (!user.emailVerified) {
        navigate("/email-verify", {
          replace: true,
          state: { from: location.state?.from },
        });
        return;
      }

      navigate(getSafeReturnTo(location.state), { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      actionLock.current = false;
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Start bringing your financial activity into clearer view."
      imgTitle="A clearer picture of your money starts here."
      imgSubtitle="Create your account to organize your finances and explore insights that help you plan your next step."
    >
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={isBusy}
      >
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <label htmlFor="signup-name" className="text-sm font-medium">Full name</label>
              <Input
                {...field}
                id="signup-name"
                type="text"
                placeholder="Alex Morgan"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? "signup-name-error" : undefined}
                className="h-12 rounded-xl px-3"
              />
              {fieldState.error && (
                <FieldError id="signup-name-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <label htmlFor="signup-email" className="text-sm font-medium">Email address</label>
              <Input
                {...field}
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? "signup-email-error" : undefined}
                className="h-12 rounded-xl px-3"
              />
              {fieldState.error && (
                <FieldError id="signup-email-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
              <PasswordField
                id="signup-password"
                field={field}
                invalid={fieldState.invalid}
                describedBy={fieldState.error ? "signup-password-error signup-password-hint" : "signup-password-hint"}
                autoComplete="new-password"
              />
              <p id="signup-password-hint" className="text-xs leading-5 text-[#718076] dark:text-[#aebcb1]">
                Use at least 8 characters, including an uppercase letter, a lowercase letter, and a number.
              </p>
              {fieldState.error && (
                <FieldError id="signup-password-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirm password</label>
              <PasswordField
                id="signup-confirm-password"
                field={field}
                invalid={fieldState.invalid}
                describedBy={fieldState.error ? "signup-confirm-error" : undefined}
                autoComplete="new-password"
              />
              {fieldState.error && (
                <FieldError id="signup-confirm-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#174b38] px-5 py-3 font-semibold text-white transition hover:bg-[#103b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? "Creating account…" : "Create account"}
          {!isBusy && <ArrowRight aria-hidden="true" size={18} />}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[#879188]" aria-hidden="true">
        <span className="h-px flex-1 bg-[#e5ebe3] dark:bg-white/10" />
        or
        <span className="h-px flex-1 bg-[#e5ebe3] dark:bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isBusy}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#d8e2d5] px-5 py-3 font-semibold transition hover:bg-[#f3f6f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
      >
        <span aria-hidden="true" className="font-bold text-[#4285f4]">G</span>
        {googleLoading ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <p className="mt-6 text-center text-sm text-[#68766b] dark:text-[#bdc9bf]">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          state={{ from: location.state?.from }}
          className="font-semibold text-[#174b38] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42] dark:text-[#d0e7ad]"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
