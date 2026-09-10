---
title: Payout Flow
nav_order: 1
parent: Money Out
---

# Payout Flow

A payout starts after the account has sufficient available balance in the source currency. Prefunding is a separate process.

## 1. Prefund the account

Confirm that the available balance can cover the payout. The funding method is outside this Payouts flow.

## 2. Create the payout

Send `POST /v2/payouts` with an `Idempotency-Key`. A `201 Created` response means the payout was durably accepted for asynchronous processing; it does not mean delivery was completed. An identical replay returns `200 OK` with `Idempotent-Replayed: true`.

```text
Prefunded balance → POST /v2/payouts → processing
                                           ├── confirmed ──→ reversed
                                           ├── failed
                                           └── cancelled
```

If the request times out or its result is unclear, retry exactly the same body with the same `Idempotency-Key`. Do not submit a replacement using a new key while the original result remains unresolved.

## 3. Track the outcome

- `payout.created` is emitted after the payout is persisted, normally with `status: processing`.
- `payout.status_changed` is emitted when the public status changes.
- `GET /v2/payouts/{payoutId}` returns the canonical current state.

Webhook delivery is at least once and order is not guaranteed. Deduplicate by `eventId`, retain the highest `resourceVersion` per payout, and use the retrieve endpoint when state is ambiguous.
