---
title: Create Payments
nav_order: 7
parent: Guides
---

# Create a payment

Use this endpoint to create a payment and start a redirect-based checkout flow.

## Endpoint
```
POST /payments
```

## Headers
```http
Authorization: Bearer <api_key>
Content-Type: application/json
Idempotency-Key: <uuid>
```

## Important notes
- Payments are single-use. Create a new payment for each attempt.
- Redirects to `successUrl` or `cancelUrl` do not guarantee final payment status.
  Always confirm using webhooks or `GET /payments/{transactionId}`.
- `paymentMethods` must contain payment method **IDs** (not objects).

## Request fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal amount, e.g. `"1500.00"` |
| `currency` | string | ✅ | ISO 4217 currency code, e.g. `"ARS"` |
| `merchantId` | string | ✅ | Target merchant ID. Set automatically when using a merchant-scoped API key |
| `customer.documentNumber` | string | ✅ | Payer's CUIT/CUIL (Argentina). Used by the reconciler to match incoming Coinag transfers to this order |
| `externalId` | string | — | Your own reference for this payment order |
| `paymentMethods` | array | — | Payment method IDs to offer |
| `successUrl` | string | — | Redirect URL on success |
| `cancelUrl` | string | — | Redirect URL on cancellation |
| `metadata` | object | — | Arbitrary key-value pairs for your records |
| `customer.firstName` | string | — | |
| `customer.lastName` | string | — | |
| `customer.email` | string | — | |
| `customer.phoneNumber` | string | — | |
| `customer.documentType` | string | — | |
| `allowOverUnder` | boolean | — | If `true`, the reconciler will accept an incoming transfer even if the amount differs slightly from expected. Default: `false` |

### Why `customer.documentNumber` is required

The matching engine links incoming Coinag bank transfers to payment orders using **CUIT + amount**. Without the payer's CUIT, the reconciler has no way to identify which order an incoming transfer belongs to — the payment will never be confirmed automatically.

### `allowOverUnder`

When `true`, the reconciler will match a transfer to this order even if the received amount is slightly above or below `amount`. Useful when payers round manually or when banks apply small fees.

## Example request
```json
{
  "merchantId": "merchant_abc",
  "externalId": "ORD-1001",
  "amount": "1500.00",
  "currency": "ARS",
  "successUrl": "https://merchant.example/success",
  "cancelUrl": "https://merchant.example/cancel",
  "allowOverUnder": false,
  "metadata": {
    "orderId": "ORD-1001"
  },
  "customer": {
    "documentNumber": "20123456789",
    "firstName": "Juan",
    "lastName": "García",
    "email": "juan@example.com"
  }
}
```

## Example response
```json
{
  "transactionId": "a3f7c821-...",
  "merchantId": "merchant_abc",
  "externalId": "ORD-1001",
  "status": "started",
  "amount": "1500.00",
  "currency": "ARS",
  "coinagReference": "REF-a3f7c821",
  "paymentData": {
    "type": "bank_transfer",
    "cbu": "4310009922100000122004",
    "reference": "REF-a3f7c821"
  }
}
```
