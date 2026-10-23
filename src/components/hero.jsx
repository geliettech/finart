import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import DashboardPreview from "./DashboardPreview";

const Hero = () => (
  <section
    id="hero"
    className="px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
    aria-labelledby="hero-title"
  >
    <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
      <div className="relative z-10">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-overlay/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary ">
          <span className="size-2 rounded-full bg-muted" aria-hidden="true" />A
          calmer way to manage money
        </p>
        <h1
          id="hero-title"
          className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.25rem]"
        >
          Take control of your money.{" "}
          <span className="text-primary ">Make smarter decisions.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Bring income, spending, budgets, savings, and investments into clearer
          view, with financial insights to help you plan your next move.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/sign-up"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-brand-foreground transition hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring"
          >
            Get started free <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <a
            href="#features"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-surface-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring "
          >
            Explore features <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground ">
          <li className="inline-flex items-center gap-2">
            <Check aria-hidden="true" size={16} className="text-primary" />{" "}
            Start with the free plan
          </li>
          <li className="inline-flex items-center gap-2">
            <Check aria-hidden="true" size={16} className="text-primary" /> No
            payment flow on this page
          </li>
        </ul>
      </div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -right-5 -top-8 h-40 w-40 rounded-full bg-muted/70 blur-3xl "
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-8 -left-5 h-40 w-40 rounded-full bg-muted/70 blur-3xl "
        />
        <DashboardPreview compact />
        <p className="mt-3 text-center text-xs text-muted-foreground ">
          Illustrative dashboard — figures are sample data.
        </p>
      </div>
    </div>
  </section>
);

export default Hero;
