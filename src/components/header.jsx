import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Menu, WalletCards, X } from "lucide-react";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-[#e7ece5]/80 bg-[#f7f8f4]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#111a16]/95">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 rounded-md text-lg font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4d7c42]"
          aria-label="FINART home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#174b38] text-[#d0e7ad]">
            <WalletCards aria-hidden="true" size={21} />
          </span>
          <span>FINART</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {navigation.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="rounded-sm text-sm font-medium text-[#58685d] transition hover:text-[#174b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4d7c42] dark:text-[#c2cec4] dark:hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/sign-in"
            className="rounded-full px-4 py-2.5 text-sm font-semibold transition hover:bg-[#e9eee7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42] dark:hover:bg-white/10"
          >
            Log in
          </Link>
          <Link
            to="/sign-up"
            className="rounded-full bg-[#174b38] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42]"
          >
            Get started free
          </Link>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-xl border border-[#dfe7dc] text-[#18352a] transition hover:bg-[#e9eee7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c42] dark:border-white/15 dark:text-white dark:hover:bg-white/10 lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        hidden={!isOpen}
        className="border-t border-[#e7ece5] bg-[#f7f8f4] px-5 pb-6 pt-3 dark:border-white/10 dark:bg-[#111a16] lg:hidden"
      >
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col">
          {navigation.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium transition hover:bg-[#e9eee7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] dark:hover:bg-white/10"
            >
              {label}
            </a>
          ))}
          <div className="mt-3 flex gap-3 border-t border-[#e1e8df] pt-4 dark:border-white/10">
            <Link
              to="/sign-in"
              onClick={closeMenu}
              className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#dfe7dc] px-4 text-sm font-semibold dark:border-white/15"
            >
              Log in
            </Link>
            <Link
              to="/sign-up"
              onClick={closeMenu}
              className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#174b38] px-4 text-sm font-semibold text-white"
            >
              Get started free
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
