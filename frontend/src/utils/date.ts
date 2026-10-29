export function formatDate(iso: string | null | undefined, lang: string): string {
  if (!iso) return "—";
  try {
    const code = lang.split("-")[0];
    const locale = code === "mr" ? "mr-IN" : code === "hi" ? "hi-IN" : "en-IN";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string | null | undefined, lang: string): string {
  if (!iso) return "—";
  try {
    const code = lang.split("-")[0];
    const locale = code === "mr" ? "mr-IN" : code === "hi" ? "hi-IN" : "en-IN";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function daysRemaining(isoDate: string | null | undefined): number | null {
  if (!isoDate) return null;
  const deadline = new Date(isoDate).getTime();
  const now = new Date().getTime();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diffDays;
}
