---
title: Webhooks Best Practices
nav_order: 13
parent: Guides
---

# Webhook best practices

## Security
- Always verify webhook signatures
- Store secrets in a secure secret manager
- Rotate webhook secrets periodically
- Use constant-time signature comparison

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
