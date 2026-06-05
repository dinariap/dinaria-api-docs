
# Common Pitfalls

## Sandbox simulate — payment stays `started`

After calling a sandbox simulate endpoint, the payment should move to `confirmed` within ~15 seconds. If it does not:

- **ARS:** `customer.documentNumber` and `amount` on the simulate call must match the payment row (empty body on `/sandbox/payments/{id}/receive` does this automatically).
- **BRL:** `externalId`, `taxId`, and `amount` on `POST /trf/cashin/simulate` must match the payment you created.
- **Wrong tenant:** the API key must belong to the same account that owns the payment.

See [Sandbox: Simulate a Pay-in](19_sandbox_cashin_simulation.md).

## FX_REQUIRED
Occurs when sending cross-currency payout without quote or autoQuote.

## INSUFFICIENT_FUNDS
Ensure account has available balance.

## CUSTOMER_DATA_REQUIRED
Occurs when uiMode=advanced and required fields are missing.
