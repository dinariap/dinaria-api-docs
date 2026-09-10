---
title: Payment Refunds
nav_order: 5
parent: Money In
---

# Payment Refunds

Refunds return all or part of a payment. They belong to the Money In lifecycle and are tracked independently from payouts.

## Create a refund

```http
POST https://api.sandbox.dinaria.com/v2/payments/{transactionId}/refunds
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
Idempotency-Key: refund-order-1001-v1
```

```json
{
  "externalId": "REFUND-1001",
  "amount": "0.10",
  "reason": "Customer request",
  "metadata": {
    "caseId": "CASE-42"
  }
}
```

`externalId` and `amount` are required.

| HTTP | Meaning |
|---:|---|
| `201 Created` | A new refund was created and durably accepted. Processing may still be pending. |
| `200 OK` | No new refund was created. An identical request with the same `Idempotency-Key` returns the original resource and `Idempotent-Replayed: true`. |

Reusing the key with a different body returns `409 Conflict`.

## Refund resource

```json
{
  "refundId": "6c3fc750-8640-4a4f-b981-9ccfabd8f8c7",
  "transactionId": "04058d70-7d15-4459-b046-d19b6f137c37",
  "externalId": "REFUND-1001",
  "status": "pending",
  "amount": "0.10",
  "currency": "USDT",
  "reason": "Customer request",
  "creationDate": "2026-09-09T20:00:00Z",
  "metadata": {
    "caseId": "CASE-42"
  }
}
```

| Status | Meaning |
|---|---|
| `pending` | The refund was accepted and its final result is pending. |
| `succeeded` | The refund completed successfully. |
| `failed` | The refund failed; it does not increase the payment's `refundedAmount`. |

The payment resource exposes the accumulated successful `refundedAmount` and the date of the first successful refund in `refundedDate`. A fully refunded payment can move to `status: refunded`.

A payment can have multiple full or partial refund attempts. Each refund has its own `refundId`, status, and dates. `completionDate` appears when it reaches a terminal state, and `providerReference` or `failure` can appear when applicable. Use the refund list for complete history.

Binance Pay uses these same general endpoints; there is no public provider-specific refund API.

## Retrieve and list refunds

```http
GET https://api.sandbox.dinaria.com/v2/refunds/{refundId}
Authorization: Bearer <YOUR_API_KEY>
```

```http
GET https://api.sandbox.dinaria.com/v2/payments/{transactionId}/refunds
Authorization: Bearer <YOUR_API_KEY>
```

The list response has the form `{ "data": [ ... ] }` and includes every refund attempt for the payment.

## Webhook events

- `refund.created`
- `refund.status_changed`

Both use the V2 event envelope and contain the complete Refund resource in `data.object`.
