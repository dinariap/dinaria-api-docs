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

<div class="country-ve">

#### Venezuela

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string. Amount to send from the pre-funded account. |
| `currency` | string | ✅ | Source currency. Use `USDT` for the Venezuela corridor. |
| `externalId` | string | — | Your business reference. Returned in the payout response. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | depends | Sender identity and contact data. Always required for remittance use cases. |

</div>

<div class="country-ar">

#### Argentina

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string. Amount to send from the pre-funded account. |
| `currency` | string | ✅ | Source currency. Use `ARS` for the Argentina corridor. |
| `externalId` | string | — | Your business reference. Returned in the payout response. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | depends | Sender identity and contact data. Always required for remittance use cases. |

</div>

<div class="country-br">

#### Brazil

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Decimal string. Amount to send from the pre-funded account. |
| `currency` | string | ✅ | Source currency. Use `BRL` for the Brazil corridor. |
| `externalId` | string | — | Your business reference. Returned in the payout response. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | depends | Sender identity and contact data. Always required for remittance use cases. |

</div>

### `destination` object

<div class="country-ve">

#### Venezuela

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | string | ✅ | Destination country code. Use `VE`. |
| `beneficiary` | object | ✅ | Beneficiary identity and contact details. |
| `rail` | object | ✅ | Delivery method for the payout. |

</div>

<div class="country-ar">

#### Argentina

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | string | ✅ | Destination country code. Use `AR`. |
| `currency` | string | ✅ | Destination currency. Use `ARS`. |
| `beneficiary` | object | ✅ | Beneficiary identity details. |
| `rail` | object | ✅ | Delivery method for the payout. |

</div>

<div class="country-br">

#### Brazil

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | string | ✅ | Destination country code. Use `BR`. |
| `currency` | string | ✅ | Destination currency. Use `BRL`. |
| `beneficiary` | object | ✅ | Beneficiary identity details. |
| `rail` | object | ✅ | Delivery method for the payout. |

</div>

### `beneficiary` object

<div class="country-ve">

#### Venezuela

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Beneficiary full name. |
| `documentType` | string | ✅ | Beneficiary document type. Use `RIF`. |
| `documentNumber` | string | ✅ | Beneficiary's RIF number. |
| `mobile` | string | depends | Required when the selected rail is `ve_mobile_payment`. |

</div>

<div class="country-ar">

#### Argentina

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Beneficiary full name. |
| `documentType` | string | ✅ | Beneficiary document type. Generally use `CUIT`. |
| `documentNumber` | string | ✅ | Beneficiary's CUIT number. |

</div>

<div class="country-br">

#### Brazil

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Beneficiary full name or legal entity name. |
| `documentType` | string | ✅ | Beneficiary document type. Use `CPF` for an individual or `CNPJ` for a legal entity. |
| `documentNumber` | string | ✅ | Beneficiary's CPF or CNPJ number. |

</div>

### `rail` object

<div class="country-ve">

#### Venezuela

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Supported rail: `ve_bank_account`, `ve_mobile_payment`, or `ve_cash_pickup`. |
| `bankCode` | string | depends | Required when `type` is `ve_bank_account` or `ve_mobile_payment`. |
| `accountNumber` | string | depends | Bank account number. Required when `type` is `ve_bank_account`. |

##### Bank codes

Use the bank name as the selector label and submit its `code` as `bankCode`. The code must remain a four-character string, including its leading zero. Codes outside this catalog are invalid.

| Code | Bank |
|------|------|
| `0102` | Banco de Venezuela |
| `0104` | Venezolano de Crédito |
| `0105` | Banco Mercantil |
| `0108` | Banco Provincial |
| `0114` | Bancaribe |
| `0115` | Banco Exterior |
| `0128` | Banco Caroní |
| `0134` | Banesco |
| `0137` | Banco Sofitasa |
| `0138` | Banco Plaza |
| `0146` | Bangente |
| `0151` | BFC Banco Fondo Común |
| `0156` | 100% Banco |
| `0157` | Del Sur Banco Universal |
| `0163` | Banco del Tesoro |
| `0166` | Banco Agrícola de Venezuela |
| `0168` | Bancrecer |
| `0169` | R4 Banco |
| `0171` | Banco Activo |
| `0172` | Bancamiga |
| `0173` | Banco Internacional de Desarrollo |
| `0174` | Banplus |
| `0175` | Banco Digital de los Trabajadores |
| `0177` | BANFANB |
| `0178` | N58 Banco Digital |
| `0191` | Banco Nacional de Crédito |
| `0601` | Instituto Municipal de Crédito Popular |
| `3621` | Banco de Comercio Exterior |

</div>

<div class="country-ar">

#### Argentina

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Supported rail: `ar_cbu`, `ar_cvu`, or `ar_alias`. |
| `cbu` | string | depends | Beneficiary's 22-digit CBU. Required when `type` is `ar_cbu`. |
| `cvu` | string | depends | Beneficiary's 22-digit CVU. Required when `type` is `ar_cvu`. |
| `alias` | string | depends | Beneficiary's CBU/CVU alias. Required when `type` is `ar_alias`. |

