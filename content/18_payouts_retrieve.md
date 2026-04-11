---
title: Retrieve & List Payouts
nav_order: 3
parent: Money Out
---

# Retrieve & List Payouts

---

## Retrieve a payout

`GET /payouts/{payoutId}`

```http
GET /payouts/d1e2f3a4-b5c6-7890-abcd-ef0123456789
Authorization: Bearer di_live_<your-merchant-key>
```

<div class="country-ar">

### Argentina (ARS) — completed

```json
{
  "id": "1078d6c2-a452-44fb-94f4-525390231ce2",
  "accountId": "acme_ar",
  "merchantId": "acme_ar_merch1",
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "taxId": "20221370075",
    "taxIdCountry": "AR",
    "name": "Ana Martínez"
  },
  "status": "completed",
  "bankSystemTrxId": "3D5W612E65ZJKDJW2GXYVR",
  "attempts": 1,
  "createdAt": "2026-03-10T15:00:00Z",
  "submittedAt": "2026-03-10T15:00:05Z",
  "completedAt": "2026-03-10T15:00:08Z"
}
```

</div>

<div class="country-br">

### Brasil (BRL) — completed

```json
{
  "id": "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  "accountId": "acme_br",
  "merchantId": "acme_br_merch1",
  "amount": "150.00",
  "currency": "BRL",
  "destination": {
    "identifierType": "pix_key_cpf",
    "identifierValue": "12345678901",
    "taxId": "12345678901",
    "taxIdCountry": "BR",
    "name": "João Silva"
  },
  "status": "completed",
  "bankSystemTrxId": "f4e3d2c1-b0a9-8765-4321-fedcba987654",
  "attempts": 1,
  "createdAt": "2026-03-11T23:01:17Z",
  "submittedAt": "2026-03-11T23:01:32Z",
  "completedAt": "2026-03-11T23:01:44Z"
}
```

</div>

---

## List payouts

`GET /payouts`

```http
GET /payouts?status=pending&limit=20
Authorization: Bearer di_live_<your-merchant-key>
```

### Query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter: `pending`, `processing`, `completed`, `failed` |
| `limit` | integer | Max results (1–200, default 50) |
| `startingAfter` | string | Cursor — `id` of the last item on the previous page |

### Response

```json
{
  "object": "list",
  "data": [ ... ],
  "hasMore": false
}
```

---

## Response fields

| Field | Description |
|-------|-------------|
| `id` | Unique payout identifier (UUID). |
| `accountId` | Account that owns this payout. |
| `merchantId` | Merchant the payout was created for. |
| `amount` | Decimal string. |
| `currency` | `ARS` or `BRL`. |
| `destination` | Object with `identifierType`, `identifierValue`, `taxId`, `taxIdCountry`, `name`. |
| `status` | Current state — see table below. |
| `bankSystemTrxId` | Network transaction ID on completion. ARS: COELSA clearing ID. BRL: PIX network ID. |
| `errorMessage` | Present when `status` is `failed`. |
| `attempts` | Submission attempts made. Max 3 before permanent failure. |
| `externalId` | Your reference, if provided at creation. |
| `createdAt` | When the payout was created. |
| `submittedAt` | When first submitted to the network. |
| `completedAt` | When the transfer was confirmed. |

### Status values

| Status | Description |
|--------|-------------|
| `pending` | Queued. Balance reserved. Not yet submitted. |
| `processing` | Submitted (BRL only). Awaiting network confirmation. |
| `completed` | Transfer confirmed. Terminal. |
| `failed` | Permanently rejected after 3 attempts. Balance restored. Terminal. |
