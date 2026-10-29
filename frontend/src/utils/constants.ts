export interface OptionItem {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
}

export const DISTRICTS: OptionItem[] = [
  { id: "nashik", nameEn: "Nashik", nameHi: "नासिक", nameMr: "नाशिक" },
  { id: "ahmednagar", nameEn: "Ahmednagar (Ahilyanagar)", nameHi: "अहिल्यानगर (अहमदनगर)", nameMr: "अहिल्यानगर" },
  { id: "pune", nameEn: "Pune", nameHi: "पुणे", nameMr: "पुणे" },
  { id: "satara", nameEn: "Satara", nameHi: "सतारा", nameMr: "सातारा" },
  { id: "solapur", nameEn: "Solapur", nameHi: "सोलापुर", nameMr: "सोलापूर" },
  { id: "aurangabad", nameEn: "Chhatrapati Sambhajinagar", nameHi: "छत्रपति संभाजीनगर", nameMr: "छत्रपती संभाजीनगर" },
  { id: "jalna", nameEn: "Jalna", nameHi: "जालना", nameMr: "जालना" },
  { id: "amravati", nameEn: "Amravati", nameHi: "अमरावती", nameMr: "अमरावती" },
  { id: "nagpur", nameEn: "Nagpur", nameHi: "नागपुर", nameMr: "नागपूर" },
  { id: "kolhapur", nameEn: "Kolhapur", nameHi: "कोल्हापुर", nameMr: "कोल्हापूर" },
  { id: "yavatmal", nameEn: "Yavatmal", nameHi: "यवतमाल", nameMr: "यवतमाळ" },
  { id: "nanded", nameEn: "Nanded", nameHi: "नांदेड़", nameMr: "नांदेड" },
];

export const CROPS: OptionItem[] = [
  { id: "soybean", nameEn: "Soybean", nameHi: "सोयाबीन", nameMr: "सोयाबीन" },
  { id: "cotton", nameEn: "Cotton", nameHi: "कपास", nameMr: "कापूस" },
  { id: "onion", nameEn: "Onion", nameHi: "प्याज", nameMr: "कांदा" },
  { id: "sugarcane", nameEn: "Sugarcane", nameHi: "गन्ना", nameMr: "ऊस" },
  { id: "wheat", nameEn: "Wheat", nameHi: "गेहूँ", nameMr: "गहू" },
  { id: "paddy", nameEn: "Paddy (Rice)", nameHi: "धान (चावल)", nameMr: "भात / धान" },
  { id: "pigeon_pea", nameEn: "Pigeon Pea (Tur)", nameHi: "अरहर (तूर)", nameMr: "तूर" },
  { id: "gram", nameEn: "Gram (Chana)", nameHi: "चना", nameMr: "हरभरा" },
  { id: "grapes", nameEn: "Grapes", nameHi: "अंगूर", nameMr: "द्राक्षे" },
  { id: "pomegranate", nameEn: "Pomegranate", nameHi: "अनार", nameMr: "डाळिंब" },
];

export const SCHEME_CATEGORIES: OptionItem[] = [
  { id: "all", nameEn: "All Categories", nameHi: "सभी श्रेणियाँ", nameMr: "सर्व प्रवर्ग" },
  { id: "insurance", nameEn: "Crop Insurance", nameHi: "फसल बीमा", nameMr: "पीक विमा" },
  { id: "subsidy", nameEn: "Machinery & Irrigation Subsidy", nameHi: "यंत्र एवं सिंचाई अनुदान", nameMr: "यंत्र व सिंचन अनुदान" },
  { id: "financial", nameEn: "Direct Financial Support", nameHi: "प्रत्यक्ष वित्तीय सहायता", nameMr: "थेट आर्थिक साहाय्य" },
  { id: "input", nameEn: "Seed & Fertilizer Assistance", nameHi: "बीज एवं उर्वरक सहायता", nameMr: "बियाणे व खते साहाय्य" },
];

export function getLocalizedOption(item: OptionItem, lang: string): string {
  const code = lang.split("-")[0];
  if (code === "hi") return item.nameHi || item.nameEn;
  if (code === "mr") return item.nameMr || item.nameEn;
  return item.nameEn;
}
