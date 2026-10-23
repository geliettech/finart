export const SUPPORTED_CURRENCIES = Object.freeze([
  "NGN",
  "USD",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
  "JPY",
  "ZAR",
]);

export const dateInputValue = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const getAmount = (transaction) =>
  Number(transaction.transactionAmount ?? transaction.amount ?? 0) || 0;

export const getCurrency = (item, fallback = "NGN") =>
  (item.currency || fallback).toUpperCase();

export const getTransactionDate = (transaction) => {
  if (transaction.transactionDate) {
    const date = new Date(`${transaction.transactionDate}T00:00:00`);
    return Number.isNaN(date.getTime()) || dateInputValue(date) !== transaction.transactionDate
      ? null
      : date;
  }

  const createdAt = transaction.createdAt;
  const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatMoney = (value, currency = "NGN") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  } catch {
    return `${currency} ${(Number(value) || 0).toFixed(2)}`;
  }
};

export const formatDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const monthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const monthBounds = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return {
    start: new Date(year, monthNumber - 1, 1),
    end: new Date(year, monthNumber, 1),
  };
};

export const isInMonth = (transaction, month) => {
  const date = getTransactionDate(transaction);
  if (!date) return false;
  const { start, end } = monthBounds(month);
  return date >= start && date < end;
};

export const sumTransactions = (transactions, type, month, currency = "NGN") =>
  transactions.reduce((total, transaction) => {
    const matchesType = transaction.transactionType === type;
    const matchesCurrency = getCurrency(transaction, currency) === currency;
    const matchesMonth = !month || isInMonth(transaction, month);
    return matchesType && matchesCurrency && matchesMonth
      ? total + getAmount(transaction)
      : total;
  }, 0);

export const getBudgetSpent = (budget, transactions) =>
  transactions.reduce((total, transaction) => {
    const sameMonth = isInMonth(transaction, budget.month);
    const sameCategory =
      (transaction.category || "Uncategorized").toLowerCase() ===
      budget.category.toLowerCase();
    const sameCurrency = getCurrency(transaction, budget.currency) === budget.currency;

    return transaction.transactionType === "expense" &&
      sameMonth &&
      sameCategory &&
      sameCurrency
      ? total + getAmount(transaction)
      : total;
  }, 0);

export const getBudgetState = (budget, spent) => {
  const amount = Number(budget.amount) || 0;
  const remaining = amount - spent;
  const percentage = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

  return {
    remaining,
    percentage,
    exceeded: spent > amount,
    approaching: spent >= amount * 0.8 && spent <= amount,
  };
};

export const getRecentTransactions = (transactions, limit = 5) =>
  [...transactions]
    .sort((a, b) => {
      const aDate = getTransactionDate(a)?.getTime() ?? 0;
      const bDate = getTransactionDate(b)?.getTime() ?? 0;
      return bDate - aDate;
    })
    .slice(0, limit);

export const getNextOccurrence = (dateValue, frequency, now = new Date(), endDate = "") => {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  let guard = 0;
  while (date < now && guard < 520) {
    if (frequency === "weekly") date.setDate(date.getDate() + 7);
    else if (frequency === "monthly") advanceMonth(date, 1);
    else if (frequency === "quarterly") advanceMonth(date, 3);
    else if (frequency === "yearly") {
      const day = date.getDate();
      date.setDate(1);
      date.setFullYear(date.getFullYear() + 1);
      date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
    }
    else return null;
    guard += 1;
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999`);
    if (!Number.isNaN(end.getTime()) && date > end) return null;
  }

  return date;
};

const advanceMonth = (date, months) => {
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
};

export const groupTotalsByCategory = (transactions, month, currency = "NGN") => {
  const totals = new Map();

  transactions.forEach((transaction) => {
    if (
      transaction.transactionType !== "expense" ||
      !isInMonth(transaction, month) ||
      getCurrency(transaction, currency) !== currency
    ) {
      return;
    }

    const category = transaction.category || "Uncategorized";
    totals.set(category, (totals.get(category) ?? 0) + getAmount(transaction));
  });

  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const monthlyTotals = (transactions, currency = "NGN", count = 6) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (count - index - 1));
    const month = monthKey(date);
    return {
      month,
      label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
      income: sumTransactions(transactions, "income", month, currency),
      expenses: sumTransactions(transactions, "expense", month, currency),
    };
  });

export const filterTransactions = (transactions, filters = {}) =>
  transactions.filter((transaction) => {
    const description = (transaction.description || "").toLowerCase();
    const category = (transaction.category || "").toLowerCase();
    const term = (filters.search || "").trim().toLowerCase();
    const typeMatches = !filters.type || transaction.transactionType === filters.type;
    const categoryMatches =
      !filters.category || transaction.category === filters.category;
    const date = getTransactionDate(transaction);
    const fromMatches = !filters.from || (date && date >= new Date(`${filters.from}T00:00:00`));
    const dayAfterTo = filters.to ? new Date(`${filters.to}T00:00:00`) : null;
    if (dayAfterTo) dayAfterTo.setDate(dayAfterTo.getDate() + 1);
    const toMatches = !filters.to || (date && date < dayAfterTo);

    return (
      (!term || description.includes(term) || category.includes(term)) &&
      typeMatches &&
      categoryMatches &&
      fromMatches &&
      toMatches
    );
  });
