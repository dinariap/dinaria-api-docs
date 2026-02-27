# Dinaria API Docs — Context & Rules

## Scope model

- **Chips** (Argentina / Brazil) are the **only** way to change scope.
- Clicking a nav tree link **never** changes scope.
- Scope is derived from the URL on page load:
  - `/brazil/*` → scope = Brazil
  - Everything else → scope = Argentina
- Default scope = **Argentina**.

## Page classification

When making changes, check the table below.
- **🇦🇷 Argentina** — only update the Argentina file.
- **🇧🇷 Brazil** — only update the Brazil file.
- **🌐 Common** — **ask the user** whether to update both trees before doing so. If confirmed, update both.

| File | Title | Scope |
|------|-------|-------|
| `index.md` | Home | 🇦🇷 Argentina |
| `brazil/index.md` | Brazil (landing) | 🇧🇷 Brazil |
| `brazil/00_overview.md` | Overview | 🇧🇷 Brazil |
| `brazil/01_getting_started.md` | Getting Started | 🇧🇷 Brazil |
| `brazil/02_quickstart.md` | Quickstart | 🇧🇷 Brazil |
| `brazil/03_payment_lifecycle.md` | Payment Lifecycle States | 🇧🇷 Brazil |
| `brazil/05_payments_create.md` | Create Payments | 🇧🇷 Brazil |
| `brazil/07_payments_retrieve.md` | Retrieve Payments | 🇧🇷 Brazil |
| `brazil/13_data_formats.md` | Data Formats | 🇧🇷 Brazil |
| `brazil/08_payouts_overview.md` | Payout Overview | 🇧🇷 Brazil |
| `brazil/09_payouts_create.md` | Create a Payout | 🇧🇷 Brazil |
| `brazil/10_payouts_retrieve.md` | Retrieve & List Payouts | 🇧🇷 Brazil |
| `brazil/11_customers.md` | Customers | 🇧🇷 Brazil |
| `brazil/12_accounts.md` | Accounts & Balance | 🌐 Common (BRL examples) |
| `payment_api_guidesv1.0/00_overview.md` | Overview | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/01_getting_started.md` | Getting Started | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/02_quickstart_first_payment.md` | Quickstart | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/03_payment_lifecycle_states.md` | Payment Lifecycle States | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/04_payments_overview.md` | Payments Overview | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/05_payments_create.md` | Create Payments | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/06_payments_redirect_flow.md` | Redirect Flow | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/07_payments_retrieve.md` | Retrieve a Payment | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/13_data_formats_iso.md` | Data Formats (CBU / CVU) | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/15_step_by_step_payment_example.md` | Step-by-Step Example | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/tools.md` | Merchant Tools (Sandbox) | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/index.md` | Guides (parent) | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/16_payouts_overview.md` | Payout Overview | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/17_payouts_create.md` | Create a Payout | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/18_payouts_retrieve.md` | Retrieve & List Payouts | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/19_customers.md` | Customers | 🇦🇷 Argentina |
| `payment_api_guidesv1.0/20_accounts.md` | Accounts & Balance | 🌐 Common (ARS examples) |
| `payment_api_guidesv1.0/webhooks.md` | Webhooks (parent) | 🌐 Common |
| `payment_api_guidesv1.0/08_webhooks_overview.md` | Webhooks Overview | 🌐 Common |
| `payment_api_guidesv1.0/09_webhooks_registration.md` | Webhook Registration | 🌐 Common |
| `payment_api_guidesv1.0/10_webhooks_receiving.md` | Receiving Webhooks | 🌐 Common |
| `payment_api_guidesv1.0/11_rotate-webhook-secret.md` | Rotate Secret | 🌐 Common |
| `payment_api_guidesv1.0/11_webhooks_best_practices.md` | Webhook Best Practices | 🌐 Common |
| `payment_api_guidesv1.0/13_webhooks_security.md` | Webhook Security | 🌐 Common |
| `payment_api_guidesv1.0/webkhooks-vexamples.md` | Verification Examples | 🌐 Common |
| `payment_api_guidesv1.0/12_errors_and_retries.md` | Errors and Retries | 🌐 Common |
| `payment_api_guidesv1.0/14_payment_best_practices.md` | Payment Best Practices | 🌐 Common |

## ⚠️ IMPORTANT — Scope rule for new pages

**ALWAYS create BOTH an Argentina version AND a Brazil version of every new feature page.**
- Argentina pages live in `payment_api_guidesv1.0/` and use: ARS, CBU/CVU, CUIT, Coinag rail.
- Brazil pages live in `brazil/` and use: BRL, PIX keys (CPF/CNPJ/phone/email/random), CPF/CNPJ.
- Never write a payout, customer, or virtual account page for one scope only.
- Even if a feature is not yet live in one country, document it (use correct local terminology).
- Scope-specific fields differ: Argentina uses `destinationCbu`/`destinationCuit`; Brazil uses PIX `destination.accountNumber` + `rail: PIX`.

## Rules for updates

1. **Before editing**, check the table above.
2. If the page is **Common**: ask the user "This is a common page — should I update both Argentina and Brazil?" before proceeding.
3. If confirmed common update: edit the Argentina file AND create/update the equivalent Brazil file.
4. If the page is **Argentina or Brazil only**: update only the relevant file.
5. **New pages**: ask the user whether it's Argentina, Brazil, or Common before creating. Default: create both.
6. Classification evolves over time — update this table when a page's scope is clarified.
7. **Accounts & Balance** (`/accounts`, `/accounts/{id}/balance`) are 🌐 Common — the concept and endpoints are identical; only the currency in examples differs (ARS vs BRL). Always keep both files in sync.
8. **Customer ↔ Merchant relationship**: `merchant_id` belongs on the **payment** or **payout** record, NOT as an ownership field on the customer. A customer is platform-wide and can interact with any merchant. The `lastMerchantId` field on a customer is purely **indicatory** — it reflects the merchant from the most recent operation, not ownership.

## Tech notes

- Jekyll + Just the Docs (remote theme), GitHub Pages
- Scope chips rendered via `_includes/nav_footer_custom.html`
- Scope detection + nav filtering in `_includes/head_custom.html`
- Nav filtering uses CSS `:has()` + `data-scope` attribute on `<html>`
- Argentina chip → `/` | Brazil chip → `/brazil/`
- Custom CSS in `assets/css/custom.scss`
