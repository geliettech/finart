const authOnlyPaths = new Set([
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/email-verify",
]);

export const getSafeReturnTo = (state, fallback = "/dashboard") => {
  const from = state?.from;
  const pathname =
    typeof from === "string" ? from : from?.pathname;
  const normalizedPath =
    typeof pathname === "string" ? pathname.replace(/\/+$/, "") || "/" : "";

  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//") ||
    pathname.includes("\\") ||
    authOnlyPaths.has(normalizedPath)
  ) {
    return fallback;
  }

  const search = typeof from === "object" && from.search ? from.search : "";
  const hash = typeof from === "object" && from.hash ? from.hash : "";

  return `${pathname}${search}${hash}`;
};
