---
title: Overview
nav_order: 10
parent: Webhooks
---

# Webhooks

Webhooks deliver asynchronous notifications when the status of a payment or payout changes.

They are the most reliable way to track payment completion.

> Webhooks are delivered **at least once**. Your integration must be idempotent — use `eventId` to deduplicate.

## Two webhook concepts

1. **Registration (configuration)**: called by you once to register your URL.
2. **Delivery (events)**: called by our platform to notify you of status changes.

## Reliability

Webhook delivery is backed by a persistent outbox. If your server is unreachable, events are retried automatically:

| Attempt | Delay after previous |
|---------|----------------------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts the event is marked **dead** and no further retries occur. For critical flows, poll `GET /payments/{id}` or `GET /payouts/{id}` as a fallback.

## Scoping

- **Merchant-scoped API key** → webhook fires only for that merchant's events.
- **Account-scoped API key** → webhook fires for all events across all merchants under your account.
