---
title: Errors And Failures
nav_order: 4
parent: Core Concepts
---

# Errors and normalized failures

Dinaria exposes a provider-neutral error model across Payments and Payouts. Your integration can make decisions from Dinaria's stable codes without knowing which provider processed an operation.

Provider names, native codes, native messages, raw payloads, and stack traces are never part of the public API or merchant webhooks. Connectors translate native outcomes into the V2 catalog. The original evidence is retained internally for audit, support, metrics, and traceability.

There are two different kinds of failure to handle:

| Kind | When it happens | Where to read it |
|---|---|---|
| HTTP request error | Dinaria cannot accept or complete the API call synchronously. | The HTTP status and top-level error body. |
| Asynchronous resource failure | A Payment, Payout, or Refund was accepted and fails later. | The resource's terminal `status` and optional `failure` object, returned by GET and in its webhook. |

An HTTP success means the resource was accepted according to the endpoint contract. It does not guarantee that asynchronous processing will succeed.

## HTTP request errors

The public error body is:

```json
{
  "code": "invalid_request",
  "message": "amount must be a positive decimal string",
  "requestId": "req-01J7A8JH7MY2V9KQ4X1G7EMD8P"
}
```

- `code` is the stable value for programmatic decisions.
- `message` is human-readable diagnostic context. Do not branch on its text.
- `requestId` correlates the request across Dinaria systems. Save it and include it in support requests.
- `field` and `retryable` are optional OpenAPI fields. Do not assume they are present.

The endpoints currently use these HTTP codes:

| HTTP | Public code used by V2 | Meaning |
|---:|---|---|
| `400` | `invalid_request` | Malformed JSON, a missing or invalid field, an invalid identifier, or an invalid list filter. |
| `401` | `unauthorized` | Missing or invalid credentials. |
| `403` | `forbidden` | The credential lacks the required scope or cannot access the resource. |
| `404` | `not_found` | The requested resource is not visible to the caller. |
| `409` | `idempotency_conflict` | The idempotency key was reused with different input. |
| `409` | `operation_in_progress` | An operation with that identity is still in progress. |
| `422` | `refund_not_supported` | The selected Payment route does not support refunds. |
| `422` | `payout_not_supported` | Payouts are not configured for the request. |
| `503` | `dependency_unavailable` | A required dependency is temporarily unavailable before durable acceptance. |

Not every code applies to every endpoint. Use each operation's API Reference responses as the authoritative list.

### Idempotency

`POST /v2/payments`, `POST /v2/payments/{transactionId}/refunds`, and `POST /v2/payouts` require `Idempotency-Key`.

- Same key and same canonical request: Dinaria returns the original resource with `200 OK` and `Idempotent-Replayed: true`.
- Same key and different request: Dinaria returns `409 idempotency_conflict`.
- First accepted request: Dinaria returns `201 Created`.

After an ambiguous client timeout, first retry the exact request with the same key or retrieve the known resource. Do not use a new key merely to bypass uncertainty, because it can represent a second operation. The normalized asynchronous failure catalog does not publish a general retryability flag.

## Asynchronous resource failures

A resource may be created successfully and later reach a terminal outcome. The later failure is represented on the resource, not by retroactively changing the HTTP response used to create it.

Payments and Payouts use this normalized shape:

```json
{
  "failure": {
    "code": "destination_rejected",
    "category": "destination",
    "message": "La entidad receptora rechazó la operación.",
    "errors": [
      {
        "code": "invalid_value",
        "field": "destination.rail.accountNumber",
        "message": "The destination account was rejected."
      }
    ]
  }
}
```

`code`, `category`, and `message` are required when `failure` is present. `errors` is optional and contains normalized field details; each item requires `code`, `field`, and `message`. Its field-error codes are `required`, `invalid_format`, `invalid_type`, `invalid_value`, `unsupported_value`, `out_of_range`, and `inconsistent_fields`.

The `failure` property itself is optional. Its absence means that no normalized failure is associated with the current public state. It is omitted rather than returned as `null` by the current implementation.

- A Payment failure can accompany the terminal unpaid states `failed`, `cancelled`, or `expired`.
- A Payout normalized failure is currently exposed when its public state is `failed`. `cancelled` and `reversed` remain distinct terminal lifecycle outcomes.
- A Refund exposes the same normalized shape when its state is `failed`, using its own Refund code catalog.

### Failed Payment

