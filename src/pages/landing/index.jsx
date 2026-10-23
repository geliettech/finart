import Header from "../../components/header";
import Hero from "../../components/hero";
import Features from "../../components/Features";
import Pricing from "../../components/Pricing";
import Faq from "../../components/Faq";
import Footer from "../../components/Footer";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const LandingPage = () => (
  <div className="landing-page min-h-screen overflow-hidden bg-[#f7f8f4] text-[#18352a] dark:bg-[#111a16] dark:text-[#edf4ee]">
    <a
      href="#main-content"
      className="sr-only z-[60] rounded-md bg-[#174b38] px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
    <Header />
    <main id="main-content">
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <section className="px-5 pb-20 pt-8 sm:px-8 sm:pb-28" aria-labelledby="final-cta-title">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#174b38] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#d0e7ad]">
            A clearer view starts here
          </p>
          <h2 id="final-cta-title" className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Make your next money decision with confidence.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Bring your financial activity together and take the next step at your own pace.
          </p>
          <Link
            to="/sign-up"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d0e7ad] px-6 py-3 font-semibold text-[#18352a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Get started free <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default LandingPage;
