import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  createBudget,
  deleteBudget,
  updateBudget,
} from "@/services/dashboardData";
import {
  dashboardInputClass,
  EmptyState,
  ErrorNotice,
  FormField,
  LoadingState,
  PageHeader,
  Panel,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/dashboard/DashboardUI";
import {
  formatMoney,
  getBudgetSpent,
  getBudgetState,
  monthKey,
  SUPPORTED_CURRENCIES,
} from "@/utils/dashboardCalculations";

const defaultBudget = () => ({
  category: "",
  amount: "",
  currency: localStorage.getItem("finart-currency") || "NGN",
  month: monthKey(),
});

const BudgetsPage = () => {
  const { budgets, transactions, loading, error } = useDashboardData();
  const [month, setMonth] = useState(monthKey());
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(defaultBudget);
  const [busy, setBusy] = useState(false);
  const visibleBudgets = useMemo(
    () => budgets.filter((budget) => budget.month === month),
    [budgets, month],
  );

  const startCreate = () => {
    setEditing(false);
    setValues({ ...defaultBudget(), month });
  };
  const startEdit = (budget) => {
    setEditing(budget);
    setValues({
      category: budget.category,
      amount: String(budget.amount),
      currency: budget.currency || "NGN",
      month: budget.month,
    });
  };

  const saveBudget = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (editing) await updateBudget(editing.id, values);
      else await createBudget(values);
      toast.success(editing ? "Budget updated." : "Budget created.");
      setEditing(null);
    } catch (saveError) {
      toast.error(saveError.message || "The budget could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const removeBudget = async (budget) => {
    if (!window.confirm(`Delete the ${budget.category} budget for ${budget.month}?`)) return;
    try {
      await deleteBudget(budget.id);
      toast.success("Budget deleted.");
    } catch (deleteError) {
      toast.error(deleteError.message || "The budget could not be deleted.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Plan your spending"
        title="Budgets"
        description="Set monthly category limits and compare them with recorded expenses in the same currency."
        action={<button type="button" onClick={startCreate} className={primaryButtonClass}><Plus aria-hidden="true" size={17} /> Create budget</button>}
      />
      {error && <div className="mb-5"><ErrorNotice message={error} /></div>}
      {budgets.length >= 200 && <p className="mb-4 text-xs text-muted-foreground">The dashboard currently loads up to 200 budgets; additional records may not appear.</p>}
      <Panel title="Budget period" description="Choose the month you want to review.">
        <input type="month" aria-label="Budget month" className={`${dashboardInputClass} max-w-xs`} value={month} onChange={(event) => setMonth(event.target.value || monthKey())} />
      </Panel>

      <div className="mt-5">
        {loading ? <Panel><LoadingState /></Panel> : visibleBudgets.length === 0 ? (
          <Panel>
            <EmptyState title="No budgets for this month" description="Create a category budget to compare your spending with a monthly limit." action={<button type="button" onClick={startCreate} className={secondaryButtonClass}>Create a budget</button>} />
          </Panel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleBudgets.map((budget) => {
              const spent = getBudgetSpent(budget, transactions);
              const state = getBudgetState(budget, spent);
              return (
                <Panel key={budget.id} className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{budget.category}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{budget.month} · {budget.currency}</p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => startEdit(budget)} aria-label={`Edit ${budget.category} budget`} className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><Pencil aria-hidden="true" size={16} /></button>
                      <button type="button" onClick={() => removeBudget(budget)} aria-label={`Delete ${budget.category} budget`} className="flex size-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"><Trash2 aria-hidden="true" size={16} /></button>
                    </div>
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-3">
                    <span className="text-2xl font-semibold">{formatMoney(spent, budget.currency)}</span>
                    <span className="text-sm text-muted-foreground">of {formatMoney(budget.amount, budget.currency)}</span>
                  </div>
                  <div
                    className="mt-4 h-2.5 rounded-full bg-muted"
                    role="progressbar"
                    aria-label={`${budget.category} budget used`}
                    aria-valuenow={Math.round(state.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
 className={`h-full rounded-full ${state.exceeded ? "bg-destructive" : state.approaching ? "bg-status-warning-surface" : "bg-muted"}`}
                      style={{ width: `${state.percentage}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between gap-3 text-sm">
                    <span className={state.exceeded ? "font-medium text-destructive" : "text-muted-foreground"}>
                      {state.exceeded ? "Budget exceeded" : state.approaching ? "Approaching limit" : `${Math.round(state.percentage)}% used`}
                    </span>
                    <span className="font-medium">{formatMoney(state.remaining, budget.currency)} {state.remaining < 0 ? "over" : "remaining"}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Actual expense transactions only. Income and investment records are excluded.
                  </p>
                </Panel>
              );
            })}
          </div>
        )}
      </div>

      {editing !== null && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/45 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="budget-dialog-title" className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="budget-dialog-title" className="text-xl font-semibold">{editing ? "Edit budget" : "Create budget"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Spending is calculated from matching expense records.</p>
              </div>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close budget form" className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><X aria-hidden="true" size={18} /></button>
            </div>
            <form onSubmit={saveBudget} className="space-y-4">
              <FormField label="Category" id="budget-category">
                <input id="budget-category" required maxLength={60} className={dashboardInputClass} value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })} />
              </FormField>
              <FormField label="Monthly limit" id="budget-amount">
                <input id="budget-amount" required type="number" min="0.01" step="0.01" className={dashboardInputClass} value={values.amount} onChange={(event) => setValues({ ...values, amount: event.target.value })} />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Currency" id="budget-currency">
                  <select id="budget-currency" className={dashboardInputClass} value={values.currency} onChange={(event) => setValues({ ...values, currency: event.target.value })}>
                    {SUPPORTED_CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
                  </select>
                </FormField>
                <FormField label="Month" id="budget-month">
                  <input id="budget-month" required type="month" className={dashboardInputClass} value={values.month} onChange={(event) => setValues({ ...values, month: event.target.value })} />
                </FormField>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className={secondaryButtonClass}>Cancel</button>
                <button type="submit" disabled={busy} className={primaryButtonClass}>{busy ? "Saving…" : "Save budget"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default BudgetsPage;
