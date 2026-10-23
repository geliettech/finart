import { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router";
import { plans } from "../constants/index.jsx";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  return (
    <section id="pricing" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#61824d] dark:text-[#c4dd9e]">Plans</p>
          <h2 id="pricing-title" className="text-3xl font-semibold tracking-tight sm:text-5xl">Choose a plan for your next step.</h2>
          <p className="mt-4 text-base leading-7 text-[#657369] dark:text-[#bdc9bf]">
            Start with the free plan. Paid plan prices below use the amounts already configured for FINART.
          </p>
          <div className="mt-7 inline-flex rounded-full border border-[#dfe7dc] bg-white p-1 dark:border-white/10 dark:bg-[#1b2821]" role="group" aria-label="Billing period">
            {["monthly", "yearly"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBillingPeriod(period)}
                aria-pressed={billingPeriod === period}
                className={`min-h-10 min-w-28 rounded-full px-4 text-sm font-semibold capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42] ${
                  billingPeriod === period
                    ? "bg-[#174b38] text-white"
                    : "text-[#657369] hover:text-[#18352a] dark:text-[#bdc9bf] dark:hover:text-white"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid items-stretch gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly;
            const popular = plan.id === "pro";

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-8 ${
                  popular
                    ? "border-[#174b38] bg-[#174b38] text-white shadow-[0_24px_70px_-40px_rgba(23,75,56,0.75)]"
                    : "border-[#e1e8df] bg-white dark:border-white/10 dark:bg-[#1b2821]"
                }`}
              >
                {popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-[#d0e7ad] px-3 py-1.5 text-xs font-semibold text-[#18352a]">
                    Most popular
                  </span>
                )}
                <div className="pr-24">
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className={`mt-2 min-h-10 text-sm leading-5 ${popular ? "text-white/75" : "text-[#718076] dark:text-[#bdc9bf]"}`}>
                    {plan.caption}
                  </p>
                </div>
                <p className="mt-7 flex min-h-12 items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    {price === 0 ? "Free" : `₦${price.toLocaleString("en-NG")}`}
                  </span>
                  {price > 0 && (
                    <span className={`text-sm ${popular ? "text-white/70" : "text-[#718076] dark:text-[#bdc9bf]"}`}>
                      / {billingPeriod === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </p>
                <Link
                  to="/sign-up"
                  className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 ${
                    popular
                      ? "bg-[#d0e7ad] text-[#18352a] hover:bg-white focus-visible:outline-white"
                      : "border border-[#d8e2d5] hover:bg-[#f3f6f1] focus-visible:outline-[#4d7c42] dark:border-white/15 dark:hover:bg-white/10"
                  }`}
                >
                  {plan.id === "basic" ? "Start with Basic" : "Create an account"}
                </Link>
                <div className={`my-7 border-t ${popular ? "border-white/20" : "border-[#e8ede6] dark:border-white/10"}`} />
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                      <Check aria-hidden="true" size={18} className={`mt-0.5 shrink-0 ${popular ? "text-[#d0e7ad]" : "text-[#54783e]"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-[#718076] dark:text-[#aebcb1]">
          Paid plan checkout is not available from this page. Creating an account does not start a subscription or payment.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
