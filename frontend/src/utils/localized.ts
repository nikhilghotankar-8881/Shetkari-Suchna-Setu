/**
 * Localization Adapter Utility
 * Safely resolves dynamic content from backend models according to the selected language (en, hi, mr).
 * If a field is missing in the chosen language, it falls back gracefully:
 * - for 'hi': hi -> mr -> en -> original notice fallback
 * - for 'mr': mr -> hi -> en -> original notice fallback
 * - for 'en': en -> original notice fallback
 */

export function getLocalizedText<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  lang: string,
  fallback = ""
): string {
  if (!item) return fallback;

  const code = (lang || "mr").split("-")[0].toLowerCase();

  if (code === "hi") {
    const hiVal = item[`${field}Hi`] || item[`${field}_hi`];
    if (hiVal && typeof hiVal === "string" && hiVal.trim()) return hiVal;

    const mrVal = item[`${field}Mr`] || item[`${field}_mr`];
    if (mrVal && typeof mrVal === "string" && mrVal.trim()) return mrVal;

    const baseVal = item[field] || item[`${field}En`];
    if (baseVal && typeof baseVal === "string" && baseVal.trim()) return baseVal;
  } else if (code === "mr") {
    const mrVal = item[`${field}Mr`] || item[`${field}_mr`];
    if (mrVal && typeof mrVal === "string" && mrVal.trim()) return mrVal;

    const hiVal = item[`${field}Hi`] || item[`${field}_hi`];
    if (hiVal && typeof hiVal === "string" && hiVal.trim()) return hiVal;

    const baseVal = item[field] || item[`${field}En`];
    if (baseVal && typeof baseVal === "string" && baseVal.trim()) return baseVal;
  } else {
    // English
    const enVal = item[`${field}En`] || item[field];
    if (enVal && typeof enVal === "string" && enVal.trim()) return enVal;

    const hiVal = item[`${field}Hi`];
    if (hiVal && typeof hiVal === "string" && hiVal.trim()) return hiVal;

    const mrVal = item[`${field}Mr`];
    if (mrVal && typeof mrVal === "string" && mrVal.trim()) return mrVal;
  }

  return fallback;
}

export function getLocalizedList<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  lang: string
): string[] {
  if (!item) return [];

  const code = (lang || "mr").split("-")[0].toLowerCase();

  if (code === "hi") {
    const hiList = item[`${field}Hi`] || item[`${field}_hi`];
    if (Array.isArray(hiList) && hiList.length > 0) return hiList;

    const mrList = item[`${field}Mr`] || item[`${field}_mr`];
    if (Array.isArray(mrList) && mrList.length > 0) return mrList;

    const baseList = item[field] || item[`${field}En`];
    if (Array.isArray(baseList) && baseList.length > 0) return baseList;
  } else if (code === "mr") {
    const mrList = item[`${field}Mr`] || item[`${field}_mr`];
    if (Array.isArray(mrList) && mrList.length > 0) return mrList;

    const hiList = item[`${field}Hi`] || item[`${field}_hi`];
    if (Array.isArray(hiList) && hiList.length > 0) return hiList;

    const baseList = item[field] || item[`${field}En`];
    if (Array.isArray(baseList) && baseList.length > 0) return baseList;
  } else {
    const enList = item[field] || item[`${field}En`];
    if (Array.isArray(enList) && enList.length > 0) return enList;

    const hiList = item[`${field}Hi`];
    if (Array.isArray(hiList) && hiList.length > 0) return hiList;

    const mrList = item[`${field}Mr`];
    if (Array.isArray(mrList) && mrList.length > 0) return mrList;
  }

  return [];
}
