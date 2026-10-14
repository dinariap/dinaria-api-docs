---
title: Balances
---

# Merchant balances

`GET /v2/balance` returns available balances for one merchant. Amounts are decimal strings.

## Request

```bash
curl "https://sbx.dinaria.com/v2/balance?currency=ARS" \
  --header "Authorization: Bearer <API_KEY>"
```

With a merchant credential, the merchant is inferred. With an account credential, add `merchantId` when the account can access multiple merchants:

```bash
curl "https://sbx.dinaria.com/v2/balance?merchantId=merchant_demo_001&currency=ARS" \
  --header "Authorization: Bearer <ACCOUNT_API_KEY>"
```

The required scope is `balances:read`. A credential that still carries the documented compatibility scope `payments:read` may be accepted according to the API contract, but new integrations should request `balances:read`.

## Response

```json
{
  "merchantId": "merchant_demo_001",
  "balances": [
    {
      "currency": "ARS",
      "available": "10000.00"
    }
  ]
}
```

| Field | Description |
|---|---|
| `merchantId` | Merchant that owns the balances. |
| `balances` | Available balances by currency. |
| `balances[].currency` | Currency code. |
| `balances[].available` | Available amount represented as a decimal string. |

The response describes the current merchant balance. It does not expose internal ledger entries, routing, or provider settlement state.

## Errors

| HTTP | Meaning |
|---:|---|
| `400` | Invalid merchant or currency filter. |
| `401` | Missing or invalid credentials. |
| `403` | The credential lacks access or the required scope. |
| `503` | The balance dependency is temporarily unavailable. |

Retain `requestId` from error responses when contacting support.
