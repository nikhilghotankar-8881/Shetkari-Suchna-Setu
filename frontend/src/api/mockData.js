// Realistic Mock Data for Shetkari Suchna Setu based on official Maharashtra Schemes

export const MOCK_SCHEMES = [
  {
    id: 1,
    name_mr: "महाडीबीटी कृषी यांत्रिकीकरण योजना (ट्रॅक्टर व कृषी अवजारे अनुदान)",
    name_en: "MahaDBT Farm Mechanization Scheme (Tractor & Implements Subsidy)",
    department_mr: "कृषी विभाग, महाराष्ट्र शासन",
    department_en: "Department of Agriculture, Govt of Maharashtra",
    districts: [], // Statewide
    crops: [], // All crops
    eligibility_mr: "महाराष्ट्रातील शेतकरी, अनुसूचित जाती/जमाती व महिला शेतकऱ्यांना प्राधान्य. ७/१२ व ८-अ उतारा आवश्यक.",
    eligibility_en: "Farmers across Maharashtra. Priority to SC/ST and women farmers. Valid 7/12 & 8-A land record required.",
    benefits_mr: "ट्रॅक्टर व इतर अवजारांसाठी ५०% पर्यंत किंवा कमाल ₹१,२५,०००/- पर्यंत थेट अनुदान.",
    benefits_en: "Up to 50% subsidy or maximum ₹1,25,000 direct bank transfer on tractors and farm equipment.",
    documents_mr: "७/१२ उतारा, ८-अ, आधार कार्ड, बँक पासबुक, अवजारांचे कोटेशन.",
    documents_en: "7/12 extract, 8-A, Aadhaar card, Bank passbook, Implements quotation.",
    deadline: "2026-11-30", // VERIFIED date
    verification_status: "Verified",
    official_url: "https://mahadbt.maharashtra.gov.in/Farmer/SchemeData/SchemeData?param=Y",
    source_url: "https://krishi.maharashtra.gov.in/schemes/mechanization-2026.pdf",
    last_verified_at: "2026-10-25T10:30:00Z",
    evidence_quote: "सदर योजनेअंतर्गत अर्ज सादर करण्याची अंतिम मुदत ३० नोव्हेंबर २०२६ पर्यंत वाढविण्यात येत आहे."
  },
  {
    id: 2,
    name_mr: "भाऊसाहेब फुंडकर फळबाग लागवड योजना २०२६",
    name_en: "Bhausaheb Fundkar Horticulture Plantation Scheme 2026",
    department_mr: "फलोत्पादन विभाग, महाराष्ट्र शासन",
    department_en: "Horticulture Department, Govt of Maharashtra",
    districts: ["pune", "nashik", "chhatrapati_sambhajinagar", "solapur", "jalgaon", "amravati"],
    crops: ["grapes", "pomegranate", "banana", "mango"],
    eligibility_mr: "किमान ०.२० हेक्टर ते कमाल ६ हेक्टरपर्यंत शेतजमीन असलेले फळबाग उत्पादक शेतकरी.",
    eligibility_en: "Horticulture farmers owning between 0.20 hectare to 6 hectares of land.",
    benefits_mr: "पहिल्या वर्षी ५०%, दुसऱ्या वर्षी ३०% आणि तिसऱ्या वर्षी २०% असे १००% अनुदान टप्प्याटप्प्याने.",
    benefits_en: "100% staggered subsidy: 50% year 1, 30% year 2, and 20% year 3.",
    documents_mr: "जमीन महसूल पावती, ७/१२, हमीपत्र, पाणी उपलब्धतेचा दाखला.",
    documents_en: "Land revenue receipt, 7/12, Undertaking, Water availability certificate.",
    deadline: null, // AUTO-CHECKED: NO DEADLINE RENDERED PER DESIGN.MD
    verification_status: "Auto-checked",
    official_url: "https://krishi.maharashtra.gov.in/horticulture",
    source_url: "https://krishi.maharashtra.gov.in/gr/fundkar-scheme-revised.pdf",
    last_verified_at: "2026-10-27T14:15:00Z",
    evidence_quote: "लाभार्थी निवडीचे सुधारित निकष लागू करण्यात येत आहेत."
  },
  {
    id: 3,
    name_mr: "डॉ. पंजाबराव देशमुख जैविक शेती मिशन (सेंद्रिय शेती प्रोत्साहन)",
    name_en: "Dr. Panjabrao Deshmukh Organic Farming Mission",
    department_mr: "कृषी विभाग, महाराष्ट्र शासन",
    department_en: "Agriculture Department, Govt of Maharashtra",
    districts: ["yavatmal", "amravati", "buldhana", "akola", "washim", "wardha"],
    crops: ["cotton", "soybean", "tur", "gram"],
    eligibility_mr: "विदर्भातील शेतकरी गट व सेंद्रिय शेती करणारे वैयक्तिक शेतकरी.",
    eligibility_en: "Farmer Producer Groups and individual farmers adopting organic practices in Vidarbha.",
    benefits_mr: "सेंद्रिय खते, जीवामृत युनिट व प्रमाणीकरणासाठी प्रति हेक्टर ₹२५,००० सहाय्य.",
    benefits_en: "Assistance of ₹25,000 per hectare for bio-fertilizers, Jeevamrut units & certification.",
    documents_mr: "७/१२, गट नोंदणी प्रमाणपत्र, बँक तपशील.",
    documents_en: "7/12 extract, Group registration certificate, Bank details.",
    deadline: "2026-12-15",
    verification_status: "Verified",
    official_url: "https://krishi.maharashtra.gov.in/organic-mission",
    source_url: "https://krishi.maharashtra.gov.in/gr/dr-pdkv-organic-2026.pdf",
    last_verified_at: "2026-10-26T09:00:00Z",
    evidence_quote: "गट नोंदणी व अर्ज दाखल करण्याची अंतिम तारीख १५ डिसेंबर २०२६ आहे."
  },
  {
    id: 4,
    name_mr: "कांदा चाळ उभारणी अनुदान योजना (राष्ट्रीय कृषी विकास योजना)",
    name_en: "Onion Storage Structure Subsidy Scheme (RKVY)",
    department_mr: "महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB)",
    department_en: "Maharashtra State Agricultural Marketing Board",
    districts: ["nashik", "pune", "ahmednagar", "chhatrapati_sambhajinagar", "solapur"],
    crops: ["onion"],
    eligibility_mr: "कांदा उत्पादक शेतकरी. स्वतःच्या मालकीची जागा व कांदा लागवडीचा ७/१२ वर पेरा नोंद आवश्यक.",
    eligibility_en: "Onion growing farmers with land ownership and onion crop recorded on 7/12.",
    benefits_mr: "२५ मेट्रिक टन कांदा चाळीसाठी कमाल ₹८७,५००/- (५०% अनुदान).",
    benefits_en: "50% capital subsidy up to ₹87,500 for standard 25 MT scientific onion storage.",
    documents_mr: "७/१२, ८-अ, चाळ बांधकामाचा आराखडा, सक्षम अभियंत्याचे मूल्यांकन.",
    documents_en: "7/12, 8-A, Storage blueprint, Valuation from certified engineer.",
    deadline: null,
    verification_status: "Auto-checked",
    official_url: "https://www.msamb.com/schemes/onion-storage",
    source_url: "https://www.msamb.com/circulars/onion-storage-notice-2026.html",
    last_verified_at: "2026-10-28T08:00:00Z",
    evidence_quote: "अर्ज महाडीबीटी पोर्टलवर ऑनलाईन स्वीकारले जात आहेत."
  },
  {
    id: 5,
    name_mr: "मागेल त्याला शेततळे योजना (सुधारित अनुदान निकष)",
    name_en: "Magel Tyala Shettale (Farm Pond On Demand Scheme)",
    department_mr: "मृद व जलसंधारण विभाग, महाराष्ट्र शासन",
    department_en: "Department of Soil & Water Conservation",
    districts: [],
    crops: [],
    eligibility_mr: "किमान ०.६० हेक्टर जमीन असणारा शेतकरी, यापूर्वी शेततळ्याचा लाभ घेतलेला नसावा.",
    eligibility_en: "Farmers owning at least 0.60 hectare who haven't previously availed farm pond subsidy.",
    benefits_mr: "शेततळे खोदकाम व प्लास्टिक अस्तरीकरणासाठी ₹७५,०००/- पर्यंत थेट अनुदान.",
    benefits_en: "Direct financial grant up to ₹75,000 for pond excavation and plastic lining.",
    documents_mr: "७/१२, ८-अ, शेततळे स्थळ नकाशा, बँक पासबुक.",
    documents_en: "7/12, 8-A, Farm pond site map, Bank passbook.",
    deadline: "2026-12-31",
    verification_status: "Verified",
    official_url: "https://mahadbt.maharashtra.gov.in",
    source_url: "https://waterconservation.maharashtra.gov.in/gr/shettale-subsidy-2026.pdf",
    last_verified_at: "2026-10-24T12:00:00Z",
    evidence_quote: "३१ डिसेंबर २०२६ पर्यंत प्राप्त अर्जांना प्राधान्य क्रमाने मंजुरी देण्यात येईल."
  }
];

