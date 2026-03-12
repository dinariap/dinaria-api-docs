---
title: Create Payments
nav_order: 7
parent: Guides
---

# Create a payment


Use this endpoint to create a payment and start a checkout flow.

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

## merchantId
`merchantId` is resolved server-side from your API key — **do not send it in the request body**.

Your API key is scoped to a single merchant. The platform injects the correct `merchantId` automatically. If you send a `merchantId` that does not match your key's scope, the request is rejected with `403 Forbidden`.

## Request fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string, e.g. `"100.50"` |
| `currency` | string | ✅ | ISO 4217 code — `ARS` (Argentina) or `BRL` (Brazil) |
| `customer` | object | ✅ | See Customer object below |
| `externalId` | string | — | Your internal order/checkout reference |
| `metadata` | object | — | Free-form key-value pairs, returned in webhooks |
| `successUrl` | string | — | Redirect URL on payment success |
| `cancelUrl` | string | — | Redirect URL on payment cancel/expiry |

### Customer object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Full name of the payer |
| `documentNumber` | string | ✅ | Tax ID — CUIT/DNI for ARS, CPF/CNPJ for BRL |
| `documentType` | string | — | `CUIT`, `DNI`, `CPF`, or `CNPJ` (inferred if omitted) |
| `email` | string | — | Payer email |

---

<div class="country-ar" markdown="1">

## Argentina (ARS) — Bank transfer

The customer is redirected to `actionUrl`, where they receive CBU/CVU bank transfer instructions with a reference number.

### Example request

```json
{
  "amount": "100.50",
  "currency": "ARS",
  "externalId": "ORD-1001",
  "customer": {
    "name": "Juan Pérez",
    "documentNumber": "20123456789"
  }
}
```

### Example response

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "started",
  "amount": "100.50",
  "currency": "ARS",
  "actionUrl": "https://pay.dinaria.com/checkout/f90c7c31-7a38-46dc-99ba-188a4c99da29"
}
```

Redirect the customer to `actionUrl`. They will see CBU + reference transfer instructions.

</div>

<div class="country-br" markdown="1">

## Brasil (BRL) — PIX

For BRL payments there is no redirect. The response includes a `paymentData` object with a static PIX deposit key. Display the PIX key to the customer and instruct them to initiate the transfer in their bank app, using the `reference` (the `transactionId`) as the transfer description.

### Example request

```json
{
  "amount": "100.00",
  "currency": "BRL",
  "externalId": "ORD-1001",
  "customer": {
    "name": "João Silva",
    "documentNumber": "12345678901"
  }
}
```

### Example response

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "started",
  "amount": "100.00",
  "currency": "BRL",
  "paymentData": {
    "type": "pix_transfer",
    "pixKey": "bc8ba248-fb33-4022-bea1-c9fab2efd341",
    "pixKeyType": "random",
    "reference": "f90c7c31-7a38-46dc-99ba-188a4c99da29"
  }
}
```

</div>

> **Note:** Response fields differ by country and contracted services. See [Data Formats](13_data_formats_iso.md) for country-specific details.
