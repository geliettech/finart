import { useState } from "react";
import { Bot, Send, ShieldAlert, Sparkles } from "lucide-react";
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
import {
  dateInputValue,
  getAmount,
  getBudgetSpent,
  getCurrency,
  getNextOccurrence,
  getTransactionDate,
  monthKey,
} from "@/utils/dashboardCalculations";

const buildAnalysisSnapshot = ({ transactions, budgets, recurring }) => {
  const now = new Date();
  const asOf = dateInputValue(now);
  const thisMonth = monthKey(now);
  const monthlyActivity = new Map();
  const categoryActivity = new Map();
  const datedTransactions = [];
  let transactionsWithoutUsableDate = 0;

  transactions.forEach((transaction) => {
    const date = getTransactionDate(transaction);
    if (!date) {
      transactionsWithoutUsableDate += 1;
      return;
    }

    const dateKey = dateInputValue(date);
    const month = dateKey.slice(0, 7);
    const currency = getCurrency(transaction);
    const type = transaction.transactionType || "unknown";
    datedTransactions.push(dateKey);

    const monthKeyValue = `${month}|${currency}|${type}`;
    const monthTotal = monthlyActivity.get(monthKeyValue) || {
      month,
      currency,
      type,
      count: 0,
      total: 0,
    };
    monthTotal.count += 1;
    monthTotal.total += getAmount(transaction);
    monthlyActivity.set(monthKeyValue, monthTotal);

    if (type === "expense") {
      const category = transaction.category || "Uncategorized";
      const categoryKey = `${month}|${currency}|${category}`;
      const categoryTotal = categoryActivity.get(categoryKey) || {
        month,
        currency,
        category,
        count: 0,
        total: 0,
      };
      categoryTotal.count += 1;
      categoryTotal.total += getAmount(transaction);
      categoryActivity.set(categoryKey, categoryTotal);
    }
  });

  const upcomingEnd = new Date(now);
  upcomingEnd.setDate(upcomingEnd.getDate() + 30);
  const currentMonthBudgets = budgets
    .filter((budget) => budget.month === thisMonth)
    .map((budget) => {
      const spent = getBudgetSpent(budget, transactions);
      return {
        category: budget.category,
        currency: getCurrency(budget),
        limit: Number(budget.amount) || 0,
        recordedExpense: spent,
        remaining: (Number(budget.amount) || 0) - spent,
      };
    });

  const upcomingRecurring = recurring
    .filter((item) => item.status === "active")
    .map((item) => {
      const nextDate = getNextOccurrence(item.nextDate, item.frequency, now, item.endDate);
      return nextDate ? { item, nextDate: dateInputValue(nextDate) } : null;
    })
    .filter((entry) => entry && entry.nextDate <= dateInputValue(upcomingEnd))
    .map(({ item, nextDate }) => ({
      category: item.category || "Uncategorized",
      type: item.transactionType || "unknown",
      currency: getCurrency(item),
      amount: Number(item.amount) || 0,
      frequency: item.frequency || "unknown",
      nextDate,
    }));

  const limitations = [
    "This snapshot contains only records currently loaded for the signed-in user's dashboard; the app loads at most the 500 newest transactions and 200 budget and recurring records.",
    "Transaction history coverage may be incomplete, so do not treat the oldest and newest loaded dates as a complete statement period.",
    "Budgets are planned limits, not account balances. Recorded income minus expenses is not verified savings.",
    "FINART does not currently track bank balances, linked accounts, savings balances, investment valuations or returns, or financial goals.",
    "Recurring entries are user-recorded schedules, not confirmed payments or guaranteed future commitments.",
    "Amounts in different currencies must not be combined or converted.",
  ];

  if (transactionsWithoutUsableDate > 0) {
    limitations.push(`${transactionsWithoutUsableDate} loaded transaction(s) had no usable date and are excluded from dated activity summaries.`);
  }

  return {
    asOf,
    recordCounts: {
      transactions: transactions.length,
      budgets: budgets.length,
      recurringSchedules: recurring.length,
    },
    transactionDateRange: datedTransactions.length
      ? {
          from: datedTransactions.reduce((earliest, date) => date < earliest ? date : earliest),
          through: datedTransactions.reduce((latest, date) => date > latest ? date : latest),
        }
      : null,
    monthlyActivity: [...monthlyActivity.values()],
    expenseByCategoryAndMonth: [...categoryActivity.values()],
    currentMonthBudgetComparison: {
      month: thisMonth,
      budgets: currentMonthBudgets,
    },
    upcomingActiveRecurringSchedules: upcomingRecurring,
    limitations,
  };
};

