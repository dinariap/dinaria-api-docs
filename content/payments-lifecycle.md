---
title: Payment Lifecycle
nav_order: 3
parent: Money In
---

# Payment Lifecycle

```text
started → pending → confirmed → paid
   ├──────────────→ cancelled
   ├──────────────→ expired
   └──────────────→ failed

confirmed / paid → refunded (after the full amount is successfully returned)
```

| Status | Meaning | Recommended handling |
|---|---|---|
| `started` | Awaiting payer action. | Present `actionUrl` or supported `paymentData`. |
| `pending` | Processing is underway. | Wait for a webhook; do not treat as final. |
| `confirmed` | Provider confirmed the payment. | Apply your business rule for confirmed funds. |
| `paid` | Funds are available under the financial model. | Reconcile and settle as appropriate. |
| `cancelled` | Cancelled before completion. | Stop the customer flow. |
| `expired` | Expired without completion. | Create a new payment if the customer retries. |
| `failed` | Definitive failure. | Show a safe retry path using a new order attempt. |
| `refunded` | Fully refunded. | Use Refund resources for the detailed history. |

A customer redirect is never proof of payment. Confirm state through `payment.status_changed` or `GET /v2/payments/{transactionId}`. Do not expose or depend on provider-internal states.
