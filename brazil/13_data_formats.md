---
title: Data Formats (PIX & CPF)
nav_order: 7
parent: Home
---

# Data formats — Brazil

## Currency

- **BRL** — Brazilian Real (ISO 4217)

## Document numbers

| Type | Format   | Example        |
|------|----------|----------------|
| CPF  | 11 digits| `12345678901`  |
| CNPJ | 14 digits| `12345678000199` |

No dots or dashes; digits only.

## PIX keys

Recipients are identified by one of:

- **CPF** — 11 digits
- **CNPJ** — 14 digits  
- **Email** — valid email format
- **Phone** — E.164 format (e.g. `+5511999999999`)
- **Random** — alphanumeric key assigned by the recipient

## Amounts

Decimal string, e.g. `"100.50"`. Two decimal places for BRL.
