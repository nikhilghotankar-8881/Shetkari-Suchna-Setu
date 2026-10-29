import { describe, it, expect } from "vitest";
import { getLocalizedText, getLocalizedList } from "../localized";
import { DISTRICTS, CROPS, SCHEME_CATEGORIES, getLocalizedOption } from "../constants";

describe("Localization Adapter & Constants Tests", () => {
  it("should correctly resolve dynamic content in English, Hindi, and Marathi", () => {
    const notice = {
      title: "Crop Insurance Scheme",
      titleHi: "फसल बीमा योजना",
      titleMr: "पीक विमा योजना",
    };

    expect(getLocalizedText(notice, "title", "en")).toBe("Crop Insurance Scheme");
    expect(getLocalizedText(notice, "title", "hi")).toBe("फसल बीमा योजना");
    expect(getLocalizedText(notice, "title", "mr")).toBe("पीक विमा योजना");
  });

  it("should fall back gracefully when a language is missing", () => {
    const noticeWithoutHi = {
      title: "Special Solar Subsidy",
      titleMr: "विशेष सौर पंप अनुदान",
    };

    // 'hi' falls back to 'mr', then 'en'
    expect(getLocalizedText(noticeWithoutHi, "title", "hi")).toBe("विशेष सौर पंप अनुदान");

    const englishOnly = {
      title: "Drone Subsidy 2026",
    };
    expect(getLocalizedText(englishOnly, "title", "hi")).toBe("Drone Subsidy 2026");
    expect(getLocalizedText(englishOnly, "title", "mr")).toBe("Drone Subsidy 2026");
  });

  it("should correctly resolve lists of conditions", () => {
    const item = {
      conditions: ["Rule 1", "Rule 2"],
      conditionsHi: ["नियम १", "नियम २"],
      conditionsMr: ["नियम १ (मराठी)", "नियम २ (मराठी)"],
    };

    expect(getLocalizedList(item, "conditions", "en")).toEqual(["Rule 1", "Rule 2"]);
    expect(getLocalizedList(item, "conditions", "hi")).toEqual(["नियम १", "नियम २"]);
    expect(getLocalizedList(item, "conditions", "mr")).toEqual(["नियम १ (मराठी)", "नियम २ (मराठी)"]);
  });

  it("should provide 3-language translations for all districts, crops, and categories", () => {
    DISTRICTS.forEach((d) => {
      expect(d.nameEn).toBeTruthy();
      expect(d.nameHi).toBeTruthy();
      expect(d.nameMr).toBeTruthy();
      expect(getLocalizedOption(d, "en")).toBe(d.nameEn);
      expect(getLocalizedOption(d, "hi")).toBe(d.nameHi);
      expect(getLocalizedOption(d, "mr")).toBe(d.nameMr);
    });

    CROPS.forEach((c) => {
      expect(c.nameEn).toBeTruthy();
      expect(c.nameHi).toBeTruthy();
      expect(c.nameMr).toBeTruthy();
    });

    SCHEME_CATEGORIES.forEach((sc) => {
      expect(sc.nameEn).toBeTruthy();
      expect(sc.nameHi).toBeTruthy();
      expect(sc.nameMr).toBeTruthy();
    });
  });
});

