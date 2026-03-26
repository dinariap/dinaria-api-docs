---
title: Webhook Event Types
nav_order: 20
parent: Webhooks
---

# Webhook event types

Every webhook delivery includes an `eventType` field. Route your handler logic on this field and deduplicate by `eventId`.

## Payment events

| Event type | Triggered when |
|------------|----------------|
| `payment.status_changed` | A payment transitions to `confirmed`, `cancelled`, or `expired` |

## Payout events

| Event type | Triggered when |
|------------|----------------|
| `payout.status_changed` | A payout transitions to `completed` or `failed` |

---

## Envelope fields (all events)

| Field | Always present | Description |
|-------|----------------|-------------|
| `eventType` | ✅ | One of the values above |
| `eventId` | ✅ | Unique per delivery — use for deduplication |
| `status` | ✅ | Current status of the resource |
| `amount` | ✅ | Resource amount |
| `currency` | ✅ | ISO 4217 currency code |
| `transactionId` | Payment only | Payment platform ID |
| `payoutId` | Payout only | Payout platform ID |
| `merchantId` | ✅ | Merchant that owns the resource |
| `externalId` | When provided | Your reference from creation |
| `confirmationDate` | When confirmed | ISO 8601 timestamp |
| `receivedAmount` | BRL payments | Actual received amount |
| `bankSystemTrxId` | When available | Provider transaction reference |
| `customer` | When provided | Customer object from creation |
| `metadata` | When provided | Your metadata from creation |
| `errorMessage` | Failed payouts | Failure reason |
