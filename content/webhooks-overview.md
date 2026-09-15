---
title: Overview
nav_order: 10
parent: Webhooks
---

# Webhooks

Webhooks deliver asynchronous notifications for Payment, Refund, and Payout lifecycle events.

For webhook registrations using API version `2`, the same registered URL receives all three resource families through one common V2 envelope. Use `eventType` to distinguish the resource and event.

This is an additive V2 behavior. V1 registrations, payloads, and event names remain unchanged.

> Webhooks are delivered **at least once**. Your integration must be idempotent — use `eventId` to deduplicate.

Events are not guaranteed to arrive in order. If two events conflict or the current state is unclear, retrieve the resource using `GET /v2/payments/{transactionId}`, `GET /v2/refunds/{refundId}`, or `GET /v2/payouts/{payoutId}`.

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

After 5 failed attempts the event is marked **dead** and no further retries occur. For critical flows, retrieve the corresponding V2 resource as a fallback.

## Scoping

- **Merchant-scoped API key** → webhook fires only for that merchant's events; registration and rotate use that merchant implicitly (no `merchantId` in the rotate body).
- **Account-scoped API key** → webhook fires for all events across all merchants under your account; rotate may include `merchantId` when targeting a merchant-specific registration.

## Reverse proxies

If you terminate TLS or route traffic through nginx (or similar), forward **`/webhooks/`** prefix routes to the API — including **`/webhooks/payments/rotate-secret`** and related paths — not only an exact match on `/webhooks/payments`, or secret rotation calls may return 404 at the edge.
