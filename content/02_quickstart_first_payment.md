---
title: Quickstart First Payment
nav_order: 4
parent: Guides
---

# Quickstart: your first payment

This quickstart creates a payment, instructs the customer to complete it, and validates the final status.

The payment method is determined automatically based on the `currency` you send and the services activated for your account — no extra configuration needed.

---

## 1. Create a payment

`POST /payments`

<div class="country-ar">

### Argentina (ARS)

```bash
curl -X POST "https://pay.dinaria.com/payments" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 2b1a2b0a-4b2b-4e6a-9c61-7b1b5a7a2f11" \
  -d '{
    "externalId": "ORD-1001",
    "amount": "1500.00",
    "currency": "ARS",
    "successUrl": "https://merchant.example/success",
    "cancelUrl": "https://merchant.example/cancel",
    "customer": {
      "name": "Juan Pérez",
      "documentNumber": "20123456789"
    }
  }'
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
  }
}
```

Store `transactionId`. Display `paymentData.cbu` (or `paymentData.alias`) and `paymentData.reference` to the customer — instruct them to initiate a bank transfer to that CBU/CVU and include the reference in the transfer description.

</div>

<div class="country-br">

### Brasil (BRL)

```bash
curl -X POST "https://pay.dinaria.com/payments" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 2b1a2b0a-4b2b-4e6a-9c61-7b1b5a7a2f11" \
  -d '{
    "externalId": "ORD-1001",
    "amount": "100.00",
    "currency": "BRL",
    "customer": {
      "name": "João Silva",
      "documentNumber": "12345678901"
    }
  }'
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
  }
}
```

Store `transactionId`. Display `paymentData.pixKey` to the customer — instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description.

> **Prefer a QR code?** Pass `"paymentMethod": "pix_qr"` on the same request and the response will carry a per-order dynamic PIX QR (`qrCodeString` + `qrCodeBase64`, valid for 15 minutes) instead of the static key. See [Create a payment](05_payments_create.md) for the full QR flow and rendering tips.

</div>

---

## 2. Confirm final status

Never rely solely on a redirect. Confirm using:

- **Webhooks** (recommended) — listen for `payment.status_changed` with `status: "confirmed"`
- **Polling** — `GET /payments/{transactionId}`

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "status": "confirmed"
}
```
