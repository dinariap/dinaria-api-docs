---
title: Retrieve & List Payouts
nav_order: 3
parent: Money Out
---

# Retrieve & List Payouts

Use `GET /payouts/{payoutId}` to retrieve the current state of a payout, and `GET /payouts` to list payouts for the authenticated merchant.

A payout is asynchronous. The initial create request confirms that the payout resource was accepted, but the final outcome may be delivered later through the payout lifecycle update.

---

## Retrieve a payout

`GET /payouts/{payoutId}`

```http
GET /payouts/d1e2f3a4-b5c6-7890-abcd-ef0123456789
Authorization: Bearer <API_KEY>
```

```json
{
  "id": "1078d6c2-a452-44fb-94f4-525390231ce2",
  "merchantId": "acme_ars_merch1",
  "amount": "1500.00",
  "currency": "ARS",
  "destination": {
    "identifierType": "cbu",
    "identifierValue": "0070327530004025541644",
    "taxId": "20221370075",
    "taxIdCountry": "AR",
    "name": "Ana Martínez"
  },
  "status": "processing",
  "attempts": 1,
  "createdAt": "2026-03-10T15:00:00Z",
  "submittedAt": "2026-03-10T15:00:05Z"
}
```

Use the payout ID as the canonical reference for reconciliation and follow-up.

---

## List payouts

`GET /payouts`

```http
GET /payouts?status=pending&limit=20
Authorization: Bearer <API_KEY>
```

### Query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by `pending`, `processing`, `completed`, or `failed` |
| `limit` | integer | Max results (1–200, default 50) |
| `startingAfter` | string | Cursor — `id` of the last item on the previous page |

### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "1078d6c2-a452-44fb-94f4-525390231ce2",
      "status": "processing"
    }
  ],
  "hasMore": false
}
```

---

## Response fields

| Field | Description |
|-------|-------------|
| `id` | Unique payout identifier (UUID). |
| `merchantId` | Merchant the payout was created for. |
| `amount` | Decimal string. |
| `currency` | Source currency. |
| `destination` | Delivery details for the selected rail. |
| `status` | Current state — `pending`, `processing`, `completed`, or `failed`. |
| `bankSystemTrxId` | Network or banking reference assigned when the payout is completed. |
| `errorMessage` | Present when `status` is `failed`. |
| `attempts` | Processing attempts made. |
| `externalId` | Your reference, if provided when creating the payout. |
| `createdAt` | When the payout was created. |
| `submittedAt` | When the payout was submitted for processing. |
| `completedAt` | When the payout reached a terminal completed state. |

> Webhooks are the recommended way to receive lifecycle updates. `GET /payouts/{payoutId}` is the fallback for checking the latest status.