export const MOCK_UPDATES = [
  {
    id: 101,
    type: "CHANGED",
    title_mr: "महाडीबीटी ट्रॅक्टर अनुदान: मुदत व अनुदान रकमेत सुधारणा",
    title_en: "MahaDBT Tractor Subsidy: Deadline & Cap Revised",
    scheme_id: 1,
    changed_at: "2026-10-25T10:30:00Z",
    diff: {
      field_mr: "अर्ज मुदत व अनुदान",
      field_en: "Application Deadline & Subsidy Cap",
      old_val_mr: "मुदत: १५ ऑक्टोबर २०२६ | अनुदान कमाल: ₹१,००,०००",
      old_val_en: "Deadline: 15 Oct 2026 | Cap: ₹1,00,000",
      new_val_mr: "मुदत: ३० नोव्हेंबर २०२६ | अनुदान कमाल: ₹१,२५,०००",
      new_val_en: "Deadline: 30 Nov 2026 | Cap: ₹1,25,000"
    },
    source_url: "https://krishi.maharashtra.gov.in/schemes/mechanization-2026.pdf"
  },
  {
    id: 102,
    type: "NEW",
    title_mr: "नवीन शासन निर्णय: भाऊसाहेब फुंडकर फळबाग लागवड २०२६ प्रसिद्ध",
    title_en: "New GR Detected: Bhausaheb Fundkar Horticulture Scheme 2026",
    scheme_id: 2,
    changed_at: "2026-10-27T14:15:00Z",
    diff: null,
    source_url: "https://krishi.maharashtra.gov.in/gr/fundkar-scheme-revised.pdf"
  },
  {
    id: 103,
    type: "DEADLINE_VERIFIED",
    title_mr: "पडताळणी पूर्ण: सेंद्रिय शेती मिशन अंतिम मुदत १५ डिसेंबर निश्चित",
    title_en: "Deadline Verified: Organic Farming Mission confirmed for 15 Dec 2026",
    scheme_id: 3,
    changed_at: "2026-10-26T09:00:00Z",
    diff: null,
    source_url: "https://krishi.maharashtra.gov.in/gr/dr-pdkv-organic-2026.pdf"
  }
];

