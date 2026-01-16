---
title: Getting Started
nav_order: 3
parent: Guides
---

# Getting started

## Base URL
Use the base URL for the environment you are integrating with.

- Sandbox: `https://sbxapi.dinaria.com/v1`
- Production: `https://api.dinaria.com/v1`

## Authentication (API Key)

Authenticate every request by sending your API key in the `Authorization` header:

```http
Authorization: Bearer di_test_xxx
Content-Type: application/json
```

**Best practices**
- Treat your API key as a secret (never expose it in the frontend).
- Rotate the key if you suspect compromise.
- Log the `Request-Id` response header (if enabled) when contacting support.

## Idempotency

For requests that create resources (for example `POST /payments`) we strongly recommend sending an `Idempotency-Key` header.

```http
Idempotency-Key: <uuid-v4>
```

**Why it matters**
- Protects you from accidental duplicates during retries
- Helps when the client times out but the server completed the request

## Key concepts

### Payments are single-use
A payment represents a single checkout attempt.
If a payment is `cancelled` or `expired`, create a new payment.

### Redirects are not confirmation
Redirects to `successUrl` or `cancelUrl` do **not** guarantee final payment status.
Always confirm the final state using:
- webhooks (recommended), or
- `GET /payments/{transactionId}`

### externalId
`externalId` is your internal identifier (order/checkout reference).
It is stored and returned in:
- create payment response
- retrieve payment response
- webhook events
