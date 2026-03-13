---
title: Payouts Overview
nav_order: 1
parent: Money Out
---

# Payouts Overview

A payout sends money from your Dinaria merchant balance to a recipient via the local payment rail.

---

## How payouts work

1. You call `POST /payouts` with the amount, currency, and destination.
2. The merchant's balance is **reserved immediately**.
3. A background processor submits the transfer to the payment network.
4. The payout moves through the following states:

```
pending → processing → completed
                     → failed
pending → cancelled  (if you cancel before processing starts)
```

---

## Destination

Every payout requires a `destination` object identifying the recipient.

<div class="country-ar">

### Argentina (ARS) — CBU/CVU bank transfer

Funds are sent via the COELSA clearing network to the recipient's CBU or CVU.

| `identifierType` | `identifierValue` |
|---|---|
| `cbu` | 22-digit CBU or CVU number, e.g. `0070327530004025541644` |
| `alias_cbu` | CBU alias, e.g. `mialiascbu` |

- `taxId` (CUIT) is **optional** — resolved from the CBU automatically if omitted.
- `name` is **optional** — auto-resolved from CBU if omitted.
- Processing is **synchronous**: status goes directly from `pending` to `completed`.

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

</div>

<div class="country-br">

### Brasil (BRL) — PIX instant transfer

Funds are sent via PIX to the recipient's registered PIX key.

| `identifierType` | `identifierValue` | `taxId` required? |
|---|---|---|
| `pix_key_cpf` | CPF (11 digits), e.g. `12345678901` | No — inferred |
| `pix_key_cnpj` | CNPJ (14 digits), e.g. `58084921000160` | No — inferred |
| `pix_key_email` | Email registered as PIX key | **Yes** |
| `pix_key_phone` | Phone registered as PIX key | **Yes** |
| `pix_key_random` | Random UUID PIX key (EVP) | **Yes** |

> The `identifierValue` must be the recipient's **registered PIX key** — not just their tax ID.

- Processing is **asynchronous**: moves to `processing` after submission, then `completed` once the PIX network confirms.
- The platform polls the network every ~10 seconds to detect completion.

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

</div>

---

## Payout states

| Status | Meaning |
|--------|---------|
| `pending` | Queued. Balance reserved. Not yet submitted to the network. |
| `processing` | Submitted (BRL only). Awaiting final confirmation. |
| `completed` | Transfer confirmed. Terminal. |
| `failed` | Permanently rejected after max retries. Balance restored. Terminal. |
| `cancelled` | Cancelled before processing. Balance restored. Terminal. |

---

## Merchant balance

| Event | Balance change |
|-------|---------------|
| Payment confirmed | `+ payment.amount` |
| `POST /payouts` accepted | `- payout.amount` (reserved immediately) |
| Payout failed (max retries) | `+ payout.amount` (restored) |
| Payout cancelled | `+ payout.amount` (restored) |
| Payout completed | no change (already deducted at creation) |

A payout returns `402 insufficient_balance` if your balance is below the payout amount.

---

## See also

- [Create a Payout](#17_payouts_create.md)
- [Retrieve & List Payouts](#18_payouts_retrieve.md)
