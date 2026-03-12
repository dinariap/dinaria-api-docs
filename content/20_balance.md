---
title: Balance
---

# Account Balance

`GET /balance`

Returns the current balance for your account, broken down by currency.

---

## Request

```http
GET /balance
Authorization: Bearer di_live_<your-account-key>
```

This endpoint requires an **account-scoped API key** — not a merchant key.

---

## Response

```json
{
  "accountId": "acme_br",
  "balances": [
    { "currency": "BRL", "balance": "34.60" }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `accountId` | string | Your account identifier. |
| `balances` | array | One entry per currency held. Empty if no funds have been recorded yet. |
| `balances[].currency` | string | ISO 4217 currency code, e.g. `BRL`, `ARS`. |
| `balances[].balance` | string | Current balance as a decimal string. |

---

## Notes

- Balance reflects the **net of all confirmed payins minus completed payouts** for this account.
- A new account with no activity returns `"balances": []`.
- Balance is tracked per currency — an account active in both ARS and BRL will have two entries.
