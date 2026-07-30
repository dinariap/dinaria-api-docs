---
title: Webhooks Best Practices
nav_order: 16
parent: Webhooks
---

# Webhook best practices

## Security

- Always verify webhook signatures before processing.
- Store secrets in a secure secret manager — never in source code or logs.
- Rotate webhook secrets periodically using `POST /webhooks/payments/rotate-secret`.
- Use constant-time comparison when verifying signatures.

## Idempotency

Webhooks are delivered **at least once** — duplicates can occur.

Deduplicate using `eventId`. Track processed event IDs and ignore re-deliveries:

```
if already_processed(event["eventId"]):
    return HTTP 200  # Acknowledge without re-processing
```

Do not rely solely on `transactionId + status` as uniqueness — the same status may be delivered more than once.

## Response requirements

- Return HTTP `200` within 10 seconds.
- Do **not** perform heavy processing synchronously. Enqueue the event and process it in a background job.
- Any non-2xx response is treated as a delivery failure and will be retried.

## Handling out-of-order delivery

Events may arrive out of order. Always fetch the latest state from the API (`GET /payments/{id}` or `GET /payouts/{id}`) before acting on a status change if ordering matters for your business logic.

## Fallback polling

Webhooks are retried up to 5 times over ~2.5 hours. For critical flows, implement a fallback polling job that periodically checks for open payments that have not received a terminal webhook:

```
GET /payments?status=started&createdBefore=<2h ago>
```

If you find payments that should have been confirmed but haven't received a webhook, fetch their current status and reconcile accordingly.

## Golden rule

Never confirm a payment to your end user based on a redirect or front-end callback alone. Always confirm final state using a verified webhook or a direct API lookup.