export const MOCK_ALERTS = [
  {
    id: 201,
    kind: "CHANGED",
    title_mr: "महत्त्वाची सुधारणा: ट्रॅक्टर अनुदानाची मुदत ३० नोव्हेंबरपर्यंत वाढवली",
    title_en: "Important Update: Tractor Subsidy Deadline extended to 30 Nov",
    body_mr: "शासन निर्णयानुसार ट्रॅक्टर अनुदानासाठी ३० नोव्हेंबर २०२६ पर्यंत अर्ज करता येतील.",
    body_en: "As per official GR, applications for tractor subsidy are open till 30 Nov 2026.",
    scheme_id: 1,
    created_at: "2026-10-25T11:00:00Z",
    read: false
  },
  {
    id: 202,
    kind: "NEW",
    title_mr: "तुमच्या पिकासाठी नवीन योजना: फळबाग लागवड अनुदान २०२६",
    title_en: "New Scheme for your crops: Fruit Plantation Subsidy 2026",
    body_mr: "द्राक्ष व डाळिंब लागवडीसाठी १००% अनुदान योजना जाहीर झाली आहे.",
    body_en: "100% staggered subsidy scheme announced for grapes and pomegranate crops.",
    scheme_id: 2,
    created_at: "2026-10-27T15:00:00Z",
    read: false
  }
];

