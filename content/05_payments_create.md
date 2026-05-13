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

Brazil supports two collection methods, selected at create time via `paymentMethod`. Pick whichever fits your checkout UX best — both are reconciled automatically.

| `paymentMethod` | What the merchant displays | Expiration |
|---|---|---|
| `instant_bank_transfer` *(default)* | Static PIX deposit key + reference | Merchant-controlled (`expiresAfter` / `expiration`) |
| `pix_qr` | Per-order dynamic PIX QR (BR-Code) | **Forced to 15 minutes** (matches the QR's hard expiry) |

#### Method 1 — Static PIX deposit key (`instant_bank_transfer`)

This is the default when `paymentMethod` is omitted.

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
  "paymentMethod": "instant_bank_transfer",
  "paymentData": {
    "type": "pix_transfer",
    "pixKey": "bc8ba248-fb33-4022-bea1-c9fab2efd341",
    "pixKeyType": "random",
    "reference": "f90c7c31-7a38-46dc-99ba-188a4c99da29"
  },
  "metadata": { "orderId": "ORD-1001" }
}
```

Display `paymentData.pixKey` to the customer. Instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description. Dinaria matches the transfer by the payer's CPF/CNPJ + amount.

#### Method 2 — Dynamic PIX QR (`pix_qr`)

Pass `"paymentMethod": "pix_qr"` to mint a per-order BR-Code. The response contains both the EMV string (for QR-rendering libraries or copy-and-paste PIX) and a base64 PNG (drop-in `<img>` tag).

```json
{
  "amount": "100.00",
  "currency": "BRL",
  "paymentMethod": "pix_qr",
  "externalId": "ORD-2003",
  "customer": {
    "name": "Belo Brasil Ltda",
    "documentType": "CNPJ",
    "documentNumber": "58084921000160"
  },
  "metadata": { "orderId": "ORD-2003" }
}
```

**Response:**

```json
{
  "transactionId": "3d99d177-aa3f-4b34-9e1d-8d5b69e0c1b1",
  "externalId": "ORD-2003",
  "status": "started",
  "amount": "100.00",
  "currency": "BRL",
  "paymentMethod": "pix_qr",
  "expirationDate": "2026-05-13T16:34:26Z",
  "expiresAt":      "2026-05-13T16:34:26Z",
  "paymentData": {
    "type": "pix_qr",
    "qrCodeString": "00020101021226790014br.gov.bcb.pix2557brcode.example.com/v2/...6304ABCD",
    "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "qrExpiresAt":  "2026-05-13T16:34:26Z",
    "reference":    "3d99d177-aa3f-4b34-9e1d-8d5b69e0c1b1"
  }
}
```

Two rendering options:

```html
<!-- Drop-in PNG, no extra dependencies -->
<img src="data:image/png;base64,{{paymentData.qrCodeBase64}}" alt="Pague com PIX" />

<!-- Or render the EMV string with any QR library -->
<div data-qr="{{paymentData.qrCodeString}}"></div>
```

Also show `paymentData.qrCodeString` as a "copy PIX code" button — many Brazilian bank apps support pasting it directly.

> **Note:** `pix_qr` orders expire after **15 minutes** (the QR's hard limit). Any `expiresAfter` or `expiration` you pass is ignored for this method. If the customer doesn't pay in time, create a new payment.

**How reconciliation works.** The QR has Dinaria's `transactionId` baked in as the BR-Code's `externalId`. When the customer pays, that ID flows back with the incoming PIX credit, so we bind it to the exact payment order — no CPF/CNPJ lookup needed and no ambiguity if multiple customers send the same amount at the same time.

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
