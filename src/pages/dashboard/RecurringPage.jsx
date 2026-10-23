import { useMemo, useState } from "react";
import { CalendarClock, Pause, Pencil, Play, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  createRecurring,
  deleteRecurring,
  setRecurringStatus,
  updateRecurring,
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
import { dateInputValue, formatDate, formatMoney, getNextOccurrence, SUPPORTED_CURRENCIES } from "@/utils/dashboardCalculations";

const defaultSchedule = () => ({
  description: "",
  amount: "",
  currency: localStorage.getItem("finart-currency") || "NGN",
  category: "",
  transactionType: "expense",
  frequency: "monthly",
  nextDate: dateInputValue(),
  endDate: "",
});

const RecurringPage = () => {
  const { recurring, budgets, loading, error } = useDashboardData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(defaultSchedule);
  const [busy, setBusy] = useState(false);

  const budgetCategories = [...new Set(budgets.map((budget) => budget.category).filter(Boolean))].sort();
  const visible = useMemo(() => recurring
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .map((item) => ({ ...item, occurrence: getNextOccurrence(item.nextDate, item.frequency, new Date(), item.endDate) }))
    .sort((a, b) => (a.occurrence?.getTime() ?? Infinity) - (b.occurrence?.getTime() ?? Infinity)), [recurring, statusFilter]);

  const startCreate = () => {
    setEditing(false);
    setValues(defaultSchedule());
  };

  const startEdit = (item) => {
    setEditing(item);
    setValues({
      description: item.description || "",
      amount: String(item.amount || ""),
      currency: item.currency || "NGN",
      category: item.category || "",
      transactionType: item.transactionType || "expense",
      frequency: item.frequency || "monthly",
      nextDate: item.nextDate || "",
      endDate: item.endDate || "",
    });
  };

  const saveSchedule = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (editing) await updateRecurring(editing.id, values);
      else await createRecurring(values);
      toast.success(editing ? "Schedule updated." : "Schedule created.");
      setEditing(null);
    } catch (saveError) {
      toast.error(saveError.message || "The recurring schedule could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (item, nextStatus) => {
    try {
      await setRecurringStatus(item.id, nextStatus);
      toast.success(`Schedule ${nextStatus}.`);
    } catch (statusError) {
      toast.error(statusError.message || "The schedule status could not be changed.");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete the recurring schedule “${item.description}”?`)) return;
    try {
      await deleteRecurring(item.id);
      toast.success("Recurring schedule deleted.");
    } catch (deleteError) {
      toast.error(deleteError.message || "The recurring schedule could not be deleted.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Plan ahead"
        title="Recurring schedules"
        description="Keep track of regular income and payments. Schedules are previews only; FINART does not automatically create transactions or move money."
        action={<button type="button" onClick={startCreate} className={primaryButtonClass}><Plus aria-hidden="true" size={17} /> Add schedule</button>}
      />
      {error && <div className="mb-5"><ErrorNotice message={error} /></div>}
      {recurring.length >= 200 && <p className="mb-4 text-xs text-muted-foreground">The dashboard currently loads up to 200 schedules; additional records may not appear.</p>}
      <Panel
        title="Your schedules"
        description={`${visible.length} ${visible.length === 1 ? "schedule" : "schedules"}`}
        action={
          <select aria-label="Filter recurring schedules" className={`${dashboardInputClass} w-auto`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All schedules</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        }
      >
        {loading ? <LoadingState /> : visible.length === 0 ? (
          <EmptyState title="No schedules found" description={statusFilter === "all" ? "Add a regular income or payment to keep its next date visible." : `There are no ${statusFilter} schedules.`} action={statusFilter === "all" ? <button type="button" onClick={startCreate} className={secondaryButtonClass}>Add a schedule</button> : undefined} />
        ) : (
          <div className="space-y-3">
            {visible.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"><CalendarClock aria-hidden="true" size={18} /></span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold">{item.description}</h2>
 <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${item.status === "active" ? "bg-status-success-surface text-status-success " : "bg-muted text-muted-foreground"}`}>{item.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.category} · {item.transactionType} · {item.frequency}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.occurrence ? `Next occurrence preview: ${formatDate(item.occurrence)}` : `Next date: ${formatDate(item.nextDate)}`}
                      {item.endDate ? ` · Ends ${formatDate(item.endDate)}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="font-semibold">{formatMoney(item.amount, item.currency)}</p>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => startEdit(item)} aria-label={`Edit ${item.description}`} className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><Pencil aria-hidden="true" size={16} /></button>
                    {item.status === "active" ? (
                      <button type="button" onClick={() => changeStatus(item, "paused")} aria-label={`Pause ${item.description}`} className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><Pause aria-hidden="true" size={16} /></button>
                    ) : item.status === "paused" ? (
                      <button type="button" onClick={() => changeStatus(item, "active")} aria-label={`Resume ${item.description}`} className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><Play aria-hidden="true" size={16} /></button>
                    ) : null}
                    <button type="button" onClick={() => remove(item)} aria-label={`Delete ${item.description}`} className="flex size-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"><Trash2 aria-hidden="true" size={16} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      {editing !== null && (
 <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay/45 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="recurring-dialog-title" className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="recurring-dialog-title" className="text-xl font-semibold">{editing ? "Edit schedule" : "Add recurring schedule"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">This records a schedule only; no automatic transaction is created.</p>
              </div>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close recurring form" className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><X aria-hidden="true" size={18} /></button>
            </div>
            <form onSubmit={saveSchedule} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><FormField label="Description" id="rec-description"><input id="rec-description" required maxLength={120} className={dashboardInputClass} value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} /></FormField></div>
              <FormField label="Amount" id="rec-amount"><input id="rec-amount" required type="number" min="0.01" step="0.01" className={dashboardInputClass} value={values.amount} onChange={(event) => setValues({ ...values, amount: event.target.value })} /></FormField>
              <FormField label="Type" id="rec-type"><select id="rec-type" className={dashboardInputClass} value={values.transactionType} onChange={(event) => setValues({ ...values, transactionType: event.target.value })}><option value="expense">Expense</option><option value="income">Income</option></select></FormField>
              <FormField label="Category" id="rec-category">
                <select id="rec-category" required className={dashboardInputClass} value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })}>
                  <option value="" disabled>{budgetCategories.length ? "Select a budget category" : "Create a budget first"}</option>
                  {editing?.category && !budgetCategories.includes(editing.category) && <option value={editing.category}>{editing.category} (existing)</option>}
                  {budgetCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                {!budgetCategories.length && <p className="mt-1 text-xs text-muted-foreground">Create a budget to add recurring schedules by category.</p>}
              </FormField>
              <FormField label="Currency" id="rec-currency"><select id="rec-currency" className={dashboardInputClass} value={values.currency} onChange={(event) => setValues({ ...values, currency: event.target.value })}>{SUPPORTED_CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></FormField>
              <FormField label="Frequency" id="rec-frequency"><select id="rec-frequency" className={dashboardInputClass} value={values.frequency} onChange={(event) => setValues({ ...values, frequency: event.target.value })}>{["weekly", "monthly", "quarterly", "yearly"].map((frequency) => <option key={frequency}>{frequency}</option>)}</select></FormField>
              <FormField label="Next occurrence date" id="rec-next-date"><input id="rec-next-date" required type="date" className={dashboardInputClass} value={values.nextDate} onChange={(event) => setValues({ ...values, nextDate: event.target.value })} /></FormField>
              <FormField label="End date (optional)" id="rec-end-date"><input id="rec-end-date" type="date" min={values.nextDate} className={dashboardInputClass} value={values.endDate} onChange={(event) => setValues({ ...values, endDate: event.target.value })} /></FormField>
              <div className="mt-1 flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={() => setEditing(null)} className={secondaryButtonClass}>Cancel</button>
                <button type="submit" disabled={busy} className={primaryButtonClass}>{busy ? "Saving…" : "Save schedule"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default RecurringPage;
