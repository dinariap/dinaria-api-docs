
# Common Pitfalls

## Sandbox simulate — payment stays `started`

After calling a sandbox simulate endpoint, the payment should move to `confirmed` within ~15 seconds. If it does not, check the matching fields for your country (use the 🇦🇷 / 🇧🇷 filter in the top bar on the simulate guide).

<div class="country-ar">

- `customer.documentNumber` and `amount` must match the payment row.
- On `POST /sandbox/payments/{id}/receive`, an empty body `{}` sets both automatically.

</div>

<div class="country-br">

- `externalId`, `taxId`, and `amount` on `POST /trf/cashin/simulate` must match the payment you created.
- Do not use `POST /sandbox/payments/{id}/receive` for BRL — it returns `501`.

</div>

Also verify the API key belongs to the same account that owns the payment.

See [Sandbox: Simulate a Pay-in](19_sandbox_cashin_simulation.md).

## FX_REQUIRED
Occurs when sending cross-currency payout without quote or autoQuote.

## INSUFFICIENT_FUNDS
Ensure account has available balance.

## CUSTOMER_DATA_REQUIRED
Occurs when uiMode=advanced and required fields are missing.
