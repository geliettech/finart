import { useState } from "react";
import { Bot, Send, ShieldAlert } from "lucide-react";
import {
  isAdvisorConfigured,
  askFinancialAdvisor,
} from "@/services/advisor";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  dashboardInputClass,
  EmptyState,
  ErrorNotice,
  PageHeader,
  Panel,
  primaryButtonClass,
} from "@/components/dashboard/DashboardUI";
import { formatMoney, monthKey, sumTransactions } from "@/utils/dashboardCalculations";

const AdvisorPage = () => {
  const { transactions } = useDashboardData();
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const currency = localStorage.getItem("finart-currency") || "NGN";

  const submitQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim() || busy || !isAdvisorConfigured) return;

    const currentQuestion = question.trim();
    setBusy(true);
    setError("");
    setQuestion("");
    try {
      const answer = await askFinancialAdvisor(currentQuestion);
      setConversation((items) => [...items, { question: currentQuestion, answer }]);
    } catch (requestError) {
      setQuestion(currentQuestion);
      setError(requestError.message || "The advisor is unavailable.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Financial guidance"
        title="AI advisor"
        description="Ask financial questions when the secure advisor service is configured for this application."
      />
      {!isAdvisorConfigured && (
        <div className="mb-5"><ErrorNotice message="AI advice is unavailable because no secure server-side advisor endpoint is configured. No AI responses are simulated, and no API key is used in the browser." /></div>
      )}
      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <Panel title="Advisor conversation" description="Guidance is educational, not a substitute for professional financial advice.">
          {!conversation.length ? (
            <EmptyState title="Start with your own question" description="Once the secure advisor endpoint is available, you can ask about budgeting, spending patterns, and general financial concepts." />
          ) : (
            <div className="max-h-[28rem] space-y-5 overflow-y-auto" aria-live="polite">
              {conversation.map((item, index) => (
                <article key={`${index}-${item.question}`} className="space-y-3">
                  <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[#e9f1e4] p-4 text-sm dark:bg-[#2a4032]">
                    <p className="text-xs font-semibold text-[#456a40] dark:text-[#d0e7ad]">You</p>
                    <p className="mt-1 leading-6">{item.question}</p>
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted p-4 text-sm">
                    <p className="flex items-center gap-2 font-semibold"><Bot aria-hidden="true" size={16} /> FINART advisor</p>
                    <p className="mt-1 whitespace-pre-wrap leading-6">{item.answer}</p>
                  </div>
                </article>
              ))}
              {busy && <p className="text-sm text-muted-foreground" role="status">Preparing a response…</p>}
            </div>
          )}
          {error && <div className="mt-4"><ErrorNotice message={error} /></div>}
          <form onSubmit={submitQuestion} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="advisor-question" className="sr-only">Ask a financial question</label>
            <input
              id="advisor-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={1000}
              placeholder={isAdvisorConfigured ? "Ask a financial question…" : "Advisor endpoint not configured"}
              disabled={!isAdvisorConfigured || busy}
              className={dashboardInputClass}
            />
            <button type="submit" disabled={!isAdvisorConfigured || busy || !question.trim()} className={primaryButtonClass}>
              <Send aria-hidden="true" size={16} /> {busy ? "Sending…" : "Ask"}
            </button>
          </form>
        </Panel>

        <Panel title="Your recorded activity" description="Context available in this dashboard only.">
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Income this month</p>
              <p className="mt-1 font-semibold">{formatMoney(sumTransactions(transactions, "income", monthKey(), currency), currency)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expenses this month</p>
              <p className="mt-1 font-semibold">{formatMoney(sumTransactions(transactions, "expense", monthKey(), currency), currency)}</p>
            </div>
            <p className="flex items-start gap-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              <ShieldAlert aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
              These activity summaries stay in this browser. A question is sent to the configured same-origin endpoint only when you submit it.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
};

export default AdvisorPage;
