import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../constants/index.jsx";

const Faq = () => {
  const [activeId, setActiveId] = useState(null);

  return (
    <section id="faq" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="faq-title">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#61824d] dark:text-[#c4dd9e]">FAQs</p>
          <h2 id="faq-title" className="text-3xl font-semibold tracking-tight sm:text-5xl">A few helpful answers.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#657369] dark:text-[#bdc9bf]">
            What to know about FINART, its plans, and the information on this page.
          </p>
        </div>
        <div className="divide-y divide-[#e5ebe3] overflow-hidden rounded-3xl border border-[#e1e8df] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#1b2821]">
          {faqs.map((faq) => {
            const isOpen = activeId === faq.id;
            const panelId = `faq-answer-${faq.id}`;

            return (
              <div key={faq.id} className="px-5 sm:px-7">
                <h3>
                  <button
                    id={`faq-question-${faq.id}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setActiveId(isOpen ? null : faq.id)}
                    className="flex min-h-[68px] w-full items-center justify-between gap-5 py-5 text-left font-semibold transition hover:text-[#47704b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4d7c42] dark:hover:text-[#d0e7ad]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={19}
                      className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                  hidden={!isOpen}
                  className="pb-5 pr-8 text-sm leading-6 text-[#657369] dark:text-[#bdc9bf]"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