</div>

<div class="country-br">

#### Brazil

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Use `br_pix` for a PIX payout. |
| `pixKey` | object | ✅ | PIX key used to identify the destination account. |
| `pixKey.type` | string | ✅ | PIX key type: `cpf`, `cnpj`, `email`, `phone`, or `evp`. |
| `pixKey.value` | string | ✅ | PIX key value in the format corresponding to `pixKey.type`. |

</div>

### `remitter` object

The `remitter` object is required when the payout is a remittance. For other use cases, whether it is required depends on the corridor and compliance rules. Within this object, only the sender's identification, first name, and last name are required.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identification` | string | ✅ | Sender identification number. |
| `firstName` | string | ✅ | Sender first name. |
| `lastName` | string | ✅ | Sender last name. |
| `birthDate` | string | — | Sender date of birth in `YYYY-MM-DD` format. |
| `nationality` | string | — | Sender nationality code. |
| `mobile` | string | — | Sender mobile phone. |
| `address` | string | — | Sender address. |
| `email` | string | — | Sender email address. |

> The exact fields required in the destination object vary by country, currency, corridor, rail, beneficiary type, and compliance rules.

---

## Examples

The examples below show payout request bodies for each supported corridor. The specific fields required for your account may differ depending on the corridor and rail.

<div class="country-ve">

### Venezuela — remittance flow

Remittance payouts to Venezuela convert the funded `USDT` amount into `VES` for the beneficiary. The `remitter` object is required for this use case. Complete the flow in two steps.

#### Step 1 — Get an indicative quote

Retrieve the current conversion values before creating the payout.

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

#### Step 2 — Create the payout

Create the payout using one of the supported delivery rails.

##### Bank account

```json
{
  "amount": "25.00",
  "currency": "USDT",
  "externalId": "order-123",
  "destination": {
    "country": "VE",
    "beneficiary": {
      "name": "María González",
      "documentType": "RIF",
      "documentNumber": "V40001469"
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

##### Mobile payment

```json
{
  "amount": "10.00",
  "currency": "USDT",
  "externalId": "order-456",
  "destination": {
    "country": "VE",
    "beneficiary": {
      "name": "Wil Barragán",
      "documentType": "RIF",
      "documentNumber": "V27127416",
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

##### Cash

```json
{
  "amount": "10.00",
  "currency": "USDT",
  "externalId": "order-cash-789",
  "destination": {
    "country": "VE",
    "beneficiary": {
      "name": "María González",
      "documentType": "RIF",
      "documentNumber": "V40001469"
    },
    "rail": {
      "type": "ve_cash_pickup"
    }
  },
  "remitter": {
    "identification": "V201234567",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

</div>

<div class="country-ar">

### Argentina — payout example

```json
{
  "amount": "1500.00",
  "currency": "ARS",
  "externalId": "order-ar-123",
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "beneficiary": {
      "name": "María González",
      "documentType": "CUIT",
      "documentNumber": "27-12345678-5"
    },
    "rail": {
      "type": "ar_cvu",
      "cvu": "2850590940090418135201"
    }
  }
}
```

</div>

<div class="country-br">

### Brasil (BRL / PIX)

```json
{
  "amount": "150.00",
  "currency": "BRL",
  "externalId": "payout-br-123",
  "destination": {
    "country": "BR",
    "currency": "BRL",
    "beneficiary": {
      "name": "João Silva",
      "documentType": "CPF",
      "documentNumber": "12345678901"
    },
    "rail": {
      "type": "br_pix",
      "pixKey": {
        "type": "cpf",
        "value": "12345678901"
      }
    }
  }
}
```

</div>

---

## Response

A successful request returns a payout resource.

<div class="country-ve">

For the Venezuela remittance flow, the payout response includes the `USDT` to `VES` conversion details: `destCurrency`, `fixedFee`, `amountToConvert`, `exchangeRate`, and `destinationAmount`.

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
      "documentType": "RIF",
      "documentNumber": "V40001469"
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
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "beneficiary": {
      "name": "María González",
      "documentType": "CUIT",
      "documentNumber": "27-12345678-5"
    },
    "rail": {
      "type": "ar_cvu",
      "cvu": "2850590940090418135201"
    }
  },
  "status": "pending",
  "createdAt": "2026-03-11T23:01:17Z"
}
```

</div>

<div class="country-br">

```json
{
  "id": "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  "amount": "150.00",
  "currency": "BRL",
  "externalId": "payout-br-123",
  "destination": {
    "country": "BR",
    "currency": "BRL",
    "beneficiary": {
      "name": "João Silva",
      "documentType": "CPF",
      "documentNumber": "12345678901"
    },
    "rail": {
      "type": "br_pix",
      "pixKey": {
        "type": "cpf",
        "value": "12345678901"
      }
    }
  },
  "status": "pending",
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
