---
title: Create a Payment
parent: Money In
---

# Create a Payment

```http
POST https://sbx.dinaria.com/v2/payments
Authorization: Bearer <API_KEY>
Content-Type: application/json
Idempotency-Key: <UNIQUE_PERSISTED_VALUE>
```

A Payment is a provider-neutral order for receiving funds. `externalId` identifies the order in your system; `Idempotency-Key` identifies the technical creation attempt.

## Request fields

| Field | Required | Description |
|---|---:|---|
| `merchantId` | conditional | Send only with an account credential when Dinaria cannot infer the merchant. |
| `externalId` | yes | Stable order identifier in your system. |
| `amount` | yes | Positive decimal string. |
| `currency` | yes | Currency or configured asset code. |
| `paymentMethod` | yes | General way the customer pays. |
| `rail` | conditional | Country-specific payment rail. It may be inferred when only one compatible rail exists. |
| `destinationMode` | conditional | `single_use` or `reusable`, when supported. |
| `collectionKey` | conditional | Stable opaque merchant key for a reusable Payments destination. It is not an account, document, or transfer reference. |
| `expirationDate` | no | Requested RFC 3339 expiration. |
| `description` | no | Payment description, propagated when supported. |
| `customer` | yes | Payer profile. Required fields vary by country, rail, method, and merchant policy. |
| `metadata` | no | Additional merchant-owned data. Do not use it for routing or reconciliation-critical fields. |

`customer.externalId` identifies the customer in your system; it is not an identity document. When identity data is required, use the `documentType` applicable to the country and configured use case.

The identity fields shown in the following examples are demonstrative. They can vary by country, payment method, merchant policy, and configured use case.

<div class="country-ar">

## Argentina

### Interoperable QR

```json
{
  "externalId": "ORDER-AR-QR-001",
  "amount": "1000.00",
  "currency": "ARS",
  "paymentMethod": "qr",
  "rail": "ar_qr",
  "destinationMode": "single_use",
  "expirationDate": "2026-10-15T20:00:00Z",
  "description": "Compra ORDER-AR-QR-001",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-AR-001",
    "firstName": "Juan",
    "lastName": "Pérez",
    "country": "AR",
    "documentType": "CUIT",
    "documentNumber": "20234567897"
  }
}
```

### Single-use bank transfer

```json
{
  "externalId": "ORDER-AR-BANK-001",
  "amount": "1500.00",
  "currency": "ARS",
  "paymentMethod": "bank_transfer",
  "rail": "ar_bank_transfer",
  "destinationMode": "single_use",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-AR-002",
    "firstName": "Ana",
    "lastName": "Martínez",
    "country": "AR",
    "documentType": "CUIT",
    "documentNumber": "27234567891"
  }
}
```

</div>

<div class="country-mx">

## Mexico — SPEI

Single-use:

```json
{
  "externalId": "ORDER-MX-001",
  "amount": "250.00",
  "currency": "MXN",
  "paymentMethod": "bank_transfer",
  "rail": "spei",
  "destinationMode": "single_use",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-MX-001",
    "firstName": "Juan",
    "lastName": "Pérez",
    "country": "MX",
    "documentType": "CURP",
    "documentNumber": "GOSJ800101HDFNRN09"
  }
}
```

Reusable destination managed by Payments:

```json
{
  "externalId": "ORDER-MX-REUSABLE-001",
  "amount": "250.00",
  "currency": "MXN",
  "paymentMethod": "bank_transfer",
  "rail": "spei",
  "destinationMode": "reusable",
  "collectionKey": "CUSTOMER-MX-001",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-MX-001",
    "firstName": "Juan",
    "lastName": "Pérez",
    "country": "MX",
    "documentType": "CURP",
    "documentNumber": "GOSJ800101HDFNRN09"
  }
}
```

The same compatible merchant and `collectionKey` relationship returns the same destination. It does not necessarily create an administrable Virtual Account.

</div>

<div class="country-cl">

