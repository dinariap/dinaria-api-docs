---
title: Receiving
nav_order: 12
parent: Webhooks
---

# Receiving webhook events

Dinaria sends signed HTTP `POST` requests when a Payment, Refund, or Payout is created or changes status.

## Verification flow

1. Read the raw request body.
2. Validate `X-Webhook-Timestamp` and reject timestamps outside ±5 minutes.
3. Verify `X-Webhook-Signature` against the raw body.
4. Parse the JSON.
5. Deduplicate by `eventId`.
6. Ignore a resource update when its `resourceVersion` is older than or equal to the greatest version already processed.
7. Queue business processing and respond promptly with any HTTP `2xx`.

## Payment created example

```json
{
  "eventId": "bb238542-f766-4e95-a5de-72cd33880a13",
  "eventType": "payment.created",
  "apiVersion": "2",
  "merchantId": "merchant1",
  "creationDate": "2026-09-09T18:30:01Z",
  "resourceVersion": 1,
  "data": {
    "object": {
      "transactionId": "04058d70-7d15-4459-b046-d19b6f137c37",
      "externalId": "ORDER-1001",
      "status": "started",
      "amount": "0.25",
      "currency": "USDT",
      "paymentMethod": "crypto_payment",
      "description": "Super Test",
      "creationDate": "2026-09-09T18:30:00Z",
      "expirationDate": "2026-09-09T19:30:00Z",
      "actionUrl": "https://pay.sand.dinaria.com/checkout/cs_public_token",
      "customer": {
        "type": "individual",
        "externalId": "customer-123",
        "firstName": "Sebastian",
        "lastName": "Gonzalez",
        "email": "sebastian@example.com",
        "country": "UY"
      },
      "metadata": { "orderId": "ORDER-1001" },
      "paymentData": {
        "type": "redirect",
        "redirect": {
          "recommendedAlternative": "universal",
          "links": {
            "universal": "https://app.binance.com/qr/order-token",
            "app": "bnc://app.binance.com/payment/order-token",
            "web": "https://pay.binance.com/en/checkout/order-token"
          }
        }
      }
    }
  }
}
```

`payment.created` is emitted after persistence and does not mean that the payment is confirmed. The object has the same representation returned by `GET /v2/payments/{transactionId}`.

## Payout status example

```json
{
  "eventId": "b2c3d4e5-f6a7-8901-bcde-f01234567890",
  "eventType": "payout.status_changed",
  "apiVersion": "2",
  "merchantId": "my_merchant_1",
  "creationDate": "2026-09-10T20:00:00Z",
  "resourceVersion": 3,
  "previousStatus": "processing",
  "data": {
    "object": {
      "payoutId": "1078d6c2-a452-44fb-94f4-525390231ce2",
      "externalId": "PO-2001",
      "source": { "amount": "150.00", "currency": "BRL" },
      "destination": {
        "country": "BR",
        "currency": "BRL",
        "beneficiary": {
          "type": "individual",
          "name": "João Silva",
          "documentType": "CPF",
          "documentNumber": "12345678901"
        },
        "rail": {
          "type": "br_pix",
          "pixKey": { "type": "cpf", "value": "12345678901" }
        }
      },
      "status": "confirmed",
      "creationDate": "2026-09-10T19:59:00Z",
      "confirmationDate": "2026-09-10T20:00:00Z"
    }
  }
}
```

`data.object` is the complete public representation returned by `GET /v2/payouts/{payoutId}`, not a reduced webhook model.

## Key fields

| Field | Description |
|---|---|
| `eventType` | Creation or status-change event for a payment, refund, or payout. |
| `eventId` | Stable event identifier used for deduplication. |
| `apiVersion` | Public webhook schema version; V2 sends `"2"`. |
| `merchantId` | Merchant that owns the resource. |
| `creationDate` | Time when the event was created. |
| `resourceVersion` | Monotonic version for ordering updates to the same resource. |
| `previousStatus` | Previous public status, when applicable. |
| `data.object` | Complete current resource. |

## Recovery

Use the resource identifier inside `data.object` to retrieve canonical state:

- Payment: `GET /v2/payments/{transactionId}`
- Refund: `GET /v2/refunds/{refundId}`
- Payout: `GET /v2/payouts/{payoutId}`

See [Webhook Security](webhooks-security.md) for signature verification and [Event Types](webhooks-event-types.md) for the supported events.
