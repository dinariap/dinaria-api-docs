---
title: Create Payments
nav_order: 7
parent: Guides
---

# Create a payment

`POST /payments`

## Headers

```http
Authorization: Bearer <api_key>
Content-Type: application/json
Idempotency-Key: <uuid>
```

## Important notes

- Payments are single-use. Create a new payment for each attempt.
- `merchantId` is resolved server-side from your API key — **do not send it in the request body**.
- Redirects to `successUrl` or `cancelUrl` do not guarantee final payment status. Always confirm via webhook or `GET /payments/{transactionId}`.

---

## Request fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string, e.g. `"100.50"` |
| `currency` | string | ✅ | ISO 4217 — `ARS` or `BRL` |
| `customer` | object | ✅ | See Customer object below |
| `externalId` | string | — | Your internal order/checkout reference |
| `metadata` | object | — | Free-form key-value pairs, returned in webhooks |
| `successUrl` | string | — | Redirect URL on payment success |
| `cancelUrl` | string | — | Redirect URL on payment cancel/expiry |

### Customer object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Full name of the payer |
| `documentNumber` | string | ✅ | Tax ID — see country details below |
| `documentType` | string | — | Inferred if omitted |
| `email` | string | — | Payer email |

---

## Example request & response

<div class="country-ar">

### Argentina (ARS)

`documentNumber` — CUIT (11 digits) or DNI (7–8 digits).

```json
{
  "amount": "1500.00",
  "currency": "ARS",
  "externalId": "ORD-1001",
  "customer": {
    "name": "Juan Pérez",
    "documentNumber": "20123456789"
  },
  "metadata": {
    "orderId": "ORD-1001"
  },
  "successUrl": "https://merchant.example/success",
  "cancelUrl": "https://merchant.example/cancel"
}
```

**Response:**

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "started",
  "amount": "1500.00",
  "currency": "ARS",
  "paymentData": {
    "type": "bank_transfer",
    "cbu": "4310009922100000122004",
    "alias": "DINARIA.ARS",
    "reference": "9032000000000000023"
  },
  "metadata": { "orderId": "ORD-1001" }
}
```

Display `paymentData.cbu` (or `paymentData.alias`) and `paymentData.reference` to the customer. Instruct them to initiate a bank transfer (CBU/CVU) to that destination and include the reference in the transfer description.

</div>

<div class="country-br">

### Brasil (BRL)

`documentNumber` — CPF (11 digits) or CNPJ (14 digits).

```json
{
  "amount": "100.00",
  "currency": "BRL",
  "externalId": "ORD-1001",
  "customer": {
    "name": "João Silva",
    "documentNumber": "12345678901"
  },
  "metadata": {
    "orderId": "ORD-1001"
  }
}
```

**Response:**

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
  },
  "metadata": { "orderId": "ORD-1001" }
}
```

Display `paymentData.pixKey` to the customer. Instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description. There is no redirect for BRL payments.

</div>

---

## Confirm final status

Listen for the webhook event or poll:

```
payment.status_changed  (status: "confirmed")
```

```
GET /payments/{transactionId}
```
