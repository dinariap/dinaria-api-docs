---
title: Step-by-Step Payment Example
nav_order: 17
parent: Guides
---

# Step-by-step payment example

A complete minimal flow: register webhook, create a payment, instruct the customer, and confirm the final status.

---

## 1. Set your environment

```bash
BASE_URL="https://pay.dinaria.com"
API_KEY="di_live_your_api_key"
```

---

## 2. Register your webhook URL (one-time)

```bash
curl -X POST "$BASE_URL/webhooks/payments" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookUrl": "https://merchant.example/webhooks/payments"
  }'
```

**Response — save the secret, shown only once:**

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments",
  "webhookSecret": "whsec_9f3c2a1b7d5e4c3a...",
  "createdAt": "2026-01-16T18:00:00Z"
}
```

---

## 3. Create a payment

`POST /payments`

<div class="country-ar">

### Argentina (ARS)

```bash
curl -X POST "$BASE_URL/payments" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "amount": "1500.00",
    "currency": "ARS",
    "externalId": "ORD-1001",
    "customer": {
      "name": "Juan Pérez",
      "documentNumber": "20234567897"
    },
    "successUrl": "https://merchant.example/success",
    "cancelUrl": "https://merchant.example/cancel"
  }'
```

**Response:**

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "status": "started",
  "amount": "1500.00",
  "currency": "ARS",
  "externalId": "ORD-1001",
  "paymentData": {
    "type": "bank_transfer",
    "cbu": "4310009922100000122004",
    "alias": "DINARIA.ARS",
    "reference": "9032000000000000023"
  }
}
```

Display `paymentData.cbu` (or `paymentData.alias`) and `paymentData.reference` to the customer. Instruct them to initiate a bank transfer to that CBU/CVU and include the reference in the transfer description.

</div>

<div class="country-br">

### Brasil (BRL)

```bash
curl -X POST "$BASE_URL/payments" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "amount": "100.00",
    "currency": "BRL",
    "externalId": "ORD-1001",
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
  "status": "started",
  "amount": "100.00",
  "currency": "BRL",
  "externalId": "ORD-1001",
  "paymentData": {
    "type": "pix_transfer",
    "pixKey": "bc8ba248-fb33-4022-bea1-c9fab2efd341",
    "pixKeyType": "random",
    "reference": "f90c7c31-7a38-46dc-99ba-188a4c99da29"
  }
}
```

Display `paymentData.pixKey` to the customer. Instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description. There is no redirect for BRL.

</div>

---

## 4. Simulate confirmation (sandbox only)

> **Sandbox only** — skip this step in production. Real customers complete the bank transfer or PIX payment; you confirm via webhook or poll.

Set the sandbox base URL and use the `transactionId` from step 3:

```bash
SANDBOX_URL="https://api.sandbox.dinaria.com"
TRANSACTION_ID="f90c7c31-7a38-46dc-99ba-188a4c99da29"
```

<div class="country-ar">

### Argentina — simulate inbound transfer

```bash
curl -X POST "$SANDBOX_URL/sandbox/payments/$TRANSACTION_ID/receive" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

An empty body drives the payment to `confirmed` using the payment's own `amount` and `customer.documentNumber`. See [Sandbox: Simulate a Pay-in](19_sandbox_cashin_simulation.md) for override fields.

</div>

<div class="country-br">

### Brasil — simulate PIX deposit

```bash
curl -X POST "$SANDBOX_URL/trf/cashin/simulate" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "BRL",
    "externalId": "ORD-1001",
    "taxId": "12345678901",
    "payerName": "João Silva"
  }'
```

`externalId` and `taxId` must match the values you sent in step 3. Wait ~10 seconds for the reconciler to confirm.

</div>

---

## 5. Confirm the final status

Do **not** rely on redirects for confirmation. Use webhooks (recommended) or poll:

```bash
curl "$BASE_URL/payments/f90c7c31-7a38-46dc-99ba-188a4c99da29" \
  -H "Authorization: Bearer $API_KEY"
```

---

## 6. Handle the webhook

Your server receives `POST` to your registered webhook URL:

<div class="country-ar">

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "1500.00",
  "currency": "ARS"
}
```

</div>

<div class="country-br">

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "100.00",
  "currency": "BRL"
}
```

</div>

Verify signatures using `X-Webhook-Timestamp` and `X-Webhook-Signature`. Signed payload format:

```
<timestamp>.<raw_body>
```

---

## 7. Idempotency and retries

- Webhooks are delivered **at least once** — use `transactionId` to deduplicate.
- Process asynchronously and return HTTP 200 quickly.
- Use `Idempotency-Key` on payment creation to safely retry on network errors.
