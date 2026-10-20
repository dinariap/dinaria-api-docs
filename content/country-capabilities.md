---
title: Country & Capability Matrix
parent: Core Concepts
---

# Country and capability matrix

This matrix describes the public V2 contract. Required identity and banking fields can vary by country, rail, payment method, and merchant data policy. Provider selection and routing remain transparent.

## Payments

| Country | Currency | `paymentMethod` | `rail` | `destinationMode` | Main required data | `paymentData.type` |
|---|---|---|---|---|---|---|
| Argentina | ARS | `qr` | `ar_qr` | `single_use` | Customer fields required by the active policy | `qr` |
| Argentina | ARS | `bank_transfer` | `ar_bank_transfer` | `single_use` | Customer fields required by the active policy | `bank_transfer` |
| Mexico | MXN | `bank_transfer` | `spei` | `single_use` | Customer identity used for the payment order | `bank_transfer` |
| Mexico | MXN | `bank_transfer` | `spei` | `reusable` | `collectionKey` and customer identity | `bank_transfer` |
| Chile | CLP | `bank_transfer` | `cl_bank_transfer` | `single_use` | Customer RUT when required by the data policy | `bank_transfer` |
| Peru | PEN | `qr` | `pe_qr` | `single_use` | Customer fields required by the active policy | `qr` |
| Peru | PEN | `bank_transfer` | `pe_bank_transfer` | `single_use` | Customer fields required by the active policy | `bank_transfer` |
| Ecuador | USD | `bank_transfer` | `ec_bank_transfer` | `single_use` | Name, email, `CC` or `RUC`, and document number | `bank_transfer` |
| Global crypto | USDT | `crypto_payment` | `binance_pay` | — | Customer and description | `redirect` |

Chile is documented only as `single_use`.

## Payouts

| Country | Source | Destination | Rail | Required destination data |
|---|---|---|---|---|
| Argentina | ARS | ARS | `ar_bank_transfer` | Beneficiary and 22-digit bank account identifier |
| Mexico | MXN | MXN | `spei` | Beneficiary and 18-digit CLABE in `destination.rail.accountNumber` |
| Chile | CLP | CLP | `cl_bank_transfer` | Beneficiary RUT, Dinaria `bankCode`, account type, and account number |
| Venezuela | USD or USDT | VES | `ve_mobile_payment` | Beneficiary document, bank code, and mobile number |
| Venezuela | USD or USDT | VES | `ve_bank_account` | Beneficiary document, bank code, account type, and account number |
| Peru | PEN | PEN | `pe_bank_transfer` | Beneficiary and 20-digit CCI |
| Peru | PEN | PEN | `pe_mobile_payment` | Beneficiary and mobile destination |
| Ecuador | USD | USD | `ec_bank_transfer` | Beneficiary name, email, `CC` or `RUC`, bank code, account type, and account number |

Every Payout starts in `processing`. Final delivery, rejection, cancellation, or reversal is asynchronous.

## Persistent Virtual Accounts

| Country | Currency | Rail | Resource |
|---|---|---|---|
| Argentina | ARS | `ar_cvu` | Persistent Virtual Account linked to a Customer |

A Virtual Account is different from a `single_use` Payment destination and from a reusable destination managed within Payments.
