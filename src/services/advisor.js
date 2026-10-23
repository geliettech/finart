import { auth } from "@/services/firebase";

const endpoint = import.meta.env.VITE_FINART_ADVISOR_ENDPOINT;

export const isAdvisorConfigured = Boolean(endpoint);

export const askFinancialAdvisor = async (question) => {
  if (!endpoint) {
    throw new Error("The secure FINART advisor service is not configured.");
  }

  const parsedEndpoint = new URL(endpoint, window.location.origin);
  if (parsedEndpoint.origin !== window.location.origin) {
    throw new Error("The advisor endpoint must be hosted on this application origin.");
  }

  const user = auth.currentUser;
  if (!user?.emailVerified) {
    throw new Error("Sign in with a verified account to use the advisor.");
  }

  const token = await user.getIdToken();
  const response = await fetch(parsedEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question: question.trim() }),
  });

  if (!response.ok) {
    throw new Error("The advisor service is unavailable. Try again later.");
  }

  const result = await response.json();
  if (typeof result.answer !== "string" || !result.answer.trim()) {
    throw new Error("The advisor returned an invalid response.");
  }

  return result.answer.trim();
};
