---
title: Best Practices
nav_order: 13
parent: Webhooks
---

# Webhook best practices

## Make webhook handling resilient
- Assume events may be duplicated (at-least-once delivery)
- Assume events may arrive out of order
- Do not block webhook responses with heavy processing

## Idempotency
Use a persistent idempotency strategy, for example:
- `transactionId + status` as a natural key
- Ignore duplicates you've already processed

## Response requirements
- Respond with HTTP 200 quickly
- Process asynchronously (queue/background job)

## Golden rule
Do not rely on redirects for confirmation. Confirm final state using webhooks or retrieve payment.
