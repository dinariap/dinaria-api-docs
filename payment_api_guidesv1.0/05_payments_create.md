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
| `externalId` | string | — | Your own reference for this payment order |
| `merchantId` | string | — | Target merchant. Set automatically from merchant-scoped API key |
| `paymentMethods` | array | — | Payment method IDs to offer |
| `successUrl` | string | — | Redirect URL on success |
| `cancelUrl` | string | — | Redirect URL on cancellation |
| `metadata` | object | — | Arbitrary key-value pairs for your records |
| `customer` | object | — | Customer identity data (see below) |
| `allowOverUnder` | boolean | — | If `true`, the reconciler will accept an incoming transfer even if the received amount differs slightly from the expected amount. Default: `false`. |

### `allowOverUnder`

When the payer sends an amount slightly above or below the expected value — due to rounding, bank fees, or manual entry — the reconciler normally rejects the match. Setting `allowOverUnder: true` on the payment order tells the reconciler to accept these near-matches. Useful for cash-in flows where exact amounts are hard to control.

## Example request
```json
{
  "externalId": "ORD-1001",
  "amount": "100.50",
  "currency": "ARS",
  "successUrl": "https://merchant.example/success",
  "cancelUrl": "https://merchant.example/cancel",
  "allowOverUnder": true,
  "metadata": {
    "orderId": "ORD-1001"
  },
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "cuit": "20123456789"
  }
}
```

## Example response
```json
{
  "transactionId": "trx_123456",
  "externalId": "ORD-1001",
  "status": "started",
  "amount": "100.50",
  "currency": "USD",
  "actionUrl": "https://pay.tuservicio.com/checkout/trx_123456",
  "metadata": {
    "orderId": "ORD-1001",
    "cartId": "CART-7788"
  },
  "paymentMethods": ["pm_card", "pm_wallet"]
}
```