export const MOCK_SOURCES = [
  {
    id: 1,
    name: "Maharashtra Krishi Vibhag GR Portal",
    url: "https://krishi.maharashtra.gov.in/gr-listing",
    kind: "html",
    mode: "auto",
    poll_minutes: 360,
    last_checked_at: "2026-10-28T14:00:00Z",
    last_changed_at: "2026-10-25T10:30:00Z",
    health: "green",
    robots_ok: true
  },
  {
    id: 2,
    name: "MahaDBT Farmer Portal Circulars",
    url: "https://mahadbt.maharashtra.gov.in/notices.pdf",
    kind: "pdf",
    mode: "auto",
    poll_minutes: 180,
    last_checked_at: "2026-10-28T15:10:00Z",
    last_changed_at: "2026-10-27T14:15:00Z",
    health: "green",
    robots_ok: true
  },
  {
    id: 3,
    name: "MSAMB Onion Market Board Circulars",
    url: "https://www.msamb.com/circulars",
    kind: "html",
    mode: "manual",
    poll_minutes: 720,
    last_checked_at: "2026-10-28T08:00:00Z",
    last_changed_at: "2026-10-28T08:00:00Z",
    health: "green",
    robots_ok: true
  },
  {
    id: 4,
    name: "PMFBY Maharashtra State Portal",
    url: "https://pmfby.gov.in/state-notices/maharashtra",
    kind: "rss",
    mode: "auto",
    poll_minutes: 120,
    last_checked_at: "2026-10-28T15:30:00Z",
    last_changed_at: "2026-10-20T11:00:00Z",
    health: "green",
    robots_ok: true
  }
];

export const MOCK_REVIEW_QUEUE = [
  {
    id: 301,
    notice_title: "भाऊसाहेब फुंडकर फळबाग लागवड योजना सुधारित निकष २०२६",
    source_name: "Maharashtra Krishi Vibhag GR Portal",
    change_type: "new",
    priority: "high",
    evidence_span: "फळबाग लागवड करणाऱ्या शेतकऱ्यांसाठी सुधारित अनुदान निकष खालीलप्रमाणे लागू करण्यात येत आहेत. पहिल्या वर्षी ५०% अनुदान देण्यात येईल.",
    extracted_fields: {
      name: "भाऊसाहेब फुंडकर फळबाग लागवड योजना २०२६",
      department: "कृषी विभाग, महाराष्ट्र शासन",
      eligibility: "०.२० हेक्टर ते ६ हेक्टर जमीन असलेले फळबाग उत्पादक",
      benefits: "१००% अनुदान (टप्प्याटप्प्याने ५०%, ३०%, २०%)",
      deadline: "2026-11-20" // UNVERIFIED in extraction, needs human approval
    },
    rule_results: {
      quote_verbatim: true,
      dates_sane: true,
      region_valid: true
    },
    status: "Auto-checked"
  }
];

export const MOCK_AUDIT_LOG = [
  {
    id: 401,
    actor: "reviewer_1@shetkari.gov.in",
    action: "APPROVE_EXTRACTION",
    target: "Notice #101 (MahaDBT Tractor Subsidy)",
    timestamp: "2026-10-25T10:45:00Z"
  },
  {
    id: 402,
    actor: "admin_super@shetkari.gov.in",
    action: "PUBLISH_ALERT",
    target: "Alert #201 sent to 1,420 matched profiles",
    timestamp: "2026-10-25T11:00:00Z"
  },
  {
    id: 403,
    actor: "reviewer_2@shetkari.gov.in",
    action: "STATUS_CHANGE",
    target: "Notice #103 marked as DEADLINE_VERIFIED",
    timestamp: "2026-10-26T09:15:00Z"
  }
];

