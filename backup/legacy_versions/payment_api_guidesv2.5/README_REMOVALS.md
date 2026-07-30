# Documentation cleanup (world-class pass)

This package removes outdated / confusing sections that were no longer aligned with the current Dinaria API design.

## Files removed
- `19_customers.md`
- `21_virtual_accounts.md`
- `22_customer_balance.md`
- `23_customer_payments.md`
- `24_customer_payouts.md`
- `25_customer_deposit_details.md`
- `customer_accounts.md`

## Why they were removed
- **Virtual Accounts** were creating the wrong mental model. The current platform model is:
  **Payments → Operating Accounts (balances) → Payouts**, with optional **FX** and **Cash Withdrawals**.
- The removed **customer-* pages** described an older customer/account architecture that conflicted with the
  unified approach we agreed on:
  - **Customer** is a participant that can be provided **inline** or by **ID** for both money-in and money-out.
  - **Beneficiary** is the receiver (also inline or by ID), with **identity** fields when required for cash-out.
- Balance concepts now live under **Accounts** with clear states (**available / pending / reserved**).

## What to use instead
- Use **`31_participants.md`** for the unified model of `customer` / `customerId` and `beneficiary` / `beneficiaryId`.
- Use **`20_accounts.md`** for operating accounts, defaults, balances, and account creation (merchant-only operating).
- Use **`32_fx.md`** for FX rules (`amountType`, quote vs autoQuote).
- Use **`33_payout_flow.md`** + **`34_cash_withdrawals.md`** for money-out and cash-out.

## Notes
If you had external links pointing to the removed pages, consider adding lightweight redirect stubs later.
For now, we removed them to keep the docs focused and integration-friendly.
