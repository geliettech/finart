import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthLayout } from "@/layout/dashboard/authLayout";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword, getAuthErrorMessage } from "@/services/auth";
import { forgotPasswordSchema } from "@/utils/authSchemas";

const ForgotPasswordPage = () => {
  const location = useLocation();
  const [requestSent, setRequestSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: location.state?.email ?? "" },
  });

  const onSubmit = async ({ email }) => {
    setSubmitError("");
    try {
      await forgotPassword(email);
      setRequestSent(true);
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email address associated with your account. We'll send instructions if an account matches."
      imgTitle="A fresh start is just a few steps away."
      imgSubtitle="Request a secure password reset link and return to your financial overview."
    >
      {requestSent ? (
        <div className="rounded-2xl border border-[#dce7d7] bg-[#f2f6ef] p-5 dark:border-white/10 dark:bg-white/5" role="status" aria-live="polite">
          <MailCheck aria-hidden="true" size={25} className="text-[#47704b] dark:text-[#d0e7ad]" />
          <h2 className="mt-3 font-semibold">Check your inbox</h2>
          <p className="mt-2 text-sm leading-6 text-[#68766b] dark:text-[#bdc9bf]">
            If an account is associated with that email address, password reset instructions are on their way. Check your spam folder too.
          </p>
        </div>
      ) : (
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" aria-busy={form.formState.isSubmitting}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <label htmlFor="reset-email" className="text-sm font-medium">Email address</label>
                <Input
                  {...field}
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? "reset-email-error" : undefined}
                  className="h-12 rounded-xl px-3"
                />
                {fieldState.error && (
                  <FieldError id="reset-email-error" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {submitError && (
            <p className="text-sm text-destructive" role="alert">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#174b38] px-5 py-3 font-semibold text-white transition hover:bg-[#103b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form.formState.isSubmitting ? "Sending instructions…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center">
        <Link to="/sign-in" className="inline-flex min-h-10 items-center gap-2 rounded-sm text-sm font-semibold text-[#174b38] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42] dark:text-[#d0e7ad]">
          <ArrowLeft aria-hidden="true" size={16} /> Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
