import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  EmptyState,
  ErrorNotice,
  PageHeader,
  Panel,
  primaryButtonClass,
} from "@/components/dashboard/DashboardUI";
import {
  filterTransactions,
  getAmount,
  getCurrency,
  getTransactionDate,
  dateInputValue,
  SUPPORTED_CURRENCIES,
} from "@/utils/dashboardCalculations";

const monthStart = () => `${dateInputValue().slice(0, 7)}-01`;
const today = dateInputValue;

const csvCell = (value) => {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

const ReportsPage = () => {
  const { transactions, loading, error } = useDashboardData();
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(today);
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState(localStorage.getItem("finart-currency") || "NGN");
  const [reportError, setReportError] = useState("");
  const [generating, setGenerating] = useState(false);
  const filtered = useMemo(
    () => filterTransactions(transactions, { from, to, type }).filter((item) => getCurrency(item, currency) === currency),
    [transactions, from, to, type, currency],
  );

  const generateCsv = () => {
    setReportError("");
    if (!filtered.length) {
      setReportError("There are no transactions for the selected filters.");
      return;
    }

    setGenerating(true);
    try {
      const rows = [
        ["Date", "Description", "Category", "Type", "Amount", "Currency", "Notes"],
        ...filtered.map((item) => [
          getTransactionDate(item) ? dateInputValue(getTransactionDate(item)) : "",
          item.description || "",
          item.category || "Uncategorized",
          item.transactionType || "",
          getAmount(item).toFixed(2),
          getCurrency(item),
          item.notes || "",
        ]),
      ];
      const contents = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
      const blob = new Blob([contents], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `finart-transactions-${from}-to-${to}-${currency.toLowerCase()}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setReportError("The CSV file could not be generated. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Your data, your view" title="Reports" description="Export the transaction records currently loaded for your account as a CSV file." />
      {(error || reportError) && <div className="mb-5"><ErrorNotice message={reportError || error} /></div>}
      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Panel title="Build a transaction report" description="Choose a date range, type, and currency before exporting.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><label htmlFor="report-from" className="text-sm font-medium">From</label><input id="report-from" type="date" max={to} className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" value={from} onChange={(event) => setFrom(event.target.value)} /></div>
            <div className="space-y-1.5"><label htmlFor="report-to" className="text-sm font-medium">To</label><input id="report-to" type="date" min={from} className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" value={to} onChange={(event) => setTo(event.target.value)} /></div>
            <div className="space-y-1.5"><label htmlFor="report-type" className="text-sm font-medium">Transaction type</label><select id="report-type" className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option><option value="investment">Investment</option></select></div>
            <div className="space-y-1.5"><label htmlFor="report-currency" className="text-sm font-medium">Currency</label><select id="report-currency" className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" value={currency} onChange={(event) => setCurrency(event.target.value)}>{SUPPORTED_CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select></div>
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-medium">{loading ? "Loading records…" : `${filtered.length} records in report`}</p><p className="mt-1 text-xs text-muted-foreground">Only {currency} transactions are included; currencies are not converted.</p></div>
            <button type="button" disabled={loading || generating || !filtered.length} onClick={generateCsv} className={primaryButtonClass}><Download aria-hidden="true" size={17} />{generating ? "Preparing…" : "Download CSV"}</button>
          </div>
        </Panel>

        <Panel title="Export formats" description="Available formats depend on the installed project tooling.">
          <div className="space-y-3">
 <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-subtle p-4 ">
 <FileText aria-hidden="true" size={20} className="text-primary " />
              <div><p className="text-sm font-semibold">CSV</p><p className="text-xs text-muted-foreground">Available · generated in your browser</p></div>
            </div>
            <div className="rounded-xl border border-border p-4 opacity-75"><p className="text-sm font-semibold">Excel (.xlsx)</p><p className="mt-1 text-xs text-muted-foreground">Unavailable: this project has no spreadsheet export dependency.</p></div>
            <div className="rounded-xl border border-border p-4 opacity-75"><p className="text-sm font-semibold">PDF</p><p className="mt-1 text-xs text-muted-foreground">Unavailable: this project has no PDF export dependency.</p></div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Download history is not shown because report history is not persisted. Data subscriptions are limited to the most recent 500 transactions.</p>
        </Panel>
      </div>

      {!loading && filtered.length === 0 && (
        <div className="mt-5"><EmptyState title="No records match this report" description="Adjust the date, type, or currency filters, or add transactions first." /></div>
      )}
    </>
  );
};

export default ReportsPage;