```json
{
  "transactionId": "04058d70-7d15-4459-b046-d19b6f137c37",
  "externalId": "ORDER-1001",
  "status": "failed",
  "amount": "0.25",
  "currency": "USDT",
  "paymentMethod": "crypto_payment",
  "description": "Order 1001",
  "creationDate": "2026-09-09T18:30:00Z",
  "expirationDate": "2026-09-09T19:30:00Z",
  "actionUrl": "https://pay.sand.dinaria.com/checkout/cs_public_token",
  "failure": {
    "code": "payment_rejected",
    "category": "payment",
    "message": "El pago fue rechazado."
  },
  "paymentData": {
    "type": "redirect",
    "redirect": {
      "recommendedAlternative": "universal",
      "links": {
        "universal": "https://pay.example/checkout/order-1001"
      }
    }
  }
}
```

### Failed Payout

```json
{
  "payoutId": "82e07c90-82a5-4e40-bdf0-7a982de47745",
  "externalId": "PAYOUT-1001",
  "source": {"amount": "100.00", "currency": "USD"},
  "destination": {
    "country": "VE",
    "currency": "VES",
    "amount": "3650.00",
    "beneficiary": {
      "type": "individual",
      "name": "Maria Gonzalez",
      "documentType": "RIF",
      "documentNumber": "V27127416",
      "mobile": "+584242005748"
    },
    "rail": {"type": "ve_mobile_payment", "bankCode": "0102"}
  },
  "status": "failed",
  "creationDate": "2026-09-10T19:56:45Z",
  "failureDate": "2026-09-10T20:00:00Z",
  "failure": {
    "code": "destination_rejected",
    "category": "destination",
    "message": "La entidad receptora rechazó la operación."
  }
}
```

### Failed Refund

```json
{
  "refundId": "6c3fc750-8640-4a4f-b981-9ccfabd8f8c7",
  "transactionId": "04058d70-7d15-4459-b046-d19b6f137c37",
  "externalId": "REFUND-1001",
  "status": "failed",
  "amount": "0.10",
  "currency": "USDT",
  "reason": "Customer request",
  "creationDate": "2026-09-09T20:00:00Z",
  "completionDate": "2026-09-09T20:01:00Z",
  "failure": {
    "code": "refund_rejected",
    "category": "refund",
    "message": "El reembolso fue rechazado."
  }
}
```

## Normalized code catalog

The tables below reproduce catalog version `1.0.0`. The catalog deliberately does not define whether a code is retryable. Retrieve the current resource before acting, use codes rather than messages, and include the resource ID and `requestId` when contacting support.

Every normalized `failure` describes a definitive resource outcome. It is not used while an operation is merely waiting, while a provider result remains ambiguous, or for a webhook delivery problem. Always use the resource's `status` as the lifecycle source of truth; the catalog deliberately does not define retryability.

### General codes

| Code | When it is used | Applies to | Client handling |
|---|---|---|---|
| `compliance_rejected` | A compliance, sanctions, or risk control definitively rejected the operation. | Payment, Refund, Payout | Treat the resource outcome as definitive and retain its ID for support. |
| `limit_exceeded` | A transactional, account, or regulatory limit definitively prevents the operation. | Payment, Refund, Payout | Review the applicable limit before creating another operation. |
| `provider_unavailable` | A required provider was unavailable and processing ended in a definitive failure. It is not used while reconciliation continues. | Payment, Refund, Payout | Retrieve the resource; the code alone does not promise that a new attempt is safe. |
| `processing_error` | A terminal technical processing error occurred and no more specific public code applies. | Payment, Refund, Payout | Retain the resource ID and `requestId` for support. |
| `unknown_error` | The resource failed definitively, but the native result has no valid mapping in the current catalog. | Payment, Refund, Payout | Retrieve the resource and provide its identifiers to support when investigation is required. |

### Payment codes

| Code | When it is used | Client handling |
|---|---|---|
| `invalid_customer_data` | Payer or customer information is invalid. Field errors may identify the affected customer paths. | Review the customer data before creating another Payment. |
| `payment_method_unavailable` | The requested method cannot be used for the operation, merchant, or market. | Offer another supported payment method when appropriate. |
| `payment_expired` | The configured payment window ended before completion. | Treat `status: expired` as terminal; a later attempt is a new Payment. |
| `payer_cancelled` | The payer explicitly cancelled or abandoned the Payment and a terminal cancellation was reported. | Treat `status: cancelled` as terminal. |
| `amount_mismatch` | Funds were observed, but the amount does not match the required amount and the mismatch is terminal. | Retain the Payment ID for reconciliation or support. |
| `payment_rejected` | The payment rail or receiving institution definitively rejected the attempt. | Treat the Payment outcome as definitive. |
| `payment_not_received` | Reconciliation conclusively determined that the expected funds did not arrive for an identifiable attempt or order, and no further normal reconciliation is expected to confirm them. | Treat the result as terminal. It does not mean “not received yet.” |

