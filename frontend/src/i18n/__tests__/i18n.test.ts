import { describe, it, expect } from "vitest";
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import mr from "../locales/mr.json";

function getKeys(obj: Record<string, any>, prefix = ""): string[] {
  return Object.keys(obj).reduce((res: string[], el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === "object" && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + ".")];
    }
    return [...res, prefix + el];
  }, []);
}

describe("i18n 3-Language Localisation Integrity", () => {
  const enKeys = getKeys(en);
  const hiKeys = getKeys(hi);
  const mrKeys = getKeys(mr);

  it("should have all English keys present in Hindi", () => {
    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));
    expect(missingInHi).toEqual([]);
  });

  it("should have all English keys present in Marathi", () => {
    const missingInMr = enKeys.filter((k) => !mrKeys.includes(k));
    expect(missingInMr).toEqual([]);
  });

  it("should have all Hindi keys present in English", () => {
    const missingInEn = hiKeys.filter((k) => !enKeys.includes(k));
    expect(missingInEn).toEqual([]);
  });

  it("should have all Marathi keys present in English", () => {
    const missingInEn = mrKeys.filter((k) => !enKeys.includes(k));
    expect(missingInEn).toEqual([]);
  });

  it("should verify mandatory terminology mappings from specifications", () => {
    // English
    expect(en.nav.home).toBe("Home");
    expect(en.nav.alerts).toBe("My Alerts");
    expect(en.nav.notices).toBe("All Notices");
    expect(en.nav.profile).toBe("Preferences");
    expect(en.home.browseNotices).toBe("Browse All Notices");
    expect(en.status.verified).toBe("Verified");
    expect(en.status.pending_review).toBe("Pending Review");
    expect(en.common.loading).toBe("Loading…");
    expect(en.common.emptyNoticesTitle).toBe("No Notices Found");
    expect(en.common.errorTitle).toBe("Something Went Wrong");

    // Hindi
    expect(hi.nav.home).toBe("मुखपृष्ठ");
    expect(hi.nav.alerts).toBe("मेरी सूचनाएँ");
    expect(hi.nav.notices).toBe("सभी सूचनाएँ");
    expect(hi.nav.profile).toBe("प्राथमिकताएँ");
    expect(hi.home.browseNotices).toBe("सभी सूचनाएँ देखें");
    expect(hi.status.verified).toBe("सत्यापित");
    expect(hi.status.pending_review).toBe("समीक्षा लंबित");
    expect(hi.common.loading).toBe("लोड हो रहा है…");
    expect(hi.common.emptyNoticesTitle).toBe("कोई सूचना नहीं मिली");
    expect(hi.common.errorTitle).toBe("कुछ गलत हुआ");

    // Marathi
    expect(mr.nav.home).toBe("मुख्यपृष्ठ");
    expect(mr.nav.alerts).toBe("माझ्या सूचना");
    expect(mr.nav.notices).toBe("सर्व सूचना");
    expect(mr.nav.profile).toBe("पसंती");
    expect(mr.home.browseNotices).toBe("सर्व सूचना पाहा");
    expect(mr.status.verified).toBe("सत्यापित");
    expect(mr.status.pending_review).toBe("पुनरावलोकन प्रलंबित");
    expect(mr.common.loading).toBe("लोड होत आहे…");
    expect(mr.common.emptyNoticesTitle).toBe("कोणतीही सूचना आढळली नाही");
    expect(mr.common.errorTitle).toBe("काहीतरी चूक झाली");
  });

  it("should not contain mixed-language bilingual slashes in navigation or key headings", () => {
    expect(en.home.howItWorksTitle).not.toContain("/");
    expect(hi.home.howItWorksTitle).not.toContain("/");
    expect(mr.home.howItWorksTitle).not.toContain("/");

    expect(en.prefs.nameLabel).not.toContain("/");
    expect(hi.prefs.nameLabel).not.toContain("/");
    expect(mr.prefs.nameLabel).not.toContain("/");
  });
});

