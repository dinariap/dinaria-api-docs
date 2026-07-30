---
title: Step-by-Step Payment Example
nav_order: 17
parent: Guides
---

# Step-by-step payment example (for merchants)

This guide shows a complete, minimal flow using curl: register webhook, create a payment,
redirect the customer, and confirm the final status.

## 1) Choose your environment
1. Sandbox: `https://api.sandbox.dinaria.com`
2. Production: `https://api.dinaria.com`

Set your base URL and API key once:

```bash
BASE_URL="https://api.sandbox.dinaria.com"
API_KEY="di_test_xxx"
```

Contact support@dinaria.com to request an API key for your account.

## 2) Register your webhook URL (one-time)

```bash
curl -X POST "$BASE_URL/webhooks/payments" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookUrl": "https://merchant.example/webhooks/payments"
  }'
```

**Response (save this!)**
```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments",
  "webhookSecret": "whsec_9f3c2a1b7d5e4c3a...",
  "createdAt": "2026-01-16T18:00:00Z"
}
```

Store `webhookSecret` securely. It is shown only once and is required to verify signatures.

## 3) Create a payment

```bash
curl -X POST "$BASE_URL/payments" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "5.00",
    "currency": "ARS",
    "externalId": "ORD-1001",
    "customer": {
      "name": "Juan Pérez",
      "documentNumber": "20234567897"
    },
    "successUrl": "https://merchant.example/success",
    "cancelUrl": "https://merchant.example/cancel",
    "metadata": {
      "orderId": "ORD-1001"
    }
  }'
```

**Response**
```json
{
  "transactionId": "trx_123456",
  "status": "started",
  "actionUrl": "https://checkout.example/...",
  "externalId": "ORD-1001",
  "metadata": { "orderId": "ORD-1001", "cartId": "CART-7788" }
}
```

## 4) Redirect the customer to pay
Use the `actionUrl` from the response to redirect your customer to complete payment.

**Sandbox note:** simulate confirmation with your API key instead of a real transfer:

```bash
# ARS — empty body uses payment amount + customer document
curl -X POST "$BASE_URL/sandbox/payments/trx_123456/receive" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'

# BRL — externalId and taxId must match the payment
curl -X POST "$BASE_URL/trf/cashin/simulate" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5.00, "currency": "BRL", "externalId": "ORD-1001", "taxId": "20234567897", "payerName": "Juan Pérez"}'
```

See `content/19_sandbox_cashin_simulation.md` in the docs repo for full details.

## 5) Confirm the final status
Do **not** rely on redirects for confirmation. Use webhooks (recommended) or retrieve:

```bash
curl -X GET "$BASE_URL/payments/trx_123456" \
  -H "Authorization: Bearer $API_KEY"
```

## 6) Handle the webhook
Your server receives `POST /webhooks/payments/updates`:

```json
{
  "transactionId": "trx_123456",
  "externalId": "ORD-1001",
  "status": "confirmed",
  "amount": "5.00",
  "currency": "ARS",
  "metadata": { "orderId": "ORD-1001", "cartId": "CART-7788" },
}
```

Verify signatures using:
- `X-Webhook-Timestamp`
- `X-Webhook-Signature`

Signed payload format:
```
<timestamp>.<raw_body>
```

## 7) Idempotency and retries
- Webhooks are delivered **at least once**.
- Store `eventId` (if present) to dedupe.
- Process asynchronously and return HTTP 200 quickly.
