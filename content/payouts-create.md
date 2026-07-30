---
title: Create a Payout
nav_order: 2
parent: Money Out
---

# Create a Payout

`POST /payouts`

Creates a payout from the available balance of the source currency and sends it to a beneficiary through the selected destination and rail.

> Before creating a payout, make sure your account has sufficient available balance in the source currency.

---

## Request

```http
POST /payouts
Authorization: Bearer <API_KEY>
Content-Type: application/json
Idempotency-Key: <unique-key>
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string. Amount to send from the pre-funded account. |
| `currency` | string | ✅ | Source currency. For Venezuela examples, use `USDT`. |
| `externalId` | string | — | Your business reference. Returned in the payout response. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | ✅ | Identity and contact data of the sender for the Venezuela corridor. |

### `destination` object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | string | ✅ | Destination country code. Use `VE`. |
| `beneficiary` | object | ✅ | Beneficiary identity and contact details. |
| `rail` | object | ✅ | Delivery method for the payout. |

### `beneficiary` object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Beneficiary full name. |
| `rif` | string | ✅ | Venezuelan RIF or document identifier. |
| `mobile` | string | depends | Phone number required for mobile payment. |

### `rail` object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Supported rail: `ve_bank_account` or `ve_mobile_payment`. |
| `bankCode` | string | ✅ | Bank code used by the selected rail. |
| `accountNumber` | string | depends | Bank account number required for bank transfer. |

### `remitter` object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identification` | string | ✅ | Sender identification number. |
| `firstName` | string | ✅ | Sender first name. |
| `lastName` | string | ✅ | Sender last name. |
| `birthDate` | string | ✅ | Sender date of birth in `YYYY-MM-DD` format. |
| `nationality` | string | ✅ | Sender nationality code. |
| `mobile` | string | ✅ | Sender mobile phone. |
| `address` | string | ✅ | Sender address. |
| `email` | string | ✅ | Sender email address. |

> The exact fields required in the destination object vary by country, currency, corridor, rail, beneficiary type, and compliance rules.

---

## Examples

The examples below show the current request shape for each supported corridor. The specific fields required for your account may differ depending on the corridor and rail.

<div class="country-ve">

### Venezuela — quote

```http
GET /payouts/rates?fromCurrency=USDT&toCurrency=VES&amount=25.00
Authorization: Bearer <API_KEY>
```

```json
{
  "fromCurrency": "USDT",
  "amount": "25.00",
  "destCurrency": "VES",
  "fixedFee": "0.60",
  "amountToConvert": "24.40",
  "exchangeRate": "36.1355",
  "destinationAmount": "881.71",
  "indicativeAt": "2026-07-22T15:00:00Z"
}
```

### Venezuela — bank transfer

```json
{
  "amount": "25.00",
  "currency": "USDT",
  "externalId": "order-123",
  "destination": {
    "country": "VE",
    "beneficiary": {
      "name": "María González",
      "rif": "V40001469"
    },
    "rail": {
      "type": "ve_bank_account",
      "bankCode": "0102",
      "accountNumber": "01020305810000263562"
    }
  },
  "remitter": {
    "identification": "V201234567",
    "firstName": "Juan",
    "lastName": "Pérez",
    "birthDate": "1985-06-15",
    "nationality": "ARG",
    "mobile": "04141234567",
    "address": "Buenos Aires, Argentina",
    "email": "remitente@example.com"
  }
}
```

### Venezuela — mobile payment

```json
{
  "amount": "10.00",
  "currency": "USDT",
  "externalId": "order-456",
  "destination": {
    "country": "VE",
    "beneficiary": {
      "name": "Wil Barragán",
      "rif": "V27127416",
      "mobile": "+58 424 2005748"
    },
    "rail": {
      "type": "ve_mobile_payment",
      "bankCode": "0175"
    }
  },
  "remitter": {
    "identification": "V201234567",
    "firstName": "Juan",
    "lastName": "Pérez",
    "birthDate": "1985-06-15",
    "nationality": "ARG",
    "mobile": "04141234567",
    "address": "Buenos Aires, Argentina",
    "email": "remitente@example.com"
  }
}
```

</div>

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
    "taxId": "20234567897"
  },
  "externalId": "order-1001"
}
```

</div>

<div class="country-br">

### Brasil (BRL / PIX)

```json
{
  "amount": "150.00",
  "currency": "BRL",
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "name": "João Silva"
  },
  "externalId": "order-2001"
}
```

</div>

---

## Response

A successful request returns a payout resource. The Venezuela corridor also includes currency conversion values such as `destCurrency`, `fixedFee`, `amountToConvert`, `exchangeRate`, and `destinationAmount`.

<div class="country-ve">

```json
{
  "id": "9ca35a0b-1097-464c-91ea-c0bbcb3d8dd8",
  "accountId": "account_123",
  "merchantId": "merchant_123",
  "externalId": "order-123",
  "amount": "25.00",
  "currency": "USDT",
  "destCurrency": "VES",
  "destinationCurrency": "VES",
  "fixedFee": "0.60",
  "amountToConvert": "24.40",
  "exchangeRate": "36.1355",
  "destinationAmount": "881.71",
  "destination": {
    "country": "VE",
    "beneficiary": {
      "name": "María González",
      "rif": "V40001469"
    },
    "rail": {
      "type": "ve_bank_account",
      "bankCode": "0102",
      "accountNumber": "01020305810000263562"
    }
  },
  "status": "processing",
  "bankSystemTrxId": "1608460",
  "attempts": 1,
  "createdAt": "2026-07-22T15:00:00Z"
}
```

</div>

<div class="country-ar">

```json
{
  "id": "de598197-bb56-4a92-af5c-f4929a84ed1a",
  "merchantId": "acme_ars_merch1",
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "taxId": "20234567897",
    "taxIdCountry": "AR",
    "name": "Ana Martínez"
  },
  "status": "pending",
  "attempts": 0,
  "createdAt": "2026-03-11T23:01:17Z"
}
```

</div>

<div class="country-br">

```json
{
  "id": "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  "merchantId": "acme_br_merch1",
  "amount": "150.00",
  "currency": "BRL",
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "taxId": "12345678901",
    "taxIdCountry": "BR",
    "name": "João Silva"
  },
  "status": "pending",
  "attempts": 0,
  "createdAt": "2026-03-11T23:01:17Z"
}
```

</div>

---

## Error responses

| Status | Code | Cause |
|--------|------|-------|
| `400` | `invalid_request` | Missing or malformed field. |
| `401` | `unauthorized` | Missing or invalid API key. |
| `402` | `insufficient_balance` | Available balance is too low. |
| `403` | `payout_not_enabled` | Payouts are not enabled for this merchant. |
| `409` | `idempotency_key_reused` | The same `Idempotency-Key` was reused with a different body. |

---

## Idempotency

Include an `Idempotency-Key` header to safely retry without creating duplicates:

```http
Idempotency-Key: payout-2026-03-11-order-1001
```

Reusing the same key with the same body returns the original payout. Reusing it with a different body returns `409 Conflict`.
