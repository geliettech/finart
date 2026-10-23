import { WalletCards } from "lucide-react";
import { Link } from "react-router";

export const AuthLayout = ({
  title,
  description,
  children,
  imgTitle,
  imgSubtitle,
}) => (
  <main className="min-h-screen bg-[#f7f8f4] text-[#18352a] dark:bg-[#111a16] dark:text-[#edf4ee]">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-7">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4d7c42]"
          aria-label="FINART home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#174b38] text-[#d0e7ad]">
            <WalletCards aria-hidden="true" size={21} />
          </span>
          FINART
        </Link>
        <Link
          to="/"
          className="rounded-md px-2 py-2 text-sm font-medium text-[#607066] hover:text-[#174b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42] dark:text-[#bdc9bf] dark:hover:text-white"
        >
          Back to home
        </Link>
      </header>

      <div className="my-auto grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-14">
        <section className="relative hidden min-h-[540px] overflow-hidden rounded-[2rem] bg-[#174b38] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div aria-hidden="true" className="absolute -right-20 -top-24 size-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-16 size-96 rounded-full border border-white/10" />
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d0e7ad]">
              FINART personal finance
            </p>
            <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              {imgTitle}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/75">
              {imgSubtitle}
            </p>
          </div>
          <div className="relative z-10 rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">A little more clarity goes a long way.</p>
            <div className="mt-5 flex h-24 items-end gap-2" aria-hidden="true">
              {[32, 46, 40, 63, 52, 78, 68, 92, 73, 100, 84, 112].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="flex-1 rounded-t-md bg-[#d0e7ad]/80"
                  style={{ height: `${height * 0.7}px` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg rounded-[2rem] border border-[#e1e8df] bg-white p-6 shadow-[0_24px_70px_-48px_rgba(22,65,45,0.35)] dark:border-white/10 dark:bg-[#1b2821] sm:p-9">
          <div className="mb-7">
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#68766b] dark:text-[#bdc9bf]">
              {description}
            </p>
          </div>
          {children}
        </section>
      </div>

      <footer className="pb-1 text-center text-xs text-[#718076] dark:text-[#aebcb1]">
        © {new Date().getFullYear()} FINART
      </footer>
    </div>
  </main>
);
