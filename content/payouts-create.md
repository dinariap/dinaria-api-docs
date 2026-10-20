---
title: Create a Payout
parent: Money Out
---

# Create a payout

Create a payout only after the source account has sufficient available balance. The request is accepted synchronously and delivery completes asynchronously.

```http
POST https://sbx.dinaria.com/v2/payouts
Authorization: Bearer <API_KEY>
Idempotency-Key: <UNIQUE_KEY>
Content-Type: application/json
```

## Request

| Field | Required | Description |
|---|---|---|
| `merchantId` | Conditional | Required with an account-scoped credential; inferred from a merchant-scoped credential. |
| `externalId` | Yes | Stable reference from your system. |
| `source` | Yes | Amount and currency debited from your available balance. |
| `destination` | Yes | Country, currency, beneficiary, and delivery rail. |
| `remitter` | Conditional | Originator data when required for the corridor or use case. |
| `description` | No | Human-readable transfer purpose. |
| `metadata` | No | Client-owned values returned unchanged. |

The beneficiary, remitter, and rail fields shown below are illustrative. Required data varies by corridor, rail, and configured use case.

## Country examples

<div class="country-ar">

### Argentina — bank transfer

```json
{
  "externalId": "PAYOUT-AR-1001",
  "source": {
    "amount": "15000",
    "currency": "ARS"
  },
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "beneficiary": {
      "type": "individual",
      "name": "María González"
    },
    "rail": {
      "type": "ar_bank_transfer",
      "accountType": "cbu",
      "accountNumber": "0000003100012345678901"
    }
  },
  "description": "Supplier payment"
}
```

</div>

<div class="country-mx">

### Mexico — SPEI

```json
{
  "externalId": "PAYOUT-MX-1001",
  "source": {
    "amount": "850.50",
    "currency": "MXN"
  },
  "destination": {
    "country": "MX",
    "currency": "MXN",
    "beneficiary": {
      "type": "individual",
      "name": "Ana López"
    },
    "rail": {
      "type": "spei",
      "accountNumber": "646180157034181180"
    }
  }
}
```

</div>

<div class="country-cl">

### Chile — bank transfer

Use `cl_bank_transfer` to send CLP to a beneficiary's Chilean bank account.

#### Chile rail fields

| Field | Required | Description |
|---|---|---|
| `destination.rail.type` | Yes | Must be `cl_bank_transfer`. |
| `destination.rail.bankCode` | Yes | Bank identifier accepted by Dinaria, sent as a string. |
| `destination.rail.accountType` | Yes | Beneficiary account type: `checking`, `saving`, `vista`, or `rut`. |
| `destination.rail.accountNumber` | Yes | Beneficiary bank account number. |

```json
{
  "externalId": "PAYOUT-CL-1001",
  "source": {
    "amount": "10000",
    "currency": "CLP"
  },
  "destination": {
    "country": "CL",
    "currency": "CLP",
    "beneficiary": {
      "type": "individual",
      "firstName": "María",
      "lastName": "González",
      "email": "maria.gonzalez@example.com",
      "documentType": "RUT",
      "documentNumber": "12345678-5"
    },
    "rail": {
      "type": "cl_bank_transfer",
      "bankCode": "24",
      "accountType": "checking",
      "accountNumber": "123456789"
    }
  },
  "description": "Pago a beneficiario en Chile"
}
```

- `"24"` identifies Banco Estado in Dinaria's bank catalog.
- Amounts expressed in CLP do not support decimal places.
- `accountNumber` is the beneficiary's bank account number.
- `documentNumber` must contain a valid Chilean RUT.
- Corridor availability depends on it being enabled for the merchant.

#### Chile bank catalog

The values below are identifiers from the catalog accepted by Dinaria. Send them exactly as strings; do not replace them with local Chilean bank codes. The catalog may be updated.

| `bankCode` | Bank or institution |
|---|---|
| `"14"` | Banco Bice |
| `"16"` | Banco de Chile |
| `"17"` | Banco BCI / MACHBANK |
| `"18"` | Banco del Desarrollo |
| `"20"` | Banco Falabella |
| `"21"` | Banco Internacional |
| `"22"` | Banco Santander |
| `"23"` | Banco Security |
| `"24"` | Banco Estado |
| `"27"` | Itaú / CorpBanca |
| `"31"` | Banco Scotiabank |
| `"992"` | Banco Ripley |
| `"1362"` | Prepago Tenpo |
| `"1364"` | Coopeuch / Dale |
| `"2227"` | Banco Consorcio |
| `"2953"` | Mercado Pago |
| `"2954"` | Copec Pay |
| `"2957"` | Prepago Los Héroes |
| `"2958"` | TAPP Caja Los Andes |
| `"3008"` | ISWITCH |
| `"3009"` | Transbank |
| `"3010"` | JP Morgan |
| `"3011"` | HSBC |
| `"3314"` | Prex |
| `"3369"` | Fintual |
| `"3375"` | Tanner |
| `"3404"` | MetroMuv |
| `"3418"` | Tricot Prepago |
| `"3421"` | AndCo. |

</div>

<div class="country-ve">

### Venezuela — remittance flow

The source currency can be `USD` or `USDT`, according to your account configuration, and the beneficiary receives VES. Venezuela supports `ve_bank_account` and `ve_mobile_payment`.

For remittance use cases, send the complete `remitter` object. Beneficiary, remitter, and compliance requirements can vary for other configured use cases.

#### Venezuela fields

