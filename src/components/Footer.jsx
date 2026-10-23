import { Link } from "react-router";
import { WalletCards } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-[#e1e8df] px-5 py-10 dark:border-white/10 sm:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-sm">
        <Link to="/" className="inline-flex items-center gap-2 rounded-md font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4d7c42]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#174b38] text-[#d0e7ad]">
            <WalletCards aria-hidden="true" size={18} />
          </span>
          FINART
        </Link>
        <p className="mt-3 text-sm leading-6 text-[#718076] dark:text-[#aebcb1]">
          A clearer view of your money, budgets, and financial goals.
        </p>
      </div>

      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#526157] dark:text-[#c3cec5]">
        <a href="#features" className="rounded-sm hover:text-[#174b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] dark:hover:text-white">Features</a>
        <a href="#how-it-works" className="rounded-sm hover:text-[#174b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] dark:hover:text-white">How it works</a>
        <a href="#pricing" className="rounded-sm hover:text-[#174b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] dark:hover:text-white">Pricing</a>
        <Link to="/sign-in" className="rounded-sm hover:text-[#174b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4d7c42] dark:hover:text-white">Log in</Link>
      </nav>
    </div>
    <div className="mx-auto mt-8 max-w-7xl border-t border-[#e8ede6] pt-5 text-xs text-[#718076] dark:border-white/10 dark:text-[#aebcb1]">
      © {new Date().getFullYear()} FINART. All rights reserved.
    </div>
  </footer>
);

export default Footer;
