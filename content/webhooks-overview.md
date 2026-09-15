---
title: Overview
nav_order: 10
parent: Webhooks
---

# Webhooks

Webhooks deliver asynchronous Payment, Refund, and Payout lifecycle events to your server.

A V2 subscription can receive all event families at the same URL or use `eventTypes` as an explicit allowlist. Route each event using `eventType`.

## Delivery model

- Deliveries are at least once and can be duplicated.
- Event order is not guaranteed.
- Deduplicate by `eventId`.
- Store the greatest `resourceVersion` processed for each resource.
- An older version must never overwrite a newer state.
- Any HTTP `2xx` acknowledges delivery.
- Timeouts and non-`2xx` responses are retried with bounded exponential backoff.
- Redirects are not followed.

Repeated deliveries retain the same body, `eventId`, and `resourceVersion`, but receive a new delivery timestamp and signature.

## Common V2 envelope

Every event places the complete current resource in `data.object`. It has the same representation returned by the corresponding GET endpoint.

The envelope includes `merchantId`, allowing account-scoped consumers to route events to the correct merchant.

## Recommended flow

1. Create a subscription with `POST /v2/webhooks`.
2. Store the returned `webhookSecret` securely.
3. Verify every delivery using the raw HTTP request body.
4. Deduplicate and enforce `resourceVersion` ordering.
5. Queue business processing and respond promptly with `2xx`.
6. Retrieve the corresponding resource when its state is ambiguous.

Recovery endpoints:

- `GET /v2/payments/{transactionId}`
- `GET /v2/refunds/{refundId}`
- `GET /v2/payouts/{payoutId}`

> Compatibility note: V1 registrations and payloads remain unchanged. This section documents the V2 integration.
