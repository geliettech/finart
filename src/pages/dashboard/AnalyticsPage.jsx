import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from "lucide-react";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  EmptyState,
  ErrorNotice,
  LoadingState,
  MetricCard,
  PageHeader,
  Panel,
} from "@/components/dashboard/DashboardUI";
import {
  filterTransactions,
  formatMoney,
  dateInputValue,
  getAmount,
  getBudgetSpent,
  getBudgetState,
  getCurrency,
  getTransactionDate,
  monthKey,
  monthlyTotals,
} from "@/utils/dashboardCalculations";

const firstDayOfMonth = () => `${monthKey()}-01`;
const today = dateInputValue;

const AnalyticsPage = () => {
  const { transactions, budgets, loading, error } = useDashboardData();
  const currency = localStorage.getItem("finart-currency") || "NGN";
  const [from, setFrom] = useState(firstDayOfMonth);
  const [to, setTo] = useState(today);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [period, setPeriod] = useState("month");

  const categories = [...new Set(transactions.map((item) => item.category).filter(Boolean))].sort();
  const selectedTransactions = useMemo(
    () => filterTransactions(transactions, { from, to, type, category }),
    [transactions, from, to, type, category],
  );
  const income = selectedTransactions
    .filter((item) => item.transactionType === "income" && getCurrency(item, currency) === currency)
    .reduce((sum, item) => sum + getAmount(item), 0);
  const expenses = selectedTransactions
    .filter((item) => item.transactionType === "expense" && getCurrency(item, currency) === currency)
    .reduce((sum, item) => sum + getAmount(item), 0);
  const investments = selectedTransactions
    .filter((item) => item.transactionType === "investment" && getCurrency(item, currency) === currency)
    .reduce((sum, item) => sum + getAmount(item), 0);
  const categoriesBreakdown = useMemo(() => {
    const grouped = new Map();
    selectedTransactions
      .filter((item) => item.transactionType === "expense" && getCurrency(item, currency) === currency)
      .forEach((item) => {
        const key = item.category || "Uncategorized";
        grouped.set(key, (grouped.get(key) || 0) + getAmount(item));
      });
    return [...grouped.entries()].map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount).slice(0, 7);
  }, [selectedTransactions, currency]);
  const monthly = useMemo(() => monthlyTotals(transactions, currency, 6), [transactions, currency]);
  const maxMonthly = Math.max(1, ...monthly.flatMap((item) => [item.income, item.expenses]));
  const budgetPeriod = monthKey(new Date(`${from}T00:00:00`));
  const relevantBudgets = budgets.filter((item) => item.month === budgetPeriod && item.currency === currency);
  const unusualSpending = categoriesBreakdown.filter(({ name, amount }) => {
    const currentStart = new Date(`${from}T00:00:00`);
    const currentEnd = new Date(`${to}T00:00:00`);
    currentEnd.setDate(currentEnd.getDate() + 1);
    const rangeLength = currentEnd.getTime() - currentStart.getTime();
    const previousRanges = Array.from({ length: 3 }, (_, index) => {
      const end = new Date(currentStart.getTime() - index * rangeLength);
      const start = new Date(end.getTime() - rangeLength);
      return transactions
        .filter((item) => {
          const date = getTransactionDate(item);
          return item.transactionType === "expense"
            && (item.category || "Uncategorized") === name
            && getCurrency(item, currency) === currency
            && date
            && date >= start
            && date < end;
        })
        .reduce((sum, item) => sum + getAmount(item), 0);
    });
    const average = previousRanges.reduce((sum, item) => sum + item, 0) / previousRanges.length;
    return previousRanges.some((value) => value > 0) && amount >= average * 2;
  });

  const setPreset = (value) => {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    if (value === "month") start.setDate(1);
    else if (value === "quarter") start.setMonth(start.getMonth() - 2, 1);
    else if (value === "year") start.setMonth(0, 1);
    setPeriod(value);
    setFrom(dateInputValue(start));
    setTo(dateInputValue(end));
  };

  return (
    <>
      <PageHeader eyebrow="Understand your patterns" title="Analytics" description="Explore recorded transactions over a selected period. Different currencies are never combined." />
      {error && <div className="mb-5"><ErrorNotice message={error} /></div>}
      <Panel title="Filters" description="Choose a date range and optional category or type.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <select aria-label="Date period preset" className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm" value={period} onChange={(event) => setPreset(event.target.value)}>
            <option value="custom">Custom range</option><option value="month">This month</option><option value="quarter">Last 3 months</option><option value="year">This year</option>
          </select>
          <input aria-label="From date" type="date" className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm" value={from} max={to} onChange={(event) => { setPeriod("custom"); setFrom(event.target.value); }} />
          <input aria-label="To date" type="date" className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm" value={to} min={from} onChange={(event) => { setPeriod("custom"); setTo(event.target.value); }} />
          <select aria-label="Filter by transaction type" className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm" value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option><option value="investment">Investment</option></select>
          <select aria-label="Filter by category" className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Showing {selectedTransactions.length} records · {currency}</p>
      </Panel>
      {transactions.length >= 500 && <p className="mt-3 text-xs text-muted-foreground">Analytics use the most recent 500 transactions currently loaded; older activity may be excluded.</p>}

      {loading ? <Panel className="mt-5"><LoadingState /></Panel> : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Income in range" value={formatMoney(income, currency)} detail="Recorded income" icon={ArrowDownRight} />
            <MetricCard label="Expenses in range" value={formatMoney(expenses, currency)} detail="Recorded expenses" icon={ArrowUpRight} />
            <MetricCard label="Investment contributions" value={formatMoney(investments, currency)} detail="Recorded investment transactions; not investment performance" icon={CircleDollarSign} />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel title="Expenses by category" description={`${from} to ${to}`}>
              {categoriesBreakdown.length === 0 ? <EmptyState title="No expenses in this range" description="Choose another date range or record an expense." /> : (
                <div className="space-y-4">
                  {categoriesBreakdown.map(({ name, amount }) => {
                    const total = categoriesBreakdown.reduce((sum, item) => sum + item.amount, 0);
                    const percent = total > 0 ? amount / total * 100 : 0;
                    return <div key={name}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-medium">{name}</span><span className="text-muted-foreground">{formatMoney(amount, currency)}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${name} share of selected expenses`} aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#5d8550]" style={{ width: `${percent}%` }} /></div></div>;
                  })}
                  <p className="sr-only">Top spending categories: {categoriesBreakdown.map(({ name, amount }) => `${name}: ${formatMoney(amount, currency)}`).join("; ")}</p>
                </div>
              )}
            </Panel>

            <Panel title="Monthly cash flow trend" description="Six recent calendar months, based on recorded transactions.">
              {monthly.every((item) => item.income === 0 && item.expenses === 0) ? <EmptyState title="No history to compare" description="Monthly trends will appear when you have transaction history." /> : (
                <div>
                  <div className="flex h-48 items-end gap-2 border-b border-border pb-2 sm:gap-4">
                    {monthly.map((item) => <div key={item.month} className="flex h-full flex-1 items-end justify-center gap-1">
                      <span title={`${item.label} income: ${formatMoney(item.income, currency)}`} className="w-full max-w-8 rounded-t bg-[#174b38] dark:bg-[#d0e7ad]" style={{ height: `${Math.max(item.income ? 4 : 0, item.income / maxMonthly * 100)}%` }} />
                      <span title={`${item.label} expenses: ${formatMoney(item.expenses, currency)}`} className="w-full max-w-8 rounded-t bg-[#bdd0ad]" style={{ height: `${Math.max(item.expenses ? 4 : 0, item.expenses / maxMonthly * 100)}%` }} />
                    </div>)}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">{monthly.map((item) => <span key={item.month}>{item.label}</span>)}</div>
                  <p className="sr-only">{monthly.map((item) => `${item.label}: income ${formatMoney(item.income, currency)}, expenses ${formatMoney(item.expenses, currency)}`).join("; ")}</p>
                </div>
              )}
            </Panel>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel title="Budget performance" description={`Budgets for ${budgetPeriod} · expense transactions only`}>
              {relevantBudgets.length === 0 ? <EmptyState title="No budgets for this period" description="Create a budget to compare planned amounts with actual expenses." /> : (
                <ul className="space-y-4">{relevantBudgets.map((budget) => {
                  const spent = getBudgetSpent(budget, transactions);
                  const state = getBudgetState(budget, spent);
                  return <li key={budget.id}><div className="flex justify-between gap-3 text-sm"><span className="font-medium">{budget.category}</span><span className={state.exceeded ? "text-destructive" : "text-muted-foreground"}>{formatMoney(spent, currency)} / {formatMoney(budget.amount, currency)}</span></div><div className="mt-2 h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${state.exceeded ? "bg-destructive" : state.approaching ? "bg-amber-500" : "bg-[#5d8550]"}`} style={{ width: `${state.percentage}%` }} /></div></li>;
                })}</ul>
              )}
            </Panel>
            <Panel title="Spending observations" description="Transparent comparisons based on the transaction history available.">
              {unusualSpending.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {categoriesBreakdown.length === 0
                    ? "There are no expenses in the selected range to compare."
                    : "No category is at least twice its average in the three immediately preceding date ranges of equal length. The comparison uses recorded expense data only."}
                </p>
              ) : (
                <ul className="space-y-3">{unusualSpending.map(({ name, amount }) => <li key={name} className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/30"><p className="font-medium">{name} spending is notably higher</p><p className="mt-1 text-muted-foreground">Current selected-range total: {formatMoney(amount, currency)}. It is at least twice the average in each of the three preceding calendar months.</p></li>)}</ul>
              )}
              <p className="mt-4 text-xs leading-5 text-muted-foreground">These comparisons are descriptive and are not financial advice or a prediction.</p>
            </Panel>
          </div>
        </>
      )}
    </>
  );
};

export default AnalyticsPage;
