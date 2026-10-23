import { useMemo } from "react";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarClock, PiggyBank, ReceiptText, Wallet } from "lucide-react";
import { Link } from "react-router";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  EmptyState,
  ErrorNotice,
  LoadingState,
  MetricCard,
  PageHeader,
  Panel,
  secondaryButtonClass,
} from "@/components/dashboard/DashboardUI";
import {
  formatDate,
  formatMoney,
  getAmount,
  getBudgetSpent,
  getBudgetState,
  getCurrency,
  getNextOccurrence,
  getRecentTransactions,
  getTransactionDate,
  groupTotalsByCategory,
  monthKey,
  monthlyTotals,
  sumTransactions,
} from "@/utils/dashboardCalculations";

const OverviewPage = () => {
  const { transactions, budgets, recurring, loading, error } = useDashboardData();
  const currency = localStorage.getItem("finart-currency") || "NGN";
  const month = monthKey();
  const monthIncome = sumTransactions(transactions, "income", month, currency);
  const monthExpenses = sumTransactions(transactions, "expense", month, currency);
  const monthInvestments = sumTransactions(transactions, "investment", month, currency);
  const monthSavings = monthIncome - monthExpenses - monthInvestments;
  const savingsRate = monthIncome > 0 ? (monthSavings / monthIncome) * 100 : null;
  const categoryTotals = useMemo(
    () => groupTotalsByCategory(transactions, month, currency).slice(0, 5),
    [transactions, month, currency],
  );
  const cashflow = useMemo(() => monthlyTotals(transactions, currency), [transactions, currency]);
  const maxValue = Math.max(1, ...cashflow.flatMap((item) => [item.income, item.expenses]));
  const recent = getRecentTransactions(transactions, 5);
  const currentBudgets = budgets.filter((budget) => budget.month === month && budget.currency === currency);
  const upcoming = recurring
    .filter((item) => item.status === "active")
    .map((item) => ({ ...item, occurrence: getNextOccurrence(item.nextDate, item.frequency) }))
    .filter((item) => item.occurrence && item.occurrence.getTime() - Date.now() <= 30 * 86400000)
    .sort((a, b) => a.occurrence - b.occurrence)
    .slice(0, 4);
  const totalRecordedIncome = sumTransactions(transactions, "income", null, currency);
  const totalRecordedExpense = sumTransactions(transactions, "expense", null, currency);
  const totalRecordedInvestments = sumTransactions(transactions, "investment", null, currency);
  const totalRecordedNet = totalRecordedIncome - totalRecordedExpense - totalRecordedInvestments;
  const currencySplit = [...new Set(transactions.map((item) => getCurrency(item)))].filter((item) => item !== currency);

  return (
    <>
      <PageHeader
        eyebrow={new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date())}
        title="Your financial overview"
        description="A clear view of the activity you've recorded. Figures are separated by currency."
        action={<Link to="/dashboard/transactions" className={secondaryButtonClass}>View transactions <ArrowRight aria-hidden="true" size={16} /></Link>}
      />

      {error && <div className="mb-5"><ErrorNotice message={error} /></div>}
      {loading ? <LoadingState /> : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Net recorded cash flow" value={formatMoney(totalRecordedNet, currency)} detail="Recorded income less expenses and investments" icon={Wallet} />
            <MetricCard label="Income this month" value={formatMoney(monthIncome, currency)} detail="From recorded transactions" icon={ArrowUpRight} />
            <MetricCard label="Expenses this month" value={formatMoney(monthExpenses, currency)} detail="From recorded expenses" icon={ReceiptText} />
            <MetricCard label="Investments this month" value={formatMoney(monthInvestments, currency)} detail="Recorded investment contributions" icon={BriefcaseBusiness} />
            <MetricCard label="Cash flow after activity" value={formatMoney(monthSavings, currency)} detail={savingsRate === null ? "Add income to calculate this ratio" : `Income less expenses and investments · ${savingsRate.toFixed(1)}% of income`} icon={PiggyBank} />
          </div>

          {currencySplit.length > 0 && (
            <p className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Other currencies are not converted into {currency}. Their transaction totals remain separate in Analytics and Reports.
            </p>
          )}

          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <Panel title="Cash flow" description="Recorded monthly income and expenses for the last six months.">
              {cashflow.every((item) => item.income === 0 && item.expenses === 0) ? (
                <EmptyState title="Not enough activity to chart" description="Record transactions to see your cash flow over time." />
              ) : (
                <div>
                  <div className="flex h-56 items-end gap-3 border-b border-border pb-3 sm:gap-5">
                    {cashflow.map((item) => (
                      <div key={item.month} className="flex h-full min-w-0 flex-1 items-end justify-center gap-1.5">
                        <div
                          title={`${item.label} income: ${formatMoney(item.income, currency)}`}
                          className="w-full max-w-7 rounded-t-md bg-[#174b38] dark:bg-[#d0e7ad]"
                          style={{ height: `${Math.max(item.income > 0 ? 4 : 0, (item.income / maxValue) * 100)}%` }}
                        />
                        <div
                          title={`${item.label} expenses: ${formatMoney(item.expenses, currency)}`}
                          className="w-full max-w-7 rounded-t-md bg-[#bdd0ad]"
                          style={{ height: `${Math.max(item.expenses > 0 ? 4 : 0, (item.expenses / maxValue) * 100)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    {cashflow.map((item) => <span key={item.month}>{item.label}</span>)}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2"><i className="size-2.5 rounded-sm bg-[#174b38] dark:bg-[#d0e7ad]" /> Income</span>
                    <span className="inline-flex items-center gap-2"><i className="size-2.5 rounded-sm bg-[#bdd0ad]" /> Expenses</span>
                  </div>
                  <p className="sr-only">
                    {cashflow.map((item) => `${item.label}: income ${formatMoney(item.income, currency)}, expenses ${formatMoney(item.expenses, currency)}`).join("; ")}
                  </p>
                </div>
              )}
            </Panel>

            <Panel title="Spending by category" description="Expenses recorded this month.">
              {categoryTotals.length === 0 ? (
                <EmptyState title="No expenses recorded" description="Your category breakdown will appear as you add expenses." />
              ) : (
                <ul className="space-y-4">
                  {categoryTotals.map(({ category, amount }) => {
                    const total = categoryTotals.reduce((sum, item) => sum + item.amount, 0);
                    const percent = total > 0 ? (amount / total) * 100 : 0;
                    return (
                      <li key={category}>
                        <div className="mb-1.5 flex justify-between gap-3 text-sm">
                          <span className="truncate font-medium">{category}</span>
                          <span className="shrink-0 text-muted-foreground">{formatMoney(amount, currency)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${category} share of spending`} aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
                          <div className="h-full rounded-full bg-[#5d8550]" style={{ width: `${percent}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <Panel title="Recent transactions" action={<Link to="/dashboard/transactions" className="text-sm font-medium text-primary hover:underline">View all</Link>}>
              {recent.length === 0 ? <EmptyState title="No recent activity" description="Transactions you record will appear here." /> : (
                <ul className="divide-y divide-border">
                  {recent.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.description || "Untitled transaction"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.category || "Uncategorized"} · {formatDate(getTransactionDate(item))}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold">{formatMoney(getAmount(item), getCurrency(item))}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Budget watch" description="Budgets near or over their limit this month.">
              {currentBudgets.length === 0 ? (
                <EmptyState title="No budgets for this month" description="Set category limits to keep your spending in view." action={<Link to="/dashboard/budgets" className="text-sm font-semibold text-primary hover:underline">Create a budget</Link>} />
              ) : (
                <ul className="space-y-4">
                  {currentBudgets.slice(0, 4).map((budget) => {
                    const spent = getBudgetSpent(budget, transactions);
                    const state = getBudgetState(budget, spent);
                    return (
                      <li key={budget.id}>
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="font-medium">{budget.category}</span>
                          <span className={state.exceeded ? "font-semibold text-destructive" : "text-muted-foreground"}>
                            {state.exceeded ? "Over budget" : formatMoney(state.remaining, currency) + " left"}
                          </span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-muted">
                          <div className={`h-2 rounded-full ${state.exceeded ? "bg-destructive" : state.approaching ? "bg-amber-500" : "bg-[#5d8550]"}`} style={{ width: `${state.percentage}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{formatMoney(spent, currency)} of {formatMoney(budget.amount, currency)}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Upcoming recurring" description="Schedule previews only; payments are not created automatically.">
              {upcoming.length === 0 ? (
                <EmptyState title="Nothing scheduled soon" description="Active schedules with an upcoming date will appear here." action={<Link to="/dashboard/recurring" className="text-sm font-semibold text-primary hover:underline">Manage recurring</Link>} />
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <CalendarClock aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.occurrence)} · {item.frequency}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">{formatMoney(item.amount, item.currency)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
          {transactions.length >= 500 && <p className="mt-5 text-xs text-muted-foreground">Overview calculations use the most recent 500 transactions currently loaded; totals may not include older activity.</p>}
          <p className="sr-only">Investment transactions this month: {formatMoney(monthInvestments, currency)}. Net recorded cash flow is income minus expenses and investments; it is not net worth or a reconciled account balance.</p>
        </>
      )}
    </>
  );
};

export default OverviewPage;
