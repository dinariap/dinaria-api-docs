---
title: Payout Flow
nav_order: 1
parent: Money Out
---

# Payout Flow

A payout follows a simple lifecycle that starts once the account has sufficient available balance for the source currency.

## Typical flow

```text
1. Prefund account
   ↓
2. Check available balance
   ↓
3. Optionally request a quote
   ↓
4. Create payout
   ↓
5. Payout enters processing
   ↓
6. Receive status update
   ↓
7. Payout completes or fails
```

### What happens at each step

1. The account must have available balance in the source currency before a payout can be created.
2. The payer or merchant can inspect the balance before sending funds.
3. If the corridor supports it, an indicative quote can be requested before creating the payout.
4. The client creates the payout with the beneficiary, destination, and rail.
5. The API validates the request and begins processing.
6. The result is communicated through webhook updates.
7. The client can also retrieve the payout by ID if it needs a fallback check.

## Rate quote API

For corridors that support conversion, you can call the rates endpoint before creating the payout to obtain an indicative quote for the selected amount and currencies.

```http
GET /payouts/rates?fromCurrency=USDT&toCurrency=VES&amount=25.00
Authorization: Bearer <API_KEY>
```

The response includes the indicative exchange rate, the estimated destination amount, and the fee components used for the quote. This value is informative and should be treated as a preview, while the final values are returned when the payout is created.

> Use the rate quote as an optional preflight step. The payout creation request remains the source of truth for the final operation.

## Lifecycle summary

- `pending`: the payout was accepted and is waiting to be processed.
- `processing`: the payout is being handled by the payout rail.
- `completed`: the payout was delivered successfully.
- `failed`: the payout could not be completed.

See [Payouts Overview](payouts-overview.md) for a broader explanation of the payout model and the supported concepts.