`payment_not_received` is not used while the Payment remains `started` or `pending`, merely because time passed, because a webhook is delayed, or when the normal payment window expires. Ordinary expiration uses `payment_expired`.

### Refund codes

| Code | When it is used | Client handling |
|---|---|---|
| `insufficient_funds` | Dinaria cannot secure the merchant funds required to submit or complete the Refund. | Confirm available funds before creating another Refund. |
| `refund_rejected` | The customer Refund was definitively rejected or failed. Dinaria publishes `status: failed` only after any required balance compensation succeeds. | Treat the Refund as terminal and use GET for its current representation. |

Refunds may also use the general codes above.

### Payout codes

| Code | When it is used | Client handling |
|---|---|---|
| `invalid_remitter_data` | Remitter data is invalid for the selected route. | Review remitter data before creating another Payout. |
| `invalid_beneficiary_data` | Beneficiary identity or profile data is invalid. | Review beneficiary data before creating another Payout. |
| `invalid_destination` | The destination account, wallet, rail, or destination-specific data is invalid. | Review destination and rail data. |
| `destination_rejected` | The receiving institution or destination definitively rejected the Payout. | Verify destination data before creating another Payout. |
| `beneficiary_blocked` | The beneficiary is not permitted to receive the Payout. | Retain the Payout ID for support; do not infer details from the message. |
| `insufficient_funds` | Available merchant funds are insufficient to execute the Payout. | Confirm the prefunded source-currency balance before creating another Payout. |
| `payout_cancelled` | The Payout was cancelled before final delivery. | Treat `status: cancelled` as terminal. A returned confirmed Payout uses `status: reversed`, not this code. |

Payouts may also use the general codes above.

## Failed webhook event

Webhooks carry the complete current public resource, including the same normalized `failure` object returned by GET. Native provider errors are not added to the event.

```json
{
  "eventId": "55f81c7d-989a-40fe-a8ef-f9354ca6688a",
  "eventType": "payout.status_changed",
  "apiVersion": "2",
  "merchantId": "merchant-123",
  "creationDate": "2026-09-10T20:00:00Z",
  "resourceVersion": 2,
  "previousStatus": "processing",
  "data": {
    "object": {
      "payoutId": "82e07c90-82a5-4e40-bdf0-7a982de47745",
      "externalId": "PAYOUT-1001",
      "source": {"amount": "100.00", "currency": "USD"},
      "destination": {
        "country": "VE",
        "currency": "VES",
        "amount": "3650.00",
        "beneficiary": {
          "type": "individual",
          "name": "Maria Gonzalez",
          "documentType": "RIF",
          "documentNumber": "V27127416",
          "mobile": "+584242005748"
        },
        "rail": {"type": "ve_mobile_payment", "bankCode": "0102"}
      },
      "status": "failed",
      "creationDate": "2026-09-10T19:56:45Z",
      "failureDate": "2026-09-10T20:00:00Z",
      "failure": {
        "code": "destination_rejected",
        "category": "destination",
        "message": "La entidad receptora rechazó la operación."
      }
    }
  }
}
```

Webhook delivery is at least once and signed with Dinaria's standard V2 mechanism. A receiver should verify the signature, deduplicate by `eventId`, compare `resourceVersion`, queue its work, and respond promptly with HTTP `2xx`. Dinaria retries timeouts and non-2xx responses using its published bounded exponential-backoff policy.

A webhook delivery failure does not change or reverse the financial resource. Always use GET to recover the current state when an event is delayed or missed.

## Support and observability

Store the identifiers relevant to the operation: HTTP `requestId`, Payment `transactionId`, Payout `payoutId`, Refund `refundId`, and webhook `eventId` plus `resourceVersion`.

Send these identifiers when requesting support. Do not rely exclusively on webhook delivery, parse messages for business logic, or expect provider-specific diagnostics in the public contract.
