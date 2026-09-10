---
title: Retrieve & List Payments
nav_order: 4
parent: Money In
---

# Retrieve & List Payments

## Retrieve a payment

```bash
curl --request GET \
  --url https://api.sandbox.dinaria.com/v2/payments/04058d70-7d15-4459-b046-d19b6f137c37 \
  --header 'Authorization: Bearer <YOUR_API_KEY>'
```

`GET /v2/payments/{transactionId}` returns the latest complete Payment representation. It has the same shape used by create, list items, and webhook `data.object`.

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
      "links": { "universal": "https://wallet.example.com/qr/order-token" }
    }
  }
}
```

## List payments

```bash
curl --request GET \
  --url 'https://api.sandbox.dinaria.com/v2/payments?limit=50' \
  --header 'Authorization: Bearer <YOUR_API_KEY>'
```

| Parameter | Description |
|---|---|
| `limit` | Page size from 1 to 100; default 50. |
| `cursor` | Opaque value returned as `nextCursor` by the preceding page. |

```json
{
  "data": [
    {
      "transactionId": "04058d70-7d15-4459-b046-d19b6f137c37",
      "externalId": "ORDER-1001",
      "status": "started",
      "amount": "0.25",
      "currency": "USDT",
      "paymentMethod": "crypto_payment",
      "creationDate": "2026-09-09T18:30:00Z",
      "expirationDate": "2026-09-09T19:30:00Z",
      "actionUrl": "https://pay.sand.dinaria.com/checkout/cs_public_token",
      "paymentData": {
        "type": "redirect",
        "redirect": {
          "recommendedAlternative": "universal",
          "links": { "universal": "https://wallet.example.com/qr/order-token" }
        }
      }
    }
  ],
  "hasMore": true,
  "nextCursor": "<OPAQUE_CURSOR>"
}
```

When `hasMore` is true, send `nextCursor` unchanged as the next request's `cursor`. The V2 list endpoint only defines `limit` and `cursor`.

Use signed webhooks for real-time changes and retrieve the payment when delivery is delayed, duplicated, or out of order.