const analysisInstructions = (snapshot) => [
  "Analyze the following FINART dashboard snapshot. It contains only the authenticated user's available, already-loaded records.",
  "Give a personalized overview with spending patterns, budget overruns or approaching limits, unusual spending only when a fair comparison is supported, possible savings opportunities, upcoming scheduled commitments, potential risks, and practical precautions or next steps.",
  "Explain the data-based reason for every finding. Use only figures, currencies, and date ranges present in the snapshot. Never combine currencies.",
  "Clearly distinguish recorded transactions and budget estimates from verified balances or predictions. Do not claim to know savings, investment performance, goals, or payment completion. Call out the listed limitations and say when evidence is insufficient. Do not invent missing data. Keep the response educational, not guaranteed professional financial advice.",
  `Dashboard snapshot: ${JSON.stringify(snapshot)}`,
].join("\n\n");

const AdvisorPage = () => {
  const { transactions, budgets, recurring, loading: dataLoading, error: dataError } = useDashboardData();
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [questionBusy, setQuestionBusy] = useState(false);
  const [questionError, setQuestionError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analysisScope, setAnalysisScope] = useState(null);
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const hasFinancialRecords = transactions.length + budgets.length + recurring.length > 0;

  const submitQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim() || questionBusy || !isAdvisorConfigured) return;

    const currentQuestion = question.trim();
    setQuestionBusy(true);
    setQuestionError("");
    setQuestion("");
    try {
      const answer = await askFinancialAdvisor(currentQuestion);
      setConversation((items) => [...items, { question: currentQuestion, answer }]);
    } catch (requestError) {
      setQuestion(currentQuestion);
      setQuestionError(requestError.message || "The advisor is unavailable.");
    } finally {
      setQuestionBusy(false);
    }
  };

  const analyzeFinances = async () => {
    if (analysisBusy || dataLoading || dataError || !isAdvisorConfigured) return;

    setAnalysisBusy(true);
    setAnalysisError("");
    setAnalysis("");
    try {
      const snapshot = buildAnalysisSnapshot({ transactions, budgets, recurring });
      setAnalysisScope(snapshot);
      const answer = await askFinancialAdvisor(analysisInstructions(snapshot));
      setAnalysis(answer);
    } catch (requestError) {
      setAnalysisError(requestError.message || "Your finances could not be analyzed.");
    } finally {
      setAnalysisBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Financial guidance"
        title="AI advisor"
        description="Ask a question or review patterns in your recorded FINART activity. AI guidance is educational, not guaranteed professional financial advice."
      />

      <div className="grid items-stretch gap-5 md:grid-cols-2">
        <Panel
          title="Ask AI a question"
          description="Ask about budgeting, expenses, savings, investments, goals, or responsible money management."
          className="flex h-full min-h-[34rem] flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {!conversation.length ? (
              <EmptyState
                title="What would you like help with?"
                description="Ask a question to get general, educational guidance. The advisor does not know your finances unless you include details in your question."
              />
            ) : (
              <div className="min-h-44 flex-1 space-y-5 overflow-y-auto" aria-live="polite">
                {conversation.map((item, index) => (
                  <article key={`${index}-${item.question}`} className="space-y-3">
                    <div className="ml-auto max-w-[95%] rounded-2xl rounded-tr-sm bg-secondary p-4 text-sm">
                      <p className="text-xs font-semibold text-primary">You</p>
                      <p className="mt-1 break-words leading-6">{item.question}</p>
                    </div>
                    <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-muted p-4 text-sm">
                      <p className="flex items-center gap-2 font-semibold"><Bot aria-hidden="true" size={16} /> FINART advisor</p>
                      <p className="mt-1 whitespace-pre-wrap break-words leading-6">{item.answer}</p>
                    </div>
                  </article>
                ))}
                {questionBusy && <p className="text-sm text-muted-foreground" role="status">Preparing a response…</p>}
              </div>
            )}
            {questionBusy && !conversation.length && <p className="mt-3 text-sm text-muted-foreground" role="status">Preparing a response…</p>}
            {questionError && <div className="mt-4"><ErrorNotice message={questionError} /></div>}
            {!isAdvisorConfigured && (
              <div className="mt-4"><ErrorNotice message="AI responses are unavailable because no secure same-origin advisor endpoint is configured. No responses are simulated, and no provider key is used in the browser." /></div>
            )}
          </div>
          <form onSubmit={submitQuestion} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="advisor-question" className="sr-only">Ask a financial question</label>
            <input
              id="advisor-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={1000}
              placeholder="Ask a financial question…"
              disabled={!isAdvisorConfigured || questionBusy}
              className={dashboardInputClass}
            />
            <button type="submit" disabled={!isAdvisorConfigured || questionBusy || !question.trim()} className={primaryButtonClass}>
              <Send aria-hidden="true" size={16} /> {questionBusy ? "Asking…" : "Ask AI"}
            </button>
          </form>
          <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
            <ShieldAlert aria-hidden="true" size={15} className="mt-0.5 shrink-0" />
            Do not rely on AI responses as guaranteed financial advice.
          </p>
        </Panel>

        <Panel
          title="Analyze my finances"
          description="Review patterns and practical next steps using your available dashboard records."
          className="flex h-full min-h-[34rem] flex-col"
        >
          <div className="flex-1">
            {dataLoading ? (
              <div className="flex min-h-44 items-center justify-center text-sm text-muted-foreground" role="status">
                Loading your dashboard data…
              </div>
            ) : dataError ? (
              <ErrorNotice message={`Your dashboard data could not be fully loaded, so analysis is paused. ${dataError}`} />
            ) : analysisError ? (
              <ErrorNotice message={analysisError} />
            ) : analysis ? (
              <div aria-live="polite" className="space-y-4">
                <div className="max-h-[26rem] overflow-y-auto rounded-xl bg-muted p-4 text-sm leading-6">
                  <p className="mb-2 flex items-center gap-2 font-semibold"><Sparkles aria-hidden="true" size={16} /> FINART analysis</p>
                  <p className="whitespace-pre-wrap break-words">{analysis}</p>
                </div>
                {analysisScope && (
                  <div className="rounded-xl border border-border p-4 text-xs leading-5 text-muted-foreground">
                    <p className="font-semibold text-foreground">Data used and limitations</p>
                    <p className="mt-1">
                      {analysisScope.recordCounts.transactions} transactions
                      {analysisScope.transactionDateRange
                        ? ` dated ${analysisScope.transactionDateRange.from} through ${analysisScope.transactionDateRange.through}`
                        : " with no usable transaction dates"}
                      , {analysisScope.recordCounts.budgets} budgets, and {analysisScope.recordCounts.recurringSchedules} recurring schedules.
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {analysisScope.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ) : hasFinancialRecords ? (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  The analysis uses your currently loaded transactions, budgets, and active recurring schedules. Record descriptions are not sent; only a compact summary is shared with the configured advisor service when you request analysis.
                </p>
                <p className="flex items-start gap-2 rounded-xl border border-border bg-muted p-3 text-xs leading-5 text-muted-foreground">
                  <ShieldAlert aria-hidden="true" size={15} className="mt-0.5 shrink-0" />
                  Loaded records may be incomplete. FINART does not track bank balances, savings balances, investment valuations, or financial goals. Recurring schedules are not confirmed payments; analysis is limited to recorded activity, not verified balances or predictions.
                </p>
              </div>
            ) : (
              <EmptyState
                title="No financial records to review yet"
                description="Once you add transactions, budgets, or recurring schedules, the advisor can review those records. It will not invent missing information."
              />
            )}
            {!isAdvisorConfigured && (
              <div className="mt-4"><ErrorNotice message="Analysis requires the secure same-origin advisor endpoint, which is not configured. No analysis is fabricated." /></div>
            )}
          </div>
          {analysisBusy && <p className="mt-3 text-sm text-muted-foreground" role="status">Analyzing your loaded records…</p>}
          <button
            type="button"
            onClick={analyzeFinances}
            disabled={!isAdvisorConfigured || dataLoading || Boolean(dataError) || analysisBusy || !hasFinancialRecords}
            className={`${primaryButtonClass} mt-5 w-full`}
          >
            <Sparkles aria-hidden="true" size={17} />
            {analysisBusy ? "Analyzing…" : "Analyze my finances"}
          </button>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Analysis is based only on data currently loaded for your signed-in account. Different currencies are kept separate.
          </p>
        </Panel>
      </div>
    </>
  );
};

export default AdvisorPage;
