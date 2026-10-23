import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { AuthLayout } from "@/layout/dashboard/authLayout";
import PasswordField from "@/components/PasswordField";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage, signIn, signInWithGoogle } from "@/services/auth";
import { getSafeReturnTo } from "@/utils/authNavigation";
import { signInSchema } from "@/utils/authSchemas";
import { toast } from "react-toastify";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const actionLock = useRef(false);
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const isBusy = form.formState.isSubmitting || googleLoading;

  const finishSignIn = (user) => {
    if (!user.emailVerified) {
      toast.info("Please verify your email before continuing.");
      navigate("/email-verify", {
        replace: true,
        state: { from: location.state?.from },
      });
      return;
    }

    toast.success("You're signed in.");
    navigate(getSafeReturnTo(location.state), { replace: true });
  };

  const onSubmit = async ({ email, password }) => {
    if (actionLock.current) return;
    actionLock.current = true;
    try {
      const user = await signIn(email, password);
      finishSignIn(user);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      actionLock.current = false;
    }
  };

  const handleGoogleSignIn = async () => {
    if (actionLock.current) return;
    actionLock.current = true;
    setGoogleLoading(true);

    try {
      const user = await signInWithGoogle();
      finishSignIn(user);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      actionLock.current = false;
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to see your finances with fresh eyes."
      imgTitle="Pick up where you left off."
      imgSubtitle="Keep your financial activity, budgets, and goals in view so you can make your next decision with confidence."
    >
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={isBusy}
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <label htmlFor="signin-email" className="text-sm font-medium">Email address</label>
              <Input
                {...field}
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? "signin-email-error" : undefined}
                className="h-12 rounded-xl px-3"
              />
              {fieldState.error && (
                <FieldError id="signin-email-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="signin-password" className="text-sm font-medium">Password</label>
                <Link
                  to="/forgot-password"
                  state={{ email: form.getValues("email") }}
 className="rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring "
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordField
                id="signin-password"
                field={field}
                invalid={fieldState.invalid}
                describedBy={fieldState.error ? "signin-password-error" : undefined}
              />
              {fieldState.error && (
                <FieldError id="signin-password-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <button
          type="submit"
          disabled={isBusy}
 className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-brand-foreground transition hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? "Signing in…" : "Log in"}
          {!isBusy && <ArrowRight aria-hidden="true" size={18} />}
        </button>
      </form>

 <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground" aria-hidden="true">
 <span className="h-px flex-1 bg-muted " />
        or
 <span className="h-px flex-1 bg-muted " />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isBusy}
 className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-semibold transition hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60 "
      >
 <span aria-hidden="true" className="font-bold text-muted-foreground">G</span>
        {googleLoading ? "Connecting to Google…" : "Continue with Google"}
      </button>

 <p className="mt-6 text-center text-sm text-muted-foreground ">
        New to FINART?{" "}
        <Link
          to="/sign-up"
          state={{ from: location.state?.from }}
 className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring "
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignInPage;
