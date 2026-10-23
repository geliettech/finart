import { WalletCards } from "lucide-react";
import { Link } from "react-router";

export const AuthLayout = ({
  title,
  description,
  children,
  imgTitle,
  imgSubtitle,
}) => (
  <main className="min-h-screen bg-background text-foreground ">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-7">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="FINART home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-primary">
            <WalletCards aria-hidden="true" size={21} />
          </span>
          FINART
        </Link>
        <Link
          to="/"
          className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring "
        >
          Back to home
        </Link>
      </header>

      <div className="my-auto grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-14">
        <section className="relative hidden min-h-[540px] overflow-hidden rounded-[2rem] bg-brand p-10 text-brand-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 size-80 rounded-full border border-border/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 size-96 rounded-full border border-border/10"
          />
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              FINART personal finance
            </p>
            <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              {imgTitle}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-brand-foreground/75">
              {imgSubtitle}
            </p>
          </div>
          <div className="relative z-10 rounded-2xl border border-border/15 bg-surface-overlay/[0.5] p-5 backdrop-blur-sm">
            <p className="text-sm text-brand-foreground/70">
              A little more clarity goes a long way.
            </p>
            <div className="mt-5 flex h-24 items-end gap-2" aria-hidden="true">
              {[32, 46, 40, 63, 52, 78, 68, 92, 73, 100, 84, 112].map(
                (height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="flex-1 rounded-t-md bg-accent/80"
                    style={{ height: `${height * 0.7}px` }}
                  />
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg rounded-[2rem] border border-border bg-surface-overlay p-6 shadow-400 sm:p-9">
          <div className="mb-7">
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground ">
              {description}
            </p>
          </div>
          {children}
        </section>
      </div>

      <footer className="pb-1 text-center text-xs text-muted-foreground ">
        © {new Date().getFullYear()} FINART
      </footer>
    </div>
  </main>
);
