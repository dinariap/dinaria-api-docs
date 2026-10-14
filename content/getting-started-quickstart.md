---
title: Payment Quickstart
parent: Get Started
---

# Payment Quickstart

This guide creates an Argentina QR Payment using a merchant-scoped credential. Dinaria exposes the same provider-neutral resource model across countries and payment methods.

## 1. Configure the client

```bash
DINARIA_BASE_URL="https://sbx.dinaria.com"
DINARIA_API_KEY="<API_KEY>"
```

Every request uses:

```http
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

## 2. Create a Payment

```bash
curl --request POST "$DINARIA_BASE_URL/v2/payments" \
  --header "Authorization: Bearer $DINARIA_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: order-1001-create-v1" \
  --data '{
    "externalId": "ORDER-1001",
    "amount": "1000.00",
    "currency": "ARS",
    "paymentMethod": "qr",
    "rail": "ar_qr",
    "destinationMode": "single_use",
    "expirationDate": "2026-10-15T20:00:00Z",
    "description": "Compra ORDER-1001",
    "customer": {
      "type": "individual",
      "externalId": "CUSTOMER-001",
      "firstName": "Juan",
      "lastName": "Pérez",
      "country": "AR",
      "documentType": "CUIT",
      "documentNumber": "20234567897"
    },
    "metadata": {
      "orderId": "ORDER-1001"
    }
  }'
```

The fields shown are demonstrative and may vary by country, rail, payment method, and merchant data policy.

```json
{
  "transactionId": "8dd5d1ee-1ba0-4311-bbbd-fd19765b2f93",
  "externalId": "ORDER-1001",
  "status": "started",
  "amount": "1000.00",
  "currency": "ARS",
  "paymentMethod": "qr",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-15T20:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-1001",
  "paymentData": {
    "type": "qr",
    "qr": {
      "qrCodeString": "00020101021243430010ar.com.demo...6304B081",
      "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "qrExpiresAt": "2026-10-15T20:00:00Z"
    }
  }
}
```

Use `actionUrl` as the recommended hosted completion experience. Use `paymentData` only when building your own interface. `paymentData.type` describes the interaction mechanism and does not need to equal `paymentMethod`.

## 3. Track the result

Subscribe to `payment.created` and `payment.status_changed`, and retrieve canonical state when needed:

```bash
curl "$DINARIA_BASE_URL/v2/payments/8dd5d1ee-1ba0-4311-bbbd-fd19765b2f93" \
  --header "Authorization: Bearer $DINARIA_API_KEY"
```

Treat `confirmed` as the successful Payment outcome. Fulfill the order only after receiving that state through a verified webhook or retrieving the canonical Payment resource.

## Next steps

- [Choose your integration](getting-started-choose-integration.md)
- [Virtual Account Quickstart](getting-started-virtual-account.md)
- [Payout Quickstart](getting-started-payout.md)
- [Authentication & Idempotency](authentication-idempotency.md)
- [Create a Payment](payments-create.md)
- [Country & Capability Matrix](country-capabilities.md)
- [Webhooks](webhooks-overview.md)
