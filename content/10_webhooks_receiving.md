---
title: Receiving
nav_order: 12
parent: Webhooks
---

# Receiving webhook events

Our platform sends HTTP `POST` requests to your server whenever a payment or payout changes status.

---

## Your endpoint (on your server)

```
POST <your-registered-webhook-url>
```

---

## Verification flow

1. Read raw request body
2. Validate `X-Webhook-Timestamp`
3. Verify `X-Webhook-Signature`
4. Parse JSON payload
5. Process asynchronously
6. Respond HTTP `200`

---

## Payload — payment confirmed

<div class="country-ar">

### Argentina (ARS)

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "1500.00",
  "currency": "ARS",
  "metadata": {
    "orderId": "ORD-1001"
  }
}
```

</div>

<div class="country-br">

### Brasil (BRL)

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "100.00",
  "currency": "BRL",
  "metadata": {
    "orderId": "ORD-1001"
  }
}
```

</div>

---

## Payload — payout completed

<div class="country-ar">

### Argentina (ARS)

```json
{
  "payoutId": "1078d6c2-a452-44fb-94f4-525390231ce2",
  "externalId": "PO-2001",
  "status": "completed",
  "amount": "1500.00",
  "currency": "ARS",
  "bankSystemTrxId": "3D5W612E65ZJKDJW2GXYVR"
}
```

</div>

<div class="country-br">

### Brasil (BRL)

```json
{
  "payoutId": "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  "externalId": "PO-2001",
  "status": "completed",
  "amount": "150.00",
  "currency": "BRL",
  "bankSystemTrxId": "f4e3d2c1-b0a9-8765-4321-fedcba987654"
}
```

</div>

---

## Key fields

| Field | Description |
|-------|-------------|
| `transactionId` / `payoutId` | Platform identifier — use to look up the record. |
| `externalId` | Your reference, if provided at creation. |
| `status` | `confirmed`, `cancelled`, `expired` (payments) · `completed`, `failed` (payouts) |
| `metadata` | Key-value pairs you sent at creation, returned as-is. |

---

## Best practices

- Always verify the signature before processing — see [Webhooks Security](#13_webhooks_security.md).
- Return HTTP `200` immediately. Process the event asynchronously.
- Use `transactionId` / `payoutId` to deduplicate — webhooks are delivered **at least once**.
