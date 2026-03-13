---
title: Create a Payout
nav_order: 2
parent: Money Out
---

# Create a Payout

`POST /payouts`

Creates a payout and immediately reserves the amount from your merchant balance. The actual transfer is submitted asynchronously by the background processor.

---

## Request

```http
POST /payouts
Authorization: Bearer di_live_<your-merchant-key>
Content-Type: application/json
Idempotency-Key: <unique-key>
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string, e.g. `"1500.00"`. Must be ≤ merchant balance. |
| `currency` | string | ✅ | `ARS` or `BRL`. |
| `destination` | object | ✅ | Where the funds go. See below. |
| `externalId` | string | — | Your internal reference. Returned in responses. |
| `customerId` | string | — | Link this payout to a saved customer record. |

### `destination` object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identifierType` | string | ✅ | How to route the payout. See country tables below. |
| `identifierValue` | string | ✅ | The key or account number. |
| `taxId` | string | depends | Recipient CUIT (ARS) or CPF/CNPJ (BRL). Required for some PIX key types. |
| `name` | string | — | Recipient name. Auto-resolved for ARS CBU/alias. |

---

## Examples

<div class="country-ar">

### Argentina (ARS)

| `identifierType` | `identifierValue` |
|-------|---------|
| `cbu` | 22-digit CBU or CVU number |
| `alias_cbu` | CBU alias — auto-resolved to real CBU + CUIT |

**CBU:**

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

**Alias (auto-resolved):**

```json
{
  "amount": "200.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "alias_cbu",
    "identifierValue": "mialiascbu"
  }
}
```

The platform resolves the real CBU, CUIT, and name from the alias before submitting.

</div>

<div class="country-br">

### Brasil (BRL / PIX)

| `identifierType` | `identifierValue` | `taxId` required? |
|-------|---|---|
| `pix_key_cpf` | CPF (11 digits) | No — inferred |
| `pix_key_cnpj` | CNPJ (14 digits) | No — inferred |
| `pix_key_email` | Email registered as PIX key | **Yes** |
| `pix_key_phone` | Phone registered as PIX key | **Yes** |
| `pix_key_random` | Random UUID PIX key (EVP) | **Yes** |

> A CNPJ is only valid as a PIX key if the recipient explicitly registered it in their bank. When in doubt, ask the recipient for their registered PIX key type.

**CPF key:**

```json
{
  "amount": "150.00",
  "currency": "BRL",
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "name": "João Silva"
  }
}
```

**Random EVP key:**

```json
{
  "amount": "75.50",
  "currency": "BRL",
  "destination": {
    "identifierType": "pix_key_random",
    "identifierValue": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "taxId": "12345678901",
    "name": "João Silva"
  }
}
```

</div>

---

## Response

Returned immediately in `pending` status. Use `id` to track progress.

<div class="country-ar">

```json
{
  "id": "de598197-bb56-4a92-af5c-f4929a84ed1a",
  "accountId": "acme_ar",
  "merchantId": "acme_ar_merch1",
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "taxId": "20123456789",
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
  "accountId": "acme_br",
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
| `402` | `insufficient_balance` | Merchant balance too low. |
| `403` | `payout_not_enabled` | Payouts not enabled for this merchant. |
| `403` | `forbidden` | Merchant does not belong to your account. |
| `409` | `idempotency_key_reused` | Same `Idempotency-Key` with a different body. |

---

## Idempotency

Include an `Idempotency-Key` header to safely retry without creating duplicates:

```http
Idempotency-Key: payout-2026-03-11-order-1001
```

Reusing the same key with an identical body returns the original payout. Reusing it with a different body returns `409 Conflict`.
