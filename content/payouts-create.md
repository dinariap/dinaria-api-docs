---
title: Create a Payout
nav_order: 2
parent: Money Out
---

# Create a Payout

`POST /v2/payouts`

Creates a payout from the available balance of the source currency and sends it to a beneficiary through the selected destination and rail.

> Before creating a payout, make sure your account has sufficient available balance in the source currency.

---

## Request

```http
POST https://api.sandbox.dinaria.com/v2/payouts
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
Idempotency-Key: <UNIQUE_IDEMPOTENCY_KEY>
```

### Fields

<div class="country-ve">

#### Venezuela

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | object | ✅ | Amount and currency debited from the available balance. |
| `source.amount` | string | ✅ | Decimal string. Use strings for all monetary amounts. |
| `source.currency` | string | ✅ | Use `USDT` for the Venezuela corridor. |
| `externalId` | string | ✅ | Stable business reference assigned by your system. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | depends | Sender identity and contact data. Always required for remittance use cases. |

</div>

<div class="country-ar">

#### Argentina

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | object | ✅ | Amount and currency debited from the available balance. |
| `source.amount` | string | ✅ | Decimal string. Use strings for all monetary amounts. |
| `source.currency` | string | ✅ | Use `ARS` for this example. |
| `externalId` | string | ✅ | Stable business reference assigned by your system. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | depends | Sender identity and contact data. Always required for remittance use cases. |

</div>

<div class="country-br">

#### Brazil

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | object | ✅ | Amount and currency debited from the available balance. |
| `source.amount` | string | ✅ | Decimal string. Use strings for all monetary amounts. |
| `source.currency` | string | ✅ | Use `BRL` for this example. |
| `externalId` | string | ✅ | Stable business reference assigned by your system. |
| `destination` | object | ✅ | Describes the destination country, beneficiary, and delivery rail. |
| `remitter` | object | depends | Sender identity and contact data. Always required for remittance use cases. |

</div>

### `destination` object

<div class="country-ve">

#### Venezuela

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | string | ✅ | Destination country code. Use `VE`. |
| `currency` | string | ✅ | Destination currency. Use `VES`. |
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
| `documentType` | string | — | Optional beneficiary document type. When provided, use `RIF`. |
| `documentNumber` | string | — | Optional beneficiary RIF number. |
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

The `remitter` object is required when the payout is a remittance. For other use cases, whether it is required depends on the corridor and compliance rules. The exact required identity fields are corridor-specific.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | depends | `individual` or `business`. |
| `documentType` | string | depends | Sender document type. |
| `documentNumber` | string | depends | Sender document number. |
| `firstName` | string | depends | Sender first name. |
| `lastName` | string | depends | Sender last name. |
| `birthDate` | string | — | Sender date of birth in `YYYY-MM-DD` format. |
| `nationality` | string | — | Sender nationality code. |
| `mobile` | string | — | Sender mobile phone. |
| `address` | string | — | Sender address. |
| `email` | string | — | Sender email address. |

> The exact fields required in the destination object vary by country, currency, corridor, rail, beneficiary type, and compliance rules.

---

## Examples

> **The fields shown in these examples are for demonstration purposes and may vary depending on the use case.**

The examples below show payout request bodies for each supported corridor. The specific fields required for your account may differ depending on the corridor and rail.

<div class="country-ve">

### Venezuela — remittance flow

Remittance payouts to Venezuela can convert the funded `USDT` amount into `VES` for the beneficiary. The `remitter` object is required for this use case. Create the payout using one of the supported delivery rails.

##### Bank account

```json
{
  "externalId": "PAYOUT-VE-BANK-1001",
  "source": {
    "amount": "25.00",
    "currency": "USDT"
  },
  "destination": {
    "country": "VE",
    "currency": "VES",
    "beneficiary": {
      "type": "individual",
      "name": "Maria Gonzalez",
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
    "type": "individual",
    "documentType": "DNI",
    "documentNumber": "30123456",
    "firstName": "Juan",
    "lastName": "Perez",
    "birthDate": "1985-06-15",
    "nationality": "ARG",
    "mobile": "+5491112345678",
    "address": "Buenos Aires, Argentina",
    "email": "juan@example.com"
  },
  "description": "Bank payout to beneficiary",
  "metadata": {
    "customerId": "customer-456"
  }
}
```

##### Mobile payment

