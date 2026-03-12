---
title: 15 Minute Integration
nav_order: 41
---

# 15 Minute Integration

A complete end-to-end integration walkthrough.

Dinaria separates receiving funds from sending funds:

**Pay-in → Balance → Payout**

Payouts may also be executed from pre-funded balances.

---

# Part 1 — Pay-in (Receive money)

## Step 1 — Create a payment

`POST /payments`

<div class="country-ar">

### Argentina (ARS)

```json
{
  "amount": "1500.00",
  "currency": "ARS",
  "externalId": "ORD-1001",
  "customer": {
    "name": "Juan Pérez",
    "documentNumber": "20123456789"
  }
}
```

**Response:**

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "status": "started",
  "amount": "1500.00",
  "currency": "ARS",
  "actionUrl": "https://pay.dinaria.com/checkout/f90c7c31-7a38-46dc-99ba-188a4c99da29"
}
```

Redirect the customer to `actionUrl`. The hosted page displays the CBU/CVU and a reference number to include in the bank transfer description.

</div>

<div class="country-br">

### Brasil (BRL)

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

**Response:**

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "status": "started",
  "amount": "100.00",
  "currency": "BRL",
  "paymentData": {
    "type": "pix_transfer",
    "pixKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "pixKeyType": "random",
    "reference": "f90c7c31-7a38-46dc-99ba-188a4c99da29"
  }
}
```

Display `paymentData.pixKey` to the customer. Instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description. The payment is matched automatically once received.

</div>

---

## Step 2 — Wait for confirmation

Listen for the webhook event or poll `GET /payments/{transactionId}`:

```
payment.status_changed  (status: "confirmed")
```

Never rely solely on a redirect — always confirm via webhook or API poll.

---

# Part 2 — Payout (Send money)

Requires a **merchant-scoped API key** with payouts enabled.

## Step 1 — Send a payout

`POST /payouts`

<div class="country-ar">

### Argentina (ARS)

```json
{
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "name": "Ana Martínez",
    "taxId": "20123456789"
  }
}
```

**Response:**

```json
{
  "id": "de598197-bb56-4a92-af5c-f4929a84ed1a",
  "accountId": "your_account",
  "merchantId": "your_merchant",
  "amount": "1500.00",
  "currency": "ARS",
  "status": "pending",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "name": "Ana Martínez",
    "taxId": "20123456789"
  },
  "createdAt": "2026-01-01T12:00:00Z"
}
```

ARS payouts are processed synchronously — status moves from `pending` to `completed` once dispatched.

</div>

<div class="country-br">

### Brasil (BRL)

```json
{
  "amount": "100.00",
  "currency": "BRL",
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "name": "João Silva"
  }
}
```

**Response:**

```json
{
  "id": "a1b2c3d4-0000-0000-0000-aabbccddeeff",
  "accountId": "your_account",
  "merchantId": "your_merchant",
  "amount": "100.00",
  "currency": "BRL",
  "status": "pending",
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "name": "João Silva",
    "taxId": "12345678901",
    "taxIdCountry": "BR"
  },
  "createdAt": "2026-01-01T12:00:00Z"
}
```

BRL payouts are **asynchronous** — status moves to `processing` after submission, then `completed` once the PIX network confirms (typically within seconds).

**Supported `identifierType` values for BRL:**

| Type | Description |
|---|---|
| `pix_key_cpf` | Recipient's CPF (11 digits) |
| `pix_key_cnpj` | Recipient's CNPJ (14 digits) |
| `pix_key_phone` | Phone number (`+5511999999999`) |
| `pix_key_email` | Email address |
| `pix_key_random` | Random PIX key (UUID format) |

For `pix_key_phone`, `pix_key_email`, and `pix_key_random`, `taxId` is required.

</div>

---

## Step 2 — Monitor payout completion

Listen for the webhook event or poll `GET /payouts/{id}`:

```
payout.status_changed  (status: "completed")
```

---

## Step 3 — Check your balance

`GET /balance`

```json
{
  "accountId": "your_account",
  "balances": [
    { "currency": "ARS", "balance": "12500.00" },
    { "currency": "BRL", "balance": "500.00" }
  ]
}
```
