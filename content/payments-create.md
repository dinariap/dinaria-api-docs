---
title: Create a Payment
nav_order: 2
parent: Money In
---

# Create a Payment

```http
POST https://api.sandbox.dinaria.com/v2/payments
Authorization: Bearer <YOUR_API_KEY>
Idempotency-Key: <UNIQUE_IDEMPOTENCY_KEY>
Content-Type: application/json
```

All amounts are decimal strings such as `"1500.00"`, never JSON floating-point numbers.

Select Argentina or Brasil in the country switcher to display the corresponding request and response examples. Binance Pay remains available as a separate provider-specific example built on this same Payments V2 contract.

## Request fields

| Field | Required | Description |
|---|---:|---|
| `externalId` | yes | Stable order identifier in your system. |
| `amount` | yes | Positive decimal string. |
| `currency` | yes | Supported currency or asset code. |
| `paymentMethod` | yes | Requested method, such as `crypto_payment`, `qr`, `bank_transfer`, or `card`. |
| `customer` | yes | Payer information. Base fields are `type`, `externalId`, and `country`. |
| `merchantId` | conditional | Only when an account-scoped credential cannot infer the merchant. |
| `rail` | no | Requested processing rail within the selected `paymentMethod`. Omit it when Dinaria should infer the compatible rail. |
| `destinationMode` | no | `single_use` or `reusable`. |
| `description` | no | Description associated with the order. |
| `successUrl` | no | Customer return URL after a successful user experience. |
| `cancelUrl` | no | Customer return URL after cancellation. |
| `expirationDate` | no | Requested ISO 8601 expiration, when supported. |
| `metadata` | no | Client-owned information returned unchanged. |

### Payment method versus rail

`paymentMethod` selects the general way the payer will pay, while `rail` optionally narrows that request to a compatible processing network or local scheme.

For example, a payment could request `paymentMethod: bank_transfer` and, in a corridor that supports it, `rail: spei`. When a method has only one compatible rail—or when Dinaria should choose transparently—omit `rail`.

Do not confuse the request field with:

- `paymentData.type`: the structure returned to complete the payment, such as `redirect` or `bank_transfer`.
- `paymentData.bankTransfer.rail`: the rail resolved in returned bank-transfer instructions.

Only send a `rail` explicitly supported for the merchant, country, currency, and `paymentMethod`. The base OpenAPI does not publish a universal rail enum because compatibility depends on the active corridor.

## Customer

Individual:

```json
{
  "type": "individual",
  "externalId": "customer-123",
  "firstName": "Sebastian",
  "lastName": "Gonzalez",
  "email": "sebastian@example.com",
  "phone": "+59899123456",
  "country": "UY",
  "state": "UY-MO",
  "city": "Montevideo",
  "address": "18 de Julio 1234",
  "zipcode": "11200",
  "documentType": "CI",
  "documentNumber": "12345678",
  "documentCountry": "UY"
}
```

Business:

```json
{
  "type": "business",
  "externalId": "company-456",
  "legalName": "Example Company S.A.",
  "email": "payments@example.com",
  "phone": "+59829000000",
  "country": "UY",
  "documentType": "RUT",
  "documentNumber": "211234560019",
  "documentCountry": "UY"
}
```

`customer.externalId` is your stable customer identifier and can be an email if that is your established identifier. It is not necessarily an identity document. Additional fields depend on method, country, and risk rules. Use the dedicated customer fields instead of putting personal data in `metadata`.

## Examples by country

> **The fields shown in these examples are for demonstration purposes and may vary depending on the use case.**

All examples use the same `POST /v2/payments` endpoint and require `Authorization`, `Idempotency-Key`, and `Content-Type: application/json`. The country examples illustrate currently supported request shapes; availability still depends on the merchant configuration.

<div class="country-ar">

### Argentina — bank transfer

#### Individual identified by CUIT

```json
{
  "externalId": "ORD-AR-1001",
  "amount": "1500.00",
  "currency": "ARS",
  "paymentMethod": "bank_transfer",
  "customer": {
    "type": "individual",
    "externalId": "customer-ar-1001",
    "firstName": "Ana",
    "lastName": "Martínez",
    "country": "AR",
    "documentType": "CUIT",
    "documentNumber": "20221370075",
    "documentCountry": "AR"
  },
  "metadata": {
    "orderId": "ORD-AR-1001"
  }
}
```

#### Individual identified by DNI

```json
{
  "externalId": "ORD-AR-1002",
  "amount": "500.00",
  "currency": "ARS",
  "paymentMethod": "bank_transfer",
  "customer": {
    "type": "individual",
    "externalId": "customer-ar-1002",
    "firstName": "María",
    "lastName": "López",
    "country": "AR",
    "documentType": "DNI",
    "documentNumber": "22137007",
    "documentCountry": "AR"
  }
}
```

</div>

<div class="country-br">

### Brasil

#### Instant bank transfer — CPF

```json
{
  "externalId": "ORD-BR-2001",
  "amount": "100.00",
  "currency": "BRL",
  "paymentMethod": "instant_bank_transfer",
  "customer": {
    "type": "individual",
    "externalId": "customer-br-2001",
    "firstName": "João",
    "lastName": "Silva",
    "country": "BR",
    "documentType": "CPF",
    "documentNumber": "12345678901",
    "documentCountry": "BR"
  },
  "metadata": {
    "orderId": "ORD-BR-2001"
  }
}
```

#### Instant bank transfer — CNPJ

```json
{
  "externalId": "ORD-BR-2002",
  "amount": "250.00",
  "currency": "BRL",
  "paymentMethod": "instant_bank_transfer",
  "customer": {
    "type": "business",
    "externalId": "company-br-2002",
    "legalName": "Belo Brasil Ltda",
    "country": "BR",
    "documentType": "CNPJ",
    "documentNumber": "58084921000160",
    "documentCountry": "BR"
  }
}
```