```json
{
  "externalId": "PAYOUT-1001",
  "source": {
    "amount": "1.00",
    "currency": "USDT"
  },
  "destination": {
    "country": "VE",
    "currency": "VES",
    "beneficiary": {
      "type": "individual",
      "name": "Maria Gonzalez",
      "documentType": "RIF",
      "documentNumber": "V27127416",
      "mobile": "+584242005748",
      "email": "maria@example.com"
    },
    "rail": {
      "type": "ve_mobile_payment",
      "bankCode": "0102"
    }
  },
  "remitter": {
    "type": "individual",
    "documentType": "DNI",
    "documentNumber": "30123456",
    "firstName": "Juan",
    "lastName": "Perez",
    "birthDate": "1985-06-15",
    "nationality": "ARG",
    "mobile": "+5491112345678",
    "address": "Buenos Aires, Argentina",
    "email": "juan@example.com"
  },
  "description": "Payment to beneficiary",
  "metadata": {
    "customerId": "customer-456"
  }
}
```

##### Cash

```json
{
  "source": { "amount": "10.00", "currency": "USDT" },
  "externalId": "order-cash-789",
  "destination": {
    "country": "VE",
    "currency": "VES",
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
    "type": "individual",
    "documentType": "DNI",
    "documentNumber": "30123456",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

</div>

<div class="country-ar">

### Argentina

#### CBU

```json
{
  "source": { "amount": "1500.00", "currency": "ARS" },
  "externalId": "order-ar-cbu-123",
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "beneficiary": {
      "name": "María González",
      "documentType": "CUIT",
      "documentNumber": "27-12345678-5"
    },
    "rail": {
      "type": "ar_cbu",
      "cbu": "0070327530004025541644"
    }
  }
}
```

#### CVU

```json
{
  "source": { "amount": "1500.00", "currency": "ARS" },
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

#### Alias

```json
{
  "source": { "amount": "200.00", "currency": "ARS" },
  "externalId": "payout-ar-alias-123",
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "beneficiary": {
      "name": "María González",
      "documentType": "CUIT",
      "documentNumber": "27-12345678-5"
    },
    "rail": {
      "type": "ar_alias",
      "alias": "mialias"
    }
  }
}
```

</div>

<div class="country-br">

### Brasil (BRL / PIX)

#### CPF key

```json
{
  "source": { "amount": "150.00", "currency": "BRL" },
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

#### Random key (EVP)

```json
{
  "source": { "amount": "75.50", "currency": "BRL" },
  "externalId": "payout-br-evp-123",
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
        "type": "evp",
        "value": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      }
    }
  }
}
```

</div>

---

## Response

Both successful responses return the same Payout resource, but they describe different outcomes:

| HTTP | Meaning |
|---:|---|
| `201 Created` | A new payout was created and durably accepted for asynchronous processing. This does not mean that the beneficiary has received the funds. |
| `200 OK` | No new payout was created. Dinaria recognized an identical replay using the same `Idempotency-Key`, returns the original payout, and includes `Idempotent-Replayed: true`. |

Reusing the key with a different body returns `409 Conflict`.

<div class="country-ve">

For the Venezuela remittance flow, the response can include the converted destination `amount` and the `pricing` details used for the `USDT` to `VES` conversion.

```json
{
  "payoutId": "9ca35a0b-1097-464c-91ea-c0bbcb3d8dd8",
  "externalId": "PAYOUT-VE-BANK-1001",
  "source": { "amount": "25.00", "currency": "USDT" },
  "destination": {
    "country": "VE",
    "currency": "VES",
    "amount": "881.71",
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
  "pricing": {
    "fixedFee": "0.60",
    "amountToConvert": "24.40",
    "exchangeRate": "36.1355"
  },
  "status": "processing",
  "bankSystemTrxId": "1608460",
  "creationDate": "2026-09-10T20:00:00Z"
}
```

</div>

<div class="country-ar">

```json
{
  "payoutId": "de598197-bb56-4a92-af5c-f4929a84ed1a",
  "externalId": "PAYOUT-AR-1001",
  "source": { "amount": "1500.00", "currency": "ARS" },
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
  "status": "processing",
  "creationDate": "2026-09-10T20:00:00Z"
}
```

</div>

<div class="country-br">

```json
{
  "payoutId": "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  "source": { "amount": "150.00", "currency": "BRL" },
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
  "status": "processing",
  "creationDate": "2026-09-10T20:00:00Z"
}
```

</div>

---

## Error responses

| Status | Code | Cause |
|--------|------|-------|
| `400` | `invalid_request` | Missing or malformed field. |
| `401` | `unauthorized` | Missing or invalid API key. |
| `403` | `payout_not_enabled` | Payouts are not enabled for this merchant. |
| `409` | `idempotency_key_reused` | The same `Idempotency-Key` was reused with a different body. |

---

## Idempotency

Include an `Idempotency-Key` header to safely retry without creating duplicates:

```http
Idempotency-Key: payout-2026-03-11-order-1001
```

Reusing the same key with the same body returns the original payout. Reusing it with a different body returns `409 Conflict`.

If the client times out or the payout remains in `processing`, retry only with the same key and exactly the same body. Do not create a replacement payout with a new key while the original result is unresolved.
