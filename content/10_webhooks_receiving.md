---
title: Receiving
nav_order: 12
parent: Webhooks
---

# Receiving webhook events

Our platform sends HTTP `POST` requests to your server whenever a payment or payout changes status.

---

## Your endpoint

```
POST <your-registered-webhook-url>
```

---

## Verification flow

1. Read raw request body
2. Validate `X-Webhook-Timestamp` (reject if older than ±5 minutes)
3. Verify `X-Webhook-Signature`
4. Parse JSON payload
5. Deduplicate by `eventId`
6. Process asynchronously
7. Respond HTTP `200`

---

## Payload — payment status changed

### Brazil (BRL)

```json
{
  "eventType": "payment.status_changed",
  "eventId": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "merchantId": "my_merchant_1",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "100.00",
  "currency": "BRL",
  "receivedAmount": "100.00",
  "confirmationDate": "2026-01-16T18:05:00Z",
  "customer": {
    "name": "João Silva",
    "documentNumber": "12345678901"
  },
  "metadata": {
    "orderId": "ORD-1001"
  }
}
```

### Argentina (ARS)

```json
{
  "eventType": "payment.status_changed",
  "eventId": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "merchantId": "my_merchant_1",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "1500.00",
  "currency": "ARS",
  "confirmationDate": "2026-01-16T18:05:00Z",
  "metadata": {
    "orderId": "ORD-1001"
  }
}
```

---

## Payload — payout status changed

```json
{
  "eventType": "payout.status_changed",
  "eventId": "b2c3d4e5-f6a7-8901-bcde-f01234567890",
  "payoutId": "1078d6c2-a452-44fb-94f4-525390231ce2",
  "merchantId": "my_merchant_1",
  "externalId": "PO-2001",
  "status": "completed",
  "amount": "150.00",
  "currency": "BRL",
  "bankSystemTrxId": "f4e3d2c1-b0a9-8765-4321-fedcba987654"
}
```

---

## Key fields

| Field | Description |
|-------|-------------|
| `eventType` | `payment.status_changed` or `payout.status_changed` |
| `eventId` | Unique per delivery — use to deduplicate |
| `transactionId` / `payoutId` | Platform identifier — use to look up the record |
| `status` | `confirmed`, `cancelled`, `expired` (payments) · `completed`, `failed` (payouts) |
| `externalId` | Your reference, if provided at creation |
| `receivedAmount` | Actual amount received (BRL payments, may differ from `amount` in over/under scenarios) |
| `confirmationDate` | ISO 8601 timestamp, present when `status = confirmed` |
| `bankSystemTrxId` | Provider transaction reference, when available |
| `metadata` | Key-value pairs you sent at creation, returned as-is |
| `customer` | Customer object, when provided at creation |

---

## Best practices

- Always verify the signature before processing — see [Webhooks Security](13_webhooks_security.md).
- Return HTTP `200` immediately. Process the event asynchronously.
- Deduplicate by `eventId` — webhooks are delivered **at least once**.
- Poll `GET /payments/{id}` or `GET /payouts/{id}` as a fallback for missed events.
