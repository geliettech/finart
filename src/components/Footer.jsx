import { Link } from "react-router";
import { WalletCards } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border px-5 py-10 sm:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
            <WalletCards aria-hidden="true" size={18} />
          </span>
          FINART
        </Link>
        <p className="mt-3 text-sm leading-6 text-muted-foreground ">
          A clearer view of your money, budgets, and financial goals.
        </p>
      </div>

      <nav
        aria-label="Footer navigation"
        className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground "
      >
        <a
          href="#features"
          className="rounded-sm hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring "
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="rounded-sm hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring "
        >
          How it works
        </a>
        <a
          href="#pricing"
          className="rounded-sm hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring "
        >
          Pricing
        </a>
        <Link
          to="/sign-in"
          className="rounded-sm hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring "
        >
          Log in
        </Link>
      </nav>
    </div>
    <div className="mx-auto mt-8 max-w-7xl border-t border-border pt-5 text-xs text-muted-foreground ">
      © {new Date().getFullYear()} FINART. All rights reserved.
    </div>
  </footer>
);

export default Footer;
