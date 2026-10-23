import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/services/dashboardData";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
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
  filterTransactions,
  formatDate,
  formatMoney,
  getAmount,
  getCurrency,
  getTransactionDate,
  dateInputValue,
  SUPPORTED_CURRENCIES,
  sumTransactions,
} from "@/utils/dashboardCalculations";

const today = dateInputValue;
const emptyForm = () => ({
  description: "",
  transactionAmount: "",
  transactionType: "expense",
  category: "",
  transactionDate: today(),
  currency: localStorage.getItem("finart-currency") || "NGN",
  notes: "",
});

const TransactionsPage = () => {
  const { transactions, loading, error, searchTerm } = useDashboardData();
  const [filters, setFilters] = useState({ type: "", category: "", from: "", to: "" });
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const pageSize = 12;

  useEffect(() => setPage(1), [searchTerm]);

  const categories = [...new Set(transactions.map((item) => item.category).filter(Boolean))].sort();
  const filtered = useMemo(() => {
    const result = filterTransactions(transactions, {
      ...filters,
      search: searchTerm,
    });
    result.sort((a, b) => {
      if (sort === "date-asc") return (getTransactionDate(a)?.getTime() || 0) - (getTransactionDate(b)?.getTime() || 0);
      if (sort === "amount-desc") return getAmount(b) - getAmount(a);
      if (sort === "amount-asc") return getAmount(a) - getAmount(b);
      return (getTransactionDate(b)?.getTime() || 0) - (getTransactionDate(a)?.getTime() || 0);
    });
    return result;
  }, [transactions, filters, searchTerm, sort]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const openCreate = () => {
    setEditing(null);
    setFormValues(emptyForm());
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
    setFormValues({
      description: item.description || "",
      transactionAmount: String(getAmount(item)),
      transactionType: item.transactionType || "expense",
      category: item.category || "Uncategorized",
      transactionDate: item.transactionDate || (getTransactionDate(item) ? dateInputValue(getTransactionDate(item)) : today()),
      currency: getCurrency(item),
      notes: item.notes || "",
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editing) await updateTransaction(editing.id, formValues);
      else await createTransaction(formValues);
      toast.success(editing ? "Transaction updated." : "Transaction added.");
      setFormOpen(false);
      setEditing(null);
      setFormValues(emptyForm());
    } catch (saveError) {
      toast.error(saveError.message || "The transaction could not be saved.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.description}"? This action cannot be undone.`)) return;
    try {
      await deleteTransaction(item.id);
      toast.success("Transaction deleted.");
    } catch (deleteError) {
      toast.error(deleteError.message || "The transaction could not be deleted.");
    }
  };

  const currentCurrency = localStorage.getItem("finart-currency") || "NGN";

  return (
    <>
      <PageHeader
        eyebrow="Your activity"
        title="Transactions"
        description="Review and manage your income, expenses, and investments."
        action={<button type="button" onClick={openCreate} className={primaryButtonClass}><Plus aria-hidden="true" size={17} /> Add transaction</button>}
      />

      {error && <div className="mb-5"><ErrorNotice message={error} /></div>}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {["income", "expense", "investment"].map((type) => (
          <Panel key={type} className="p-4">
            <p className="text-xs capitalize text-muted-foreground">{type} this month · {currentCurrency}</p>
            <p className="mt-2 text-xl font-semibold">
              {formatMoney(sumTransactions(transactions, type, today().slice(0, 7), currentCurrency), currentCurrency)}
            </p>
          </Panel>
        ))}
      </div>

      <Panel
        title="Transaction history"
        description={`${filtered.length} ${filtered.length === 1 ? "record" : "records"}${searchTerm ? ` matching “${searchTerm}”` : ""}`}
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <select aria-label="Filter by type" className={dashboardInputClass} value={filters.type} onChange={(event) => { setPage(1); setFilters({ ...filters, type: event.target.value }); }}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
          </select>
          <select aria-label="Filter by category" className={dashboardInputClass} value={filters.category} onChange={(event) => { setPage(1); setFilters({ ...filters, category: event.target.value }); }}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <input aria-label="From date" type="date" className={dashboardInputClass} value={filters.from} onChange={(event) => { setPage(1); setFilters({ ...filters, from: event.target.value }); }} />
          <input aria-label="To date" type="date" className={dashboardInputClass} value={filters.to} onChange={(event) => { setPage(1); setFilters({ ...filters, to: event.target.value }); }} />
          <select aria-label="Sort transactions" className={dashboardInputClass} value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>

        {loading ? <LoadingState /> : filtered.length === 0 ? (
          <EmptyState
            title={searchTerm || filters.type || filters.category || filters.from || filters.to ? "No matching transactions" : "No transactions yet"}
            description={searchTerm || filters.type || filters.category || filters.from || filters.to ? "Try changing or clearing your filters." : "Add your first financial record to see your activity here."}
            action={!transactions.length ? <button type="button" onClick={openCreate} className={secondaryButtonClass}>Add a transaction</button> : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[690px] text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((item) => {
                    const positive = item.transactionType === "income";
                    return (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="max-w-52 truncate px-4 py-3 font-medium">{item.description || "Untitled transaction"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.category || "Uncategorized"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(getTransactionDate(item))}</td>
                        <td className="px-4 py-3 capitalize">{item.transactionType || "Unknown"}</td>
                        <td className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${positive ? "text-emerald-700 dark:text-emerald-300" : ""}`}>
                          <span className="inline-flex items-center justify-end gap-1">
                            {positive ? <ArrowDown aria-hidden="true" size={14} /> : <ArrowUp aria-hidden="true" size={14} />}
                            {formatMoney(getAmount(item), getCurrency(item))}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${item.description}`} className="flex size-9 items-center justify-center rounded-lg hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42]"><Pencil aria-hidden="true" size={16} /></button>
                            <button type="button" onClick={() => handleDelete(item)} aria-label={`Delete ${item.description}`} className="flex size-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-destructive"><Trash2 aria-hidden="true" size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Page {page} of {pageCount}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className={secondaryButtonClass}>Previous</button>
                <button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)} className={secondaryButtonClass}>Next</button>
              </div>
            </div>
          </>
        )}
      </Panel>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="transaction-dialog-title" className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="transaction-dialog-title" className="text-xl font-semibold">{editing ? "Edit transaction" : "Add a transaction"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Enter the details for this financial record.</p>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close transaction form" className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"><X aria-hidden="true" size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField label="Description" id="tx-description">
                  <input id="tx-description" maxLength={120} required className={dashboardInputClass} value={formValues.description} onChange={(event) => setFormValues({ ...formValues, description: event.target.value })} />
                </FormField>
              </div>
              <FormField label="Amount" id="tx-amount">
                <input id="tx-amount" type="number" min="0.01" step="0.01" required className={dashboardInputClass} value={formValues.transactionAmount} onChange={(event) => setFormValues({ ...formValues, transactionAmount: event.target.value })} />
              </FormField>
              <FormField label="Type" id="tx-type">
                <select id="tx-type" className={dashboardInputClass} value={formValues.transactionType} onChange={(event) => setFormValues({ ...formValues, transactionType: event.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="investment">Investment</option>
                </select>
              </FormField>
              <FormField label="Category" id="tx-category">
                <input id="tx-category" maxLength={60} required placeholder="e.g. Housing" className={dashboardInputClass} value={formValues.category} onChange={(event) => setFormValues({ ...formValues, category: event.target.value })} />
              </FormField>
              <FormField label="Date" id="tx-date">
                <input id="tx-date" type="date" required className={dashboardInputClass} value={formValues.transactionDate} onChange={(event) => setFormValues({ ...formValues, transactionDate: event.target.value })} />
              </FormField>
              <FormField label="Currency" id="tx-currency">
                <select id="tx-currency" className={dashboardInputClass} value={formValues.currency} onChange={(event) => setFormValues({ ...formValues, currency: event.target.value })}>
                  {SUPPORTED_CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
                </select>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Notes (optional)" id="tx-notes">
                  <textarea id="tx-notes" maxLength={500} rows={3} className={dashboardInputClass} value={formValues.notes} onChange={(event) => setFormValues({ ...formValues, notes: event.target.value })} />
                </FormField>
              </div>
              <div className="mt-1 flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={() => setFormOpen(false)} className={secondaryButtonClass}>Cancel</button>
                <button type="submit" disabled={submitting} className={primaryButtonClass}>{submitting ? "Saving…" : editing ? "Save changes" : "Add transaction"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default TransactionsPage;