## Chile — bank transfer

Chile uses `single_use`, requires integer CLP amounts, and does not use `collectionKey`.

```json
{
  "externalId": "ORDER-CL-001",
  "amount": "10000",
  "currency": "CLP",
  "paymentMethod": "bank_transfer",
  "rail": "cl_bank_transfer",
  "destinationMode": "single_use",
  "expirationDate": "2026-10-15T20:00:00Z",
  "description": "Transferencia ORDER-CL-001",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-CL-001",
    "firstName": "Juan",
    "lastName": "Pérez",
    "country": "CL",
    "documentType": "RUT",
    "documentNumber": "12345678-5"
  }
}
```

</div>

<div class="country-pe">

## Peru

Use `pe_qr` with `paymentMethod: qr`, or `pe_bank_transfer` with `paymentMethod: bank_transfer`. Both use `single_use`, PEN, and a future `expirationDate`.

### QR

```json
{
  "externalId": "ORDER-PE-QR-001",
  "amount": "100.00",
  "currency": "PEN",
  "paymentMethod": "qr",
  "rail": "pe_qr",
  "destinationMode": "single_use",
  "expirationDate": "2026-10-15T20:00:00-05:00",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-PE-001",
    "firstName": "María",
    "lastName": "Gómez",
    "country": "PE",
    "documentType": "DNI",
    "documentNumber": "12345678"
  }
}
```

### Bank transfer

```json
{
  "externalId": "ORDER-PE-BANK-002",
  "amount": "150.00",
  "currency": "PEN",
  "paymentMethod": "bank_transfer",
  "rail": "pe_bank_transfer",
  "destinationMode": "single_use",
  "expirationDate": "2026-10-15T20:00:00-05:00",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-PE-002",
    "firstName": "Lucía",
    "lastName": "Torres",
    "country": "PE"
  }
}
```

</div>

<div class="country-ec">

## Ecuador — bank transfer

```json
{
  "externalId": "ORDER-EC-BANK-001",
  "amount": "25.00",
  "currency": "USD",
  "paymentMethod": "bank_transfer",
  "rail": "ec_bank_transfer",
  "destinationMode": "single_use",
  "expirationDate": "2026-10-15T20:00:00-05:00",
  "description": "Compra ORDER-EC-BANK-001",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-EC-001",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "country": "EC",
    "documentType": "CC",
    "documentNumber": "1712345678"
  }
}
```

</div>

## Successful response

`201 Created` returns a new Payment. An identical idempotent replay returns the original Payment with `200 OK` and `Idempotent-Replayed: true`.

<div class="country-ar">

### Argentina QR response

```json
{
  "transactionId": "8dd5d1ee-1ba0-4311-bbbd-fd19765b2f93",
  "externalId": "ORDER-AR-QR-001",
  "status": "started",
  "amount": "1000.00",
  "currency": "ARS",
  "paymentMethod": "qr",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-15T20:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-ar-qr-001",
  "paymentData": {
    "type": "qr",
    "qr": {
      "qrCodeString": "00020101021243430010ar.com.demo...6304B081",
      "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "qrExpiresAt": "2026-10-15T20:00:00Z"
    }
  }
}
```

### Argentina bank-transfer response

```json
{
  "transactionId": "43e01b19-8ee2-43cb-9d38-150dc66e74c7",
  "externalId": "ORDER-AR-BANK-001",
  "status": "started",
  "amount": "1500.00",
  "currency": "ARS",
  "paymentMethod": "bank_transfer",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-15T20:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-ar-bank-001",
  "paymentData": {
    "type": "bank_transfer",
    "bankTransfer": {
      "rail": "ar_bank_transfer",
      "destinationMode": "single_use",
      "destination": {
        "accountIdentifier": {
          "type": "cvu",
          "value": "0000003100000000000001"
        }
      }
    }
  }
}
```

</div>

<div class="country-mx">

### Mexico SPEI response

