---
title: Retrieve & List Payouts
nav_order: 3
parent: Money Out
---

# Retrieve & List Payouts

Use `GET /v2/payouts/{payoutId}` to retrieve the canonical current state and `GET /v2/payouts` to list payouts visible to the authenticated principal.

## Retrieve a payout

```http
GET https://api.sandbox.dinaria.com/v2/payouts/{payoutId}
Authorization: Bearer <YOUR_API_KEY>
```

<div class="country-ve">

### Venezuela example

```json
{
  "payoutId": "82e07c90-82a5-4e40-bdf0-7a982de47745",
  "externalId": "PAYOUT-VE-1001",
  "source": { "amount": "1.00", "currency": "USDT" },
  "destination": {
    "country": "VE",
    "currency": "VES",
    "amount": "36.50",
    "beneficiary": {
      "type": "individual",
      "name": "María González",
      "documentType": "RIF",
      "documentNumber": "V27127416",
      "mobile": "+584242005748"
    },
    "rail": { "type": "ve_mobile_payment", "bankCode": "0102" }
  },
  "status": "confirmed",
  "bankSystemTrxId": "BANK-908172",
  "creationDate": "2026-09-10T19:56:45Z",
  "confirmationDate": "2026-09-10T20:00:00Z"
}
```

</div>

<div class="country-ar">

### Argentina example

```json
{
  "payoutId": "1078d6c2-a452-44fb-94f4-525390231ce2",
  "externalId": "PAYOUT-AR-1001",
  "source": { "amount": "1500.00", "currency": "ARS" },
  "destination": {
    "country": "AR",
    "currency": "ARS",
    "beneficiary": {
      "type": "individual",
      "name": "Ana Martínez",
      "documentType": "CUIT",
      "documentNumber": "20-22137007-5"
    },
    "rail": { "type": "ar_cbu", "cbu": "0070327530004025541644" }
  },
  "status": "processing",
  "creationDate": "2026-09-10T20:00:00Z"
}
```

</div>

<div class="country-br">

### Brazil example

```json
{
  "payoutId": "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  "externalId": "PAYOUT-BR-1001",
  "source": { "amount": "150.00", "currency": "BRL" },
  "destination": {
    "country": "BR",
    "currency": "BRL",
    "beneficiary": {
      "type": "individual",
      "name": "João Silva",
      "documentType": "CPF",
      "documentNumber": "12345678901"
    },
    "rail": {
      "type": "br_pix",
      "pixKey": { "type": "cpf", "value": "12345678901" }
    }
  },
  "status": "processing",
  "creationDate": "2026-09-10T20:00:00Z"
}
```

</div>

## List payouts

```http
GET https://api.sandbox.dinaria.com/v2/payouts?status=processing&externalId=PAYOUT-1001&limit=20
Authorization: Bearer <YOUR_API_KEY>
```

| Parameter | Description |
|---|---|
| `status` | Optional: `processing`, `confirmed`, `failed`, `cancelled`, or `reversed`. |
| `externalId` | Optional exact client reference. |
| `limit` | Optional page size from 1 to 100; default 50. |
| `cursor` | Opaque cursor returned as `nextCursor` by the preceding page. |

```json
{
  "data": [
    {
      "payoutId": "82e07c90-82a5-4e40-bdf0-7a982de47745",
      "externalId": "PAYOUT-1001",
      "source": { "amount": "1.00", "currency": "USDT" },
      "destination": {
        "country": "VE",
        "currency": "VES",
        "beneficiary": { "type": "individual", "name": "María González" },
        "rail": { "type": "ve_mobile_payment", "bankCode": "0102" }
      },
      "status": "processing",
      "creationDate": "2026-09-10T19:56:45Z"
    }
  ],
  "hasMore": true,
  "nextCursor": "<OPAQUE_CURSOR>"
}
```

When `hasMore` is true, pass `nextCursor` unchanged as the next request's `cursor`.

## Public response fields

| Field | Description |
|---|---|
| `payoutId` | Canonical payout identifier. |
| `externalId` | Stable reference assigned by your system. |
| `source` | Amount and currency debited from the account balance. |
| `destination` | Destination amount when known, beneficiary, currency, and rail. |
| `pricing` | Optional fee and conversion details. |
| `status` | Current public payout status. |
| `bankSystemTrxId` | Bank or provider reference, when available. |
| `creationDate` | Creation timestamp. |
| `confirmationDate` | Final-delivery timestamp, when confirmed. |
| `failureDate` / `failure` | Failure timestamp and public failure detail, when failed. |
| `cancellationDate` | Cancellation timestamp, when cancelled. |
| `reversalDate` | Return timestamp, when reversed. |
| `metadata` | Client-owned metadata returned unchanged. |

Webhooks are the recommended update mechanism. Retrieve the payout when an event is missing, duplicated, delayed, or arrives out of order.
