import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase";

const collectionRef = (name) => collection(db, name);

const currentUid = () => {
  const uid = auth.currentUser?.uid;
  if (!uid || !auth.currentUser.emailVerified) {
    throw new Error("Sign in with a verified account to manage financial data.");
  }
  return uid;
};

const requiredString = (value, label, maxLength = 120) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`${label} is required and must be ${maxLength} characters or fewer.`);
  }
  return value.trim();
};

const positiveAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000_000) {
    throw new Error("Enter an amount greater than zero.");
  }
  return amount;
};

const validCurrency = (value) => {
  const currency = requiredString(value || "NGN", "Currency", 3).toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Choose a valid 3-letter currency code.");
  return currency;
};

const validIsoDate = (value, label) => {
  const date = requiredString(value, label, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Choose a valid ${label.toLowerCase()}.`);
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Choose a valid ${label.toLowerCase()}.`);
  }
  return date;
};

const validMonth = (value) => {
  const month = requiredString(value, "Month", 7);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error("Choose a valid budget month.");
  }
  return month;
};

const watchOwnedCollection = (name, uid, onData, onError, sortField) => {
  const constraints = [where("userId", "==", uid)];
  if (name === "transactions") constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(name === "transactions" ? 500 : 200));
  if (sortField) {
    return onSnapshot(
      query(collectionRef(name), ...constraints),
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        items.sort((a, b) => {
          const aValue = a[sortField]?.toMillis?.() ?? a[sortField] ?? "";
          const bValue = b[sortField]?.toMillis?.() ?? b[sortField] ?? "";
          return String(bValue).localeCompare(String(aValue));
        });
        onData(items, name);
      },
      (error) => onError(error, name),
    );
  }

  return onSnapshot(
    query(collectionRef(name), ...constraints),
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })), name),
    (error) => onError(error, name),
  );
};

export const subscribeToDashboardData = (uid, callbacks) => {
  if (!uid || auth.currentUser?.uid !== uid || !auth.currentUser.emailVerified) {
    throw new Error("A verified signed-in user is required.");
  }

  const unsubscribers = [
    watchOwnedCollection("transactions", uid, callbacks.onTransactions, callbacks.onError, "transactionDate"),
    watchOwnedCollection("budgets", uid, callbacks.onBudgets, callbacks.onError, "month"),
    watchOwnedCollection("recurring", uid, callbacks.onRecurring, callbacks.onError, "nextDate"),
  ];

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

export const createTransaction = async (input) => {
  const uid = currentUid();
  const transactionType = requiredString(input.transactionType, "Type", 20);
  if (!["income", "expense", "investment"].includes(transactionType)) {
    throw new Error("Choose income, expense, or investment.");
  }

  const transactionDate = validIsoDate(input.transactionDate, "Date");

  return addDoc(collectionRef("transactions"), {
    userId: uid,
    description: requiredString(input.description, "Description"),
    transactionAmount: positiveAmount(input.transactionAmount),
    transactionType,
    category: requiredString(input.category, "Category", 60),
    currency: validCurrency(input.currency),
    transactionDate,
    notes: typeof input.notes === "string" ? input.notes.trim().slice(0, 500) : "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const ownedDocument = async (collectionName, id, uid) => {
  const ref = doc(db, collectionName, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists() || snapshot.data().userId !== uid) {
    throw new Error("This record is no longer available.");
  }
  return ref;
};

export const updateTransaction = async (id, input) => {
  const uid = currentUid();
  const ref = await ownedDocument("transactions", id, uid);
  const transactionType = requiredString(input.transactionType, "Type", 20);
  if (!["income", "expense", "investment"].includes(transactionType)) {
    throw new Error("Choose income, expense, or investment.");
  }

  await updateDoc(ref, {
    description: requiredString(input.description, "Description"),
    transactionAmount: positiveAmount(input.transactionAmount),
    transactionType,
    category: requiredString(input.category, "Category", 60),
    currency: validCurrency(input.currency),
    transactionDate: validIsoDate(input.transactionDate, "Date"),
    notes: typeof input.notes === "string" ? input.notes.trim().slice(0, 500) : "",
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (id) => {
  const uid = currentUid();
  await deleteDoc(await ownedDocument("transactions", id, uid));
};

export const createBudget = async (input) => {
  const uid = currentUid();
  const month = validMonth(input.month);

  return addDoc(collectionRef("budgets"), {
    userId: uid,
    category: requiredString(input.category, "Category", 60),
    amount: positiveAmount(input.amount),
    currency: validCurrency(input.currency),
    month,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateBudget = async (id, input) => {
  const uid = currentUid();
  const ref = await ownedDocument("budgets", id, uid);
  const month = validMonth(input.month);

  await updateDoc(ref, {
    category: requiredString(input.category, "Category", 60),
    amount: positiveAmount(input.amount),
    currency: validCurrency(input.currency),
    month,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBudget = async (id) => {
  const uid = currentUid();
  await deleteDoc(await ownedDocument("budgets", id, uid));
};

export const createRecurring = async (input) => {
  const uid = currentUid();
  const frequency = requiredString(input.frequency, "Frequency", 20);
  if (!["weekly", "monthly", "quarterly", "yearly"].includes(frequency)) {
    throw new Error("Choose a supported frequency.");
  }
  const type = requiredString(input.transactionType, "Type", 20);
  if (!["income", "expense"].includes(type)) {
    throw new Error("Choose income or expense.");
  }

  const nextDate = validIsoDate(input.nextDate, "Next date");
  const endDate = input.endDate ? validIsoDate(input.endDate, "End date") : "";
  if (endDate && endDate < nextDate) throw new Error("The end date cannot be before the next date.");

  return addDoc(collectionRef("recurring"), {
    userId: uid,
    description: requiredString(input.description, "Description"),
    amount: positiveAmount(input.amount),
    currency: validCurrency(input.currency),
    category: requiredString(input.category, "Category", 60),
    transactionType: type,
    frequency,
    nextDate,
    endDate,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateRecurring = async (id, input) => {
  const uid = currentUid();
  const ref = await ownedDocument("recurring", id, uid);
  const frequency = requiredString(input.frequency, "Frequency", 20);
  const type = requiredString(input.transactionType, "Type", 20);
  if (!["weekly", "monthly", "quarterly", "yearly"].includes(frequency)) {
    throw new Error("Choose a supported frequency.");
  }
  if (!["income", "expense"].includes(type)) {
    throw new Error("Choose income or expense.");
  }
  const nextDate = validIsoDate(input.nextDate, "Next date");
  const endDate = input.endDate ? validIsoDate(input.endDate, "End date") : "";
  if (endDate && endDate < nextDate) throw new Error("The end date cannot be before the next date.");

  await updateDoc(ref, {
    description: requiredString(input.description, "Description"),
    amount: positiveAmount(input.amount),
    currency: validCurrency(input.currency),
    category: requiredString(input.category, "Category", 60),
    transactionType: type,
    frequency,
    nextDate,
    endDate,
    updatedAt: serverTimestamp(),
  });
};

export const setRecurringStatus = async (id, status) => {
  if (!["active", "paused", "completed"].includes(status)) {
    throw new Error("Choose a valid recurring status.");
  }
  const uid = currentUid();
  const ref = await ownedDocument("recurring", id, uid);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
};

export const deleteRecurring = async (id) => {
  const uid = currentUid();
  await deleteDoc(await ownedDocument("recurring", id, uid));
};
