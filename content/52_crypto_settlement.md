# On-ramp (BRL → USDT)

An on-ramp converts BRL from your Dinaria balance into USDT and delivers it on-chain to any Tron address you specify.

The operation is executed through the **Exchange** and completed atomically within the API call — no polling required.

---

## How It Works

```
Your Dinaria BRL balance
         │  POST /payouts
         ▼
   DinaCore debit (BRL)
         │
         ▼
  Exchange (quote + confirm, ~5 s)
         │
         ▼
   DinaCore credit (USDT)
         │
         ▼
  Tron on-chain transfer to your address
```

1. **You call `POST /payouts`** with `destination.identifierType = "tron_address"`.
2. Dinapay atomically:
   - Locks a live BRL/USDT price with the Exchange (session TTL ~7 s, handled internally).
   - Debits your BRL balance in DinaCore.
   - Confirms the trade.
   - Credits your USDT balance in DinaCore.
3. USDT is sent on-chain to your address.
4. The API response is returned with `status: "completed"` and the confirmed exchange details.

---

## Get Indicative Rates

Fetch the current BRL/USDT price without locking a quote.

```
GET /payouts/rates?fromCurrency=BRL&toCurrency=USDT&settlement=D0
```

### Query Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `fromCurrency` | `BRL` | Source currency. |
| `toCurrency` | `USDT` | Destination currency. |
| `settlement` | `D0` | Settlement type: `D0`, `D1`, or `D2`. |

### Response — `200 OK`

```json
{
  "fromCurrency": "BRL",
  "toCurrency": "USDT",
  "price": 5.72,
  "settlement": "D0",
  "indicativeAt": "2026-04-03T14:00:00Z"
}
```

`price` is BRL per USDT. A price of `5.72` means 1 USDT costs BRL 5.72.

---

## Execute an On-ramp

```
POST /payouts
```

### Request

```json
{
  "amount": "1000.00",
  "currency": "BRL",
  "destination": {
    "identifierType": "tron_address",
    "identifierValue": "TUcVE7YGbVJ2oXe7e3MiHAGiDqEbVz1GkB",
    "name": "My USDT Wallet",
    "destinationCurrency": "USDT",
    "network": "mainnet",
    "settlement": "D0"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✓ | BRL amount to convert, as a decimal string (e.g. `"1000.00"`). |
| `currency` | string | ✓ | Must be `"BRL"`. |
| `destination.identifierType` | string | ✓ | Must be `"tron_address"`. |
| `destination.identifierValue` | string | ✓ | Recipient's Tron address (`T` + 33 base58 chars). |
| `destination.destinationCurrency` | string | | `"USDT"` (default and only supported value). |
| `destination.network` | string | | `"mainnet"` (default) or `"shasta"`. |
| `destination.settlement` | string | | `"D0"` (default), `"D1"`, or `"D2"`. D0 = same-day settlement. |

### Authentication

Use your standard **merchant-scoped** API key — the same key you use for BRL payouts. Include `merchantId` in the body if operating under a sub-account.

### Response — `201 Created`

```json
{
  "id": "pay_...",
  "accountId": "acct_...",
  "amount": "1000.00",
  "currency": "BRL",
  "status": "completed",
  "destinationCurrency": "USDT",
  "destinationAmount": "174.825874",
  "exchangeRate": "5.72000000",
  "destination": {
    "identifierType": "tron_address",
    "identifierValue": "TUcVE7YGbVJ2oXe7e3MiHAGiDqEbVz1GkB",
    "network": "mainnet",
    "settlement": "D0"
  },
  "bankSystemTrxId": "ord_abc123",
  "attempts": 1,
  "submittedAt": "2026-04-03T14:01:00Z",
  "completedAt": "2026-04-03T14:01:05Z",
  "createdAt": "2026-04-03T14:01:00Z"
}
```

| Field | Description |
|-------|-------------|
| `status` | `"completed"` on success, `"failed"` if the trade could not be confirmed. |
| `destinationCurrency` | Always `"USDT"` for on-ramp operations. |
| `destinationAmount` | USDT amount credited, as a 6-decimal string. |
| `exchangeRate` | Confirmed BRL/USDT rate as an 8-decimal string. |
| `bankSystemTrxId` | Reference ID from the Exchange, for reconciliation. |

### Error Responses

| Status | `code` | Meaning |
|--------|--------|---------|
| 400 | `invalid_request` | Malformed Tron address or missing fields. |
| 402 | `insufficient_balance` | Not enough BRL in your account. |
| 503 | `not_configured` | On-ramp is not enabled for this environment. |
| 502 | `upstream_error` | Exchange is unavailable or market is closed. |

---

## Retrieve an On-ramp Record

On-ramp operations are stored as standard payouts and are accessible with the same merchant-scoped key used to create them.

```
GET /payouts/{id}
```

`GET /payouts` (list) also returns on-ramp records alongside regular BRL payouts — no special filter needed.

---

## Settlement Types

| Type | Description |
|------|-------------|
| `D0` | Funds available same business day (if request is within market hours). Default. |
| `D1` | Next business day. |
| `D2` | Two business days. |

D0 typically offers a slightly wider spread than D1/D2.

---

## Market Hours

The Exchange operates during Brazilian business hours (BRT). On-ramp requests outside market hours will return a `502` error with message `"market closed"`. Check the indicative rates endpoint — if it returns a price, the market is open.

---

## Idempotency

On-ramp operations are not idempotent by default. If you need to retry, use the `Idempotency-Key` header:

```
Idempotency-Key: <your-unique-key>
```

Repeating the same key with the same body returns the original response.

---

## Full Example

```bash
# 1. Check indicative price
curl https://api.dinaria.com/payouts/rates?settlement=D0 \
  -H "Authorization: Bearer di_live_..."

# 2. Execute on-ramp (synchronous — no polling needed)
curl -X POST https://api.dinaria.com/payouts \
  -H "Authorization: Bearer di_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "1000.00",
    "currency": "BRL",
    "destination": {
      "identifierType": "tron_address",
      "identifierValue": "TUcVE7YGbVJ2oXe7e3MiHAGiDqEbVz1GkB",
      "name": "My USDT Wallet",
      "destinationCurrency": "USDT",
      "network": "mainnet",
      "settlement": "D0"
    }
  }'
```