| Field | Required | Description |
|---|---|---|
| `destination.country` | Yes | Use `VE`. |
| `destination.currency` | Yes | Use `VES`. |
| `destination.beneficiary.name` | Yes | Beneficiary full name. |
| `destination.beneficiary.documentType` | Conditional | Use `RIF` when a Venezuelan identity document is required. |
| `destination.beneficiary.documentNumber` | Yes for this remittance flow | Beneficiary identity number, for example `V27127416`. |
| `destination.beneficiary.mobile` | Yes for this remittance flow | Beneficiary phone in international format. It is also the mobile-payment destination. |
| `destination.beneficiary.address` | Yes for this remittance flow | Beneficiary address. |
| `destination.beneficiary.email` | Conditional | Include when required by the configured use case. |
| `destination.rail.type` | Yes | `ve_bank_account` or `ve_mobile_payment`. |
| `destination.rail.bankCode` | Yes | Four-character bank code, preserving any leading zero. |
| `destination.rail.accountNumber` | Bank account only | Beneficiary bank account number. |
| `destination.rail.accountType` | Bank account only | Account-type identifier required by the configured bank flow. |
| `remitter` | Yes for remittances | Sender identity and contact information. |

#### Bank account

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
      "documentNumber": "V40001469",
      "mobile": "+584242005748",
      "address": "Caracas, Venezuela",
      "email": "maria@example.com"
    },
    "rail": {
      "type": "ve_bank_account",
      "bankCode": "0102",
      "accountType": 1,
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

#### Mobile payment

```json
{
  "externalId": "PAYOUT-VE-1001",
  "source": {
    "amount": "10.00",
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
      "address": "Caracas, Venezuela",
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

#### Bank codes

Submit the code as a four-character string, including its leading zero.

| Code | Bank |
|---|---|
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

<div class="country-pe">

### Peru — bank transfer

For a bank payout, provide the beneficiary's 20-digit CCI. A separate `bankCode` is not required: the participating bank is resolved from the CCI.

```json
{
  "externalId": "PAYOUT-PE-1001",
  "source": {
    "amount": "200.00",
    "currency": "PEN"
  },
  "destination": {
    "country": "PE",
    "currency": "PEN",
    "beneficiary": {
      "type": "individual",
      "name": "Lucía Torres",
      "documentType": "DNI",
      "documentNumber": "47123456"
    },
    "rail": {
      "type": "pe_bank_transfer",
      "cci": "00212345678901234567"
    }
  }
}
```

### Peru — mobile payment

Use the beneficiary's mobile number when `pe_mobile_payment` is enabled for your account. The mobile directory resolves the receiving participant.

```json
{
  "externalId": "PAYOUT-PE-MOBILE-1002",
  "source": {
    "amount": "75.00",
    "currency": "PEN"
  },
  "destination": {
    "country": "PE",
    "currency": "PEN",
    "beneficiary": {
      "type": "individual",
      "name": "Lucía Torres",
      "documentType": "DNI",
      "documentNumber": "47123456"
    },
    "rail": {
      "type": "pe_mobile_payment",
      "mobile": "+51987654321"
    }
  }
}
```

</div>

<div class="country-ec">

### Ecuador — bank transfer

```json
{
  "externalId": "PAYOUT-EC-1001",
  "source": {
    "amount": "125.00",
    "currency": "USD"
  },
  "destination": {
    "country": "EC",
    "currency": "USD",
    "beneficiary": {
      "type": "individual",
      "name": "María Andrade",
      "documentType": "CC",
      "documentNumber": "1712345678",
      "email": "maria@example.com"
    },
    "rail": {
      "type": "ec_bank_transfer",
      "bankCode": "0010",
      "accountType": "savings",
      "accountNumber": "1234567890"
    }
  }
}
```

</div>

## Accepted response

A new payout returns `201 Created` with the Payout in `processing`. Reusing the same `Idempotency-Key` with the same payload returns the original result as `200 OK`, sets `Idempotent-Replayed: true`, and does not create another payout.

The response preserves the resolved destination rail and starts in `processing`. The destination amount can be present when it has already been resolved.

<div class="country-ar">

### Argentina response

```json
{
  "payoutId": "1078d6c2-a452-44fb-94f4-525390231ce2",
  "externalId": "PAYOUT-AR-1001",
  "source": {
    "amount": "15000",
    "currency": "ARS"
  },
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "amount": "15000",
    "beneficiary": {
      "type": "individual",
      "name": "María González"
    },
    "rail": {
      "type": "ar_bank_transfer",
      "accountType": "cbu",
      "accountNumber": "0000003100012345678901"
    }
  },
  "status": "processing",
  "creationDate": "2026-10-14T19:56:45Z"
}
```

</div>

<div class="country-ve">

### Venezuela response

```json
{
  "payoutId": "82e07c90-82a5-4e40-bdf0-7a982de47745",
  "externalId": "PAYOUT-VE-1001",
  "source": {
    "amount": "10.00",
    "currency": "USDT"
  },
  "destination": {
    "country": "VE",
    "currency": "VES",
    "amount": "365.00",
    "beneficiary": {
      "type": "individual",
      "name": "María González",
      "documentType": "RIF",
      "documentNumber": "V27127416",
      "mobile": "+584242005748"
    },
    "rail": {
      "type": "ve_mobile_payment",
      "bankCode": "0102"
    }
  },
  "status": "processing",
  "creationDate": "2026-09-10T19:56:45Z"
}
```

</div>

Do not treat the HTTP response as delivery confirmation. Store `payoutId`, process Payout webhook events idempotently, and retrieve the Payout if you need to reconcile its current state.

## Next steps

- [Payout lifecycle](payouts-flow.md)
- [Retrieve and list payouts](payouts-retrieve.md)
- [Country and capability matrix](country-capabilities.md)
- [Webhooks](webhooks-overview.md)
