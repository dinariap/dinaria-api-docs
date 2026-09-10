---
title: Errors And Retries
nav_order: 14
parent: Money In
---

# Errors & retries

Errors use the common OpenAPI shape:

```json
{
  "code": "invalid_request",
  "message": "amount must be a positive decimal string",
  "requestId": "req-01J7A8JH7MY2V9KQ4X1G7EMD8P"
}
```

| HTTP | Meaning |
|---:|---|
| `400` | Invalid or malformed request. |
| `401` | Missing or invalid authentication. |
| `403` | Credential is not allowed to access the merchant or resource. |
| `404` | Requested payment or refund does not exist. |
| `409` | Conflict such as reusing an idempotency key with a different body. |
| `422` | Syntactically valid request that cannot be processed. |
| `503` | Temporary provider or internal dependency failure. |

The applicable codes vary by operation. Preserve `requestId` in logs and support cases.

## Safe retries

`POST /v2/payments` and `POST /v2/payments/{transactionId}/refunds` require `Idempotency-Key`. After a timeout or a retryable `503`, repeat the exact same request body with the same key. A successful identical replay returns the original resource.

Do not retry validation, authorization, not-found, or conflict errors without resolving their cause. Never generate a new key merely to resolve an ambiguous timeout, because that can create a second operation.
