---
title: Payments Overview
nav_order: 1
parent: Money In
---

# Payments Overview

Use Payments to receive funds from customers through supported payment methods and currencies.

Every payment is created and managed through the same provider-neutral API, regardless of the underlying provider:

```text
POST /v2/payments
GET  /v2/payments
GET  /v2/payments/{transactionId}
```

You request a `paymentMethod`; Dinaria selects the provider transparently and returns a common Payment resource.

## Identifiers

| Field | Purpose |
|---|---|
| `Idempotency-Key` | Identifies the technical create attempt and makes retries safe. |
| `externalId` | Identifies the merchant's order. |
| `customer.externalId` | Identifies the customer in the merchant's system; it is not an identity document. |
| `transactionId` | Identifies the payment inside Dinaria. |

Identity documents belong in `customer.documentType`, `customer.documentNumber`, and `customer.documentCountry`.

## Merchant identification

With a merchant-scoped API key, the credential identifies the merchant and the request should omit `merchantId`. With an account-scoped credential that can operate for several merchants, include the corresponding `merchantId`.

## Completing a payment

`actionUrl` is the standard and recommended mechanism. Open it exactly as returned; it is managed by Dinaria and must never be constructed from `transactionId`. Depending on the method, it can present a redirect, QR, bank instructions, paycode, or card experience.

`paymentData` provides structured instructions for merchants that build their own experience. Its discriminator is `paymentData.type`:

| Type | Structured data |
|---|---|
| `redirect` | Universal, app, or web links and optional QR data. |
| `bank_transfer` | Rail, destination lifecycle, account identifier, and optional transfer reference. |
| `qr` | `qrCodeString`, `qrCodeBase64`, and `qrExpiresAt`; the QR format is optional. |
| `cash` | Paycode. |
| `card` | Public session token and SDK identifier when supplied. |

`paymentMethod`, request `rail`, and `paymentData.type` are different concepts. `paymentMethod` selects the general method, `rail` can optionally request a compatible network or local scheme, and `paymentData.type` describes how the payer can complete the resulting payment. They do not need to have the same value. If your client does not recognize a returned `paymentData.type`, use `actionUrl`.

A navigation to `successUrl` does not confirm payment. Fulfill the order only after a signed webhook or `GET /v2/payments/{transactionId}` reports the appropriate state.

## Statuses

| Status | Meaning |
|---|---|
| `started` | Created and awaiting payer action. |
| `pending` | Processing is in progress. |
| `confirmed` | The payment was confirmed. |
| `paid` | Funds are available according to the financial model. |
| `cancelled` | The order was cancelled. |
| `expired` | The order expired without completion. |
| `failed` | Definitive failure. |
| `refunded` | The full payment amount was successfully refunded. |

See [Binance Pay](payments-binance-pay.md) for one concrete `crypto_payment` example, [Payment Refunds](payments-refunds.md) for full and partial returns, and [Errors and normalized failures](payments-errors-retries.md) for synchronous errors and terminal Payment outcomes.
