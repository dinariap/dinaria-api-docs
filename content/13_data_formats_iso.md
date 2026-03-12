---
title: Data Formats
nav_order: 7
---

# Data Formats

<div class="country-ar">

## Currency

**ARS** — Argentine Peso (ISO 4217)

## Document numbers

| Type      | Format                    | Example          |
|-----------|---------------------------|------------------|
| DNI       | 7–8 digits                | `12345678`       |
| CUIT/CUIL | 11 digits (XX-XXXXXXXX-X) | `20-12345678-9`  |

Digits only; hyphens for CUIT/CUIL are accepted but stripped internally.

## Bank account identifiers

| Type | Format    | Description                                  |
|------|-----------|----------------------------------------------|
| CBU  | 22 digits | Issued by banks (Clave Bancaria Uniforme)     |
| CVU  | 22 digits | Issued by virtual wallets (e.g. Mercado Pago) |

Digits only; no spaces or dashes.

## Payout destination

```json
{
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "name": "Ana Martínez",
    "taxId": "20123456789"
  }
}
```

## Amounts

Decimal string, e.g. `"1500.50"`. Two decimal places for ARS.

</div>

<div class="country-br">

## Currency

**BRL** — Brazilian Real (ISO 4217)

## Document numbers

| Type  | Format                         | Example              |
|-------|--------------------------------|----------------------|
| CPF   | 11 digits (XXX.XXX.XXX-XX)     | `123.456.789-09`     |
| CNPJ  | 14 digits (XX.XXX.XXX/XXXX-XX) | `58.084.921/0001-60` |

Digits only when sending via API; formatting punctuation is accepted but stripped internally.

## PIX key types

| `identifierType`   | Example                                |
|--------------------|----------------------------------------|
| `pix_key_cpf`      | `12345678909`                          |
| `pix_key_cnpj`     | `58084921000160`                       |
| `pix_key_phone`    | `+5511999999999`                       |
| `pix_key_email`    | `payer@example.com`                    |
| `pix_key_random`   | `bc8ba248-fb33-4022-bea1-c9fab2efd341` |

For `pix_key_phone`, `pix_key_email`, and `pix_key_random`, `taxId` (CPF/CNPJ) is required.

## Pay-in — PIX response

BRL payments use PIX via a static deposit key. The `paymentData` object contains the key and reference:

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

The customer opens their bank app, selects PIX, enters the key, and sends exactly the requested amount. Payment confirmation arrives via webhook once the transfer is matched.

## Payout destination

```json
{
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "name": "João Silva"
  }
}
```

## Amounts

Decimal string, e.g. `"100.50"`. Two decimal places for BRL.

</div>

---

## ISO standards (both countries)

| Field          | Standard                | Example          |
|----------------|-------------------------|------------------|
| Country        | ISO 3166-1 alpha-2      | `AR`, `BR`       |
| State / region | ISO 3166-2 (recommended)| `AR-B`, `BR-SP`  |
| City           | Free-text string        | `Buenos Aires`   |
| Currency       | ISO 4217                | `ARS`, `BRL`     |
