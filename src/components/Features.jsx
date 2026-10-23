import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChartNoAxesCombined,
  CircleDollarSign,
  PiggyBank,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";
import DashboardPreview from "./DashboardPreview";

const featureCards = [
  {
    icon: Wallet,
    title: "Income and expense tracking",
    description: "See what comes in and where it goes, with transactions organized in one place.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Smart budget management",
    description: "Set category budgets and keep an eye on spending as the month unfolds.",
  },
  {
    icon: BrainCircuit,
    title: "AI financial advisor",
    description: "Explore contextual spending analysis and budgeting suggestions based on your financial activity.",
  },
  {
    icon: PiggyBank,
    title: "Savings goals",
    description: "Keep your savings targets visible and follow your progress over time.",
  },
  {
    icon: CircleDollarSign,
    title: "Investment tracking",
    description: "Bring investment activity into your broader personal finance picture.",
  },
  {
    icon: BarChart3,
    title: "Financial analytics",
    description: "Understand cash flow, spending patterns, and changes in your finances.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an account",
    description: "Sign up to get started and choose the plan that fits your needs.",
  },
  {
    number: "02",
    title: "Organize your finances",
    description: "Add and categorize your financial activity, budgets, and goals.",
  },
  {
    number: "03",
    title: "Understand and act",
    description: "Use your overview and insights to make informed money decisions.",
  },
];

const Features = () => (
  <>
    <section id="features" className="scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="features-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-5 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
 <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary ">Made for your money</p>
            <h2 id="features-title" className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Your finances, easier to understand.
            </h2>
          </div>
 <p className="max-w-lg text-base leading-7 text-muted-foreground md:justify-self-end">
            Get a more complete picture of day-to-day money and longer-term goals, all in one considered experience.
          </p>
        </div>

 <ul className="mb-12 grid gap-3 rounded-3xl border border-border bg-surface-overlay/70 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
          {["Clear financial visibility", "Budgets that keep you on track", "Insights grounded in your activity", "More confidence in your next step"].map((item) => (
 <li key={item} className="flex items-center gap-3 text-sm font-medium text-muted-foreground ">
 <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-muted" />
              {item}
            </li>
          ))}
        </ul>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, description }) => (
 <article key={title} className="group rounded-3xl border border-border bg-surface-overlay p-6 transition duration-200 hover:-translate-y-1 hover:border-border hover:shadow-100 sm:p-7">
 <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-surface-subtle text-primary transition group-hover:bg-muted ">
                <Icon aria-hidden="true" size={23} strokeWidth={1.8} />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
 <p className="mt-3 text-sm leading-6 text-muted-foreground ">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="how-it-works" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="how-title">
 <div className="mx-auto max-w-7xl rounded-[2rem] bg-surface-subtle px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
 <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary ">How it works</p>
          <h2 id="how-title" className="text-3xl font-semibold tracking-tight sm:text-5xl">A simple path to more clarity.</h2>
        </div>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map(({ number, title, description }, index) => (
            <li key={number} className="relative">
 {index < steps.length - 1 && <div aria-hidden="true" className="absolute left-6 top-12 hidden h-px w-[calc(100%-24px)] bg-muted md:block" />}
 <span className="relative flex size-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">{number}</span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
 <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground ">{description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-9 text-center">
 <Link to="/sign-up" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold text-primary transition hover:bg-surface-overlay/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ">
            Start with FINART <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>

    <section className="px-5 py-12 sm:px-8 sm:py-20" aria-labelledby="preview-title">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
 <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary ">One view, more context</p>
          <h2 id="preview-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">See the full picture, not just the numbers.</h2>
 <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground ">
            Bring balance, monthly activity, savings, and spending categories together in a clear overview. The example shown is illustrative and uses sample values.
          </p>
 <Link to="/sign-up" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full font-semibold text-primary transition hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ">
            Explore FINART <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <DashboardPreview />
      </div>
    </section>
  </>
);

export default Features;