#### Dynamic PIX QR

```json
{
  "externalId": "ORD-BR-2003",
  "amount": "100.00",
  "currency": "BRL",
  "paymentMethod": "pix_qr",
  "customer": {
    "type": "business",
    "externalId": "company-br-2003",
    "legalName": "Belo Brasil Ltda",
    "country": "BR",
    "documentType": "CNPJ",
    "documentNumber": "58084921000160",
    "documentCountry": "BR"
  },
  "metadata": {
    "orderId": "ORD-BR-2003"
  }
}
```

</div>

## Response

Both successful responses return the same Payment representation:

| HTTP | Meaning |
|---:|---|
| `201 Created` | A new payment was created and the response contains that Payment resource. |
| `200 OK` | No new payment was created. Dinaria recognized an identical replay using the same `Idempotency-Key`, returns the original Payment, and includes `Idempotent-Replayed: true`. |

Reusing the same key with a different body returns `409 Conflict`.

<div class="country-ar">

### Argentina response

```json
{
  "transactionId": "a3f7c821-4b2e-4c1a-9d3f-7e8b9c0d1e2f",
  "externalId": "ORD-AR-1001",
  "status": "started",
  "amount": "1500.00",
  "currency": "ARS",
  "paymentMethod": "bank_transfer",
  "creationDate": "2026-09-09T18:30:00Z",
  "expirationDate": "2026-09-09T19:30:00Z",
  "actionUrl": "https://pay.sand.dinaria.com/checkout/cs_ar_public_token",
  "customer": {
    "type": "individual",
    "externalId": "customer-ar-1001",
    "firstName": "Ana",
    "lastName": "Martínez",
    "country": "AR",
    "documentType": "CUIT",
    "documentNumber": "20221370075",
    "documentCountry": "AR"
  },
  "metadata": { "orderId": "ORD-AR-1001" },
  "paymentData": {
    "type": "bank_transfer",
    "bankTransfer": {
      "rail": "ar_bank_transfer",
      "destinationMode": "reusable",
      "destination": {
        "accountIdentifier": {
          "type": "cbu",
          "value": "4310009922100000122004"
        },
        "accountHolder": { "name": "Dinaria" }
      },
      "transferReference": "9032000000000000023"
    }
  }
}
```

</div>

<div class="country-br">

### Brasil response

```json
{
  "transactionId": "3d99d177-aa3f-4b34-9e1d-8d5b69e0c1b1",
  "externalId": "ORD-BR-2003",
  "status": "started",
  "amount": "100.00",
  "currency": "BRL",
  "paymentMethod": "pix_qr",
  "creationDate": "2026-09-09T18:30:00Z",
  "expirationDate": "2026-09-09T18:45:00Z",
  "actionUrl": "https://pay.sand.dinaria.com/checkout/cs_br_public_token",
  "customer": {
    "type": "business",
    "externalId": "company-br-2003",
    "legalName": "Belo Brasil Ltda",
    "country": "BR",
    "documentType": "CNPJ",
    "documentNumber": "58084921000160",
    "documentCountry": "BR"
  },
  "metadata": { "orderId": "ORD-BR-2003" },
  "paymentData": {
    "type": "qr",
    "qr": {
      "qrCodeString": "00020101021243430010ar.com.pvs0105...6304B081",
      "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "qrExpiresAt": "2026-08-17T21:04:04Z"
    }
  }
}
```

</div>

`creationDate`, `expirationDate`, `actionUrl`, and `paymentData` are part of the common resource. Method-specific expiration fields, such as `qrExpiresAt`, live inside their corresponding instructions.

## Payment data variants

### Bank transfer

```json
{
  "type": "bank_transfer",
  "bankTransfer": {
    "rail": "spei",
    "destinationMode": "single_use",
    "destination": {
      "accountIdentifier": { "type": "clabe", "value": "646180157034181180" },
      "accountHolder": { "name": "Dinaria" }
    },
    "transferReference": "ORDER-1002"
  }
}
```

`accountIdentifier.type` depends on country and rail. `transferReference` appears only when the payer must use one; there is no generic reference field for every method.

### QR

```json
{
  "type": "qr",
  "qr": {
    "qrCodeString": "00020101021243430010ar.com.pvs0105...6304B081",
    "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "qrExpiresAt": "2026-08-17T21:04:04Z"
  }
}
```

Use `qrCodeString` to render or copy the QR payload. `qrCodeBase64` can be displayed directly, and `qrExpiresAt` is the expiration of these instructions. An optional `format` can identify the QR format when provided.

### Cash

```json
{ "type": "cash", "cash": { "paycode": "1234567890" } }
```

### Card

```json
{
  "type": "card",
  "card": {
    "sessionToken": "session_public_token",
    "sdk": "provider-neutral-sdk"
  }
}
```

## Idempotency

`Idempotency-Key` identifies the technical attempt; `externalId` identifies the business order. After a timeout, repeat exactly the same body with the same key. An identical replay returns `200 OK`, the original Payment, and `Idempotent-Replayed: true`. Reusing the key with a different body returns `409 Conflict`. Generating a new key while the outcome is unknown can create a second payment.

## Errors

Errors use the common shape:

```json
{
  "code": "invalid_request",
  "message": "amount must be a positive decimal string",
  "requestId": "req-01J7A8JH7MY2V9KQ4X1G7EMD8P"
}
```

Create can return `400`, `401`, `403`, `409`, `422`, or `503`. Retain `requestId` for support and troubleshooting.