```json
{
  "transactionId": "77b891fc-f225-49b5-82d4-c19c739d26b0",
  "externalId": "ORDER-MX-001",
  "status": "started",
  "amount": "250.00",
  "currency": "MXN",
  "paymentMethod": "bank_transfer",
  "creationDate": "2026-10-14T18:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-mx-001",
  "paymentData": {
    "type": "bank_transfer",
    "bankTransfer": {
      "rail": "spei",
      "destinationMode": "single_use",
      "destination": {
        "accountIdentifier": {
          "type": "clabe",
          "value": "646180157034181180"
        }
      }
    }
  }
}
```

</div>

<div class="country-cl">

### Chile response

```json
{
  "transactionId": "59c8a946-4618-463f-b2d4-891d788acbbc",
  "externalId": "ORDER-CL-001",
  "status": "started",
  "amount": "10000",
  "currency": "CLP",
  "paymentMethod": "bank_transfer",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-15T20:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-cl-001",
  "paymentData": {
    "type": "bank_transfer",
    "bankTransfer": {
      "rail": "cl_bank_transfer",
      "destinationMode": "single_use",
      "destination": {
        "accountIdentifier": {
          "type": "account_number",
          "value": "1234567890"
        },
        "accountHolder": {
          "name": "Dinaria"
        }
      },
      "transferReference": "PAY-59C8A946"
    }
  }
}
```

</div>

<div class="country-pe">

### Peru QR response

```json
{
  "transactionId": "e46e7f83-713f-42d0-a3ae-b99bc5eb1c36",
  "externalId": "ORDER-PE-QR-001",
  "status": "started",
  "amount": "100.00",
  "currency": "PEN",
  "paymentMethod": "qr",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-16T01:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-pe-qr-001",
  "paymentData": {
    "type": "qr",
    "qr": {
      "format": "emv",
      "qrCodeString": "000201010212...6304ABCD",
      "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "qrExpiresAt": "2026-10-16T01:00:00Z"
    }
  }
}
```

### Peru bank-transfer response

```json
{
  "transactionId": "f31bfc91-acde-4f25-9e6b-bd4c5809b029",
  "externalId": "ORDER-PE-BANK-002",
  "status": "started",
  "amount": "150.00",
  "currency": "PEN",
  "paymentMethod": "bank_transfer",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-16T01:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-pe-bank-002",
  "paymentData": {
    "type": "bank_transfer",
    "bankTransfer": {
      "rail": "pe_bank_transfer",
      "destinationMode": "single_use",
      "destination": {
        "accountIdentifier": {
          "type": "cci",
          "value": "00212345678901234567"
        }
      }
    }
  }
}
```

</div>

<div class="country-ec">

### Ecuador response

```json
{
  "transactionId": "8b76207c-5317-4d20-ac65-90d14a6e64a3",
  "externalId": "ORDER-EC-BANK-001",
  "status": "started",
  "amount": "25.00",
  "currency": "USD",
  "paymentMethod": "bank_transfer",
  "creationDate": "2026-10-14T18:00:00Z",
  "expirationDate": "2026-10-16T01:00:00Z",
  "actionUrl": "https://pay.dinaria.com/checkout/demo-order-ec-bank-001",
  "paymentData": {
    "type": "redirect",
    "redirect": {
      "recommendedAlternative": "web",
      "links": {
        "web": "https://pay.dinaria.com/checkout/demo-order-ec-bank-001"
      }
    }
  }
}
```

</div>

`actionUrl` is Dinaria's recommended hosted completion experience. `paymentData` contains structured instructions for custom experiences. Its `type` may be `qr`, `bank_transfer`, `redirect`, `cash`, or `card` as formally defined by the API Reference.

Bank-transfer instructions identify the resolved rail, destination lifecycle, account identifier, holder data, and a transfer reference only when that rail requires one.

See [Binance Pay](payments-binance-pay.md) for the public crypto redirect product and [Country & Capability Matrix](country-capabilities.md) for the complete capability summary.
