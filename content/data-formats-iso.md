---
title: Data Formats
parent: Core Concepts
---

# Data formats

## Amounts

Send and receive monetary values as JSON strings, never binary floating-point numbers.

```json
{ "amount": "150.00", "currency": "USD" }
```

Precision is currency-specific. For example, CLP uses integer amounts such as `"25000"`; currencies with two decimal places may use values such as `"150.00"`. Do not assume every currency has two decimals.

## Currency and country codes

- Currency values use uppercase ISO 4217 codes such as `ARS`, `MXN`, `CLP`, `PEN`, `USD`, and `VES`. The API also supports the public crypto code `USDT` where specified.
- Country values use uppercase ISO 3166-1 alpha-2 codes such as `AR`, `MX`, `CL`, `VE`, `PE`, and `EC`.
- Nationality may use an uppercase two- or three-letter country code when accepted by the resource schema.

## Dates and timestamps

- Timestamps use RFC 3339 UTC strings, for example `2026-09-10T20:00:00Z`.
- Calendar dates use `YYYY-MM-DD`, for example `1985-06-15`.

## Identifiers

Treat Dinaria identifiers and pagination cursors as opaque strings. Do not derive an `actionUrl`, account number, or provider reference from a resource ID. Preserve `externalId` as your business reference and use `Idempotency-Key` independently for retry safety.

## Identity and rail data

Document formats, account identifiers, bank codes, phone formats, and required party fields vary by country and rail. Validate against the active capability and preserve leading zeroes by representing these values as strings.
