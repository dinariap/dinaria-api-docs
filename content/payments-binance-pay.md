---
title: Binance Pay
nav_order: 3
parent: Money In
---

# Binance Pay

Binance Pay is one use case of the general Payments V2 contract. It does not have provider-specific public endpoints: request `paymentMethod: crypto_payment` and use the standard Payment, webhook, and Refund resources.

## Create the payment

> **The fields shown in this example are for demonstration purposes and may vary depending on the use case.**

```bash
curl --request POST \
  --url https://api.sandbox.dinaria.com/v2/payments \
  --header 'Authorization: Bearer <YOUR_API_KEY>' \
  --header 'Idempotency-Key: order-1001-attempt-1' \
  --header 'Content-Type: application/json' \
  --data '{
    "externalId": "ORDER-1001",
    "amount": "0.25",
    "currency": "USDT",
    "paymentMethod": "crypto_payment",
    "description": "Super Test",
    "successUrl": "https://merchant.example.com/payments/success",
    "cancelUrl": "https://merchant.example.com/payments/cancel",
    "customer": {
      "type": "individual",
      "externalId": "customer-123",
      "firstName": "Sebastian",
      "lastName": "Gonzalez",
      "email": "sebastian@example.com",
      "country": "UY"
    },
    "metadata": {
      "orderId": "ORDER-1001"
    }
  }'
```

This example uses USDT. `description` is associated with and can be shown in the payment experience.

## Response

```json
{
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
      },
      "qr": {
        "content": "https://app.binance.com/qr/order-token",
        "imageUrl": "https://public.example/qr/order-token.png",
        "expiresAt": "2026-09-09T19:30:00Z"
      }
    }
  }
}
```

## Customer experience

`actionUrl` is the recommended standard path and can be opened directly. For a custom experience:

- `recommendedAlternative` identifies the preferred direct alternative.
- `links.universal` opens the best available Binance experience.
- `links.app` targets the installed application.
- `links.web` targets the web checkout.
- `qr.content` is the QR payload.
- `qr.imageUrl` is a ready-to-display QR image.
- `qr.expiresAt` is the expiration of those instructions.

Links and QR data are specific to this order and expire. Treat them as opaque values. Do not construct or rewrite them.

`successUrl` and `cancelUrl` only control where the browser returns. They do not establish payment status. Track completion through `payment.status_changed` or `GET /v2/payments/{transactionId}`.

## Refunds

Binance Pay uses the same endpoints as every payment:

```text
POST /v2/payments/{transactionId}/refunds
GET  /v2/payments/{transactionId}/refunds
GET  /v2/refunds/{refundId}
```

There is no public Binance Pay-specific refund endpoint. See [Payment Refunds](payments-refunds.md).
