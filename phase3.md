# phase3.md — Extraction + Verification

**Goal:** structured data with evidence; uncertain stuff not shown as fact.

## Tasks
- [ ] Extraction schema (Pydantic): name, dept, eligibility, benefits, documents, deadlines[], regions[], crops[], evidence quotes.
- [ ] Parser/regex pass for dates, amounts. LLM pass for rest. Version-stamp prompt + model.
- [ ] Prompt-injection guard: delimited untrusted text, no tools, schema-validated output.
- [ ] Validator rules (pipeline.md §5). Output status + reasons.
- [ ] Status machine: Pending → Auto-checked / Needs review → Verified / Rejected / Superseded.
- [ ] Rule: deadline exposed only at Verified.
- [ ] Changed-notice logic: deadline/eligibility change → forced high-priority review.
- [ ] Evaluate on fixtures: field accuracy, hallucinated-quote rate.
- [ ] Cost cap: extract only on new/changed versions.

## Deliverables
`extractions` + `verifications` filled for fixtures and live sources. Eval report (table).

## Exit criteria
- Field accuracy measured on labelled fixtures; deadline errors → 0 reach "Verified" in test (because human gate).
- Fabricated quote caught by validator (seed test).
- Injection fixture ("ignore previous instructions…") does not alter output.
- Conflicting deadlines → Needs review.

## Risks
Marathi accuracy low → more manual review; reduce scope. OCR needed → cut or limit.
