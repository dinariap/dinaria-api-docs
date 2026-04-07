---
title: Quickstart
nav_order: 40
---

# Quickstart

This guide shows the fastest way to start using the Dinaria API.

Dinaria supports two independent capabilities:

- **Payments (Pay-in)** — receive funds from customers
- **Payouts (Money-out)** — send funds to recipients

---

## 1. Authentication

All API requests must include your API key in the `Authorization` header.

```http
Authorization: Bearer di_live_<your-api-key>
Content-Type: application/json
```

---

## 2. Create your first payment

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
    "pixKey": "bc8ba248-fb33-4022-bea1-c9fab2efd341",
    "pixKeyType": "random",
    "reference": "f90c7c31-7a38-46dc-99ba-188a4c99da29"
  }
}
```

Display `paymentData.pixKey` to the customer. Instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description. The payment is matched automatically once received.

</div>

---

## 3. Receive payment confirmation

Listen for the webhook event:

```
payment.status_changed  (status: "confirmed")
```

Always confirm status via webhook or `GET /payments/{transactionId}` — never rely solely on a redirect.

---

## 4. Send your first payout

`POST /payouts`

Requires a **merchant-scoped API key** with payouts enabled.

<div class="country-ar">

### Argentina (ARS)

```json
{
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "name": "Ana Martínez"
  }
}
```

ARS payouts are **synchronous** — status goes directly from `pending` to `completed`.

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

BRL payouts are **asynchronous** — status moves to `processing` after submission, then to `completed` once the PIX network confirms (typically within seconds).

</div>

---

## 5. Receive payout confirmation

Listen for the webhook event:

```
payout.status_changed  (status: "completed")
```
