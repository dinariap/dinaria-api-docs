---
title: Merchant Settings
nav_order: 12
parent: Guides
---

# Merchant Settings

`PUT /merchants/{id}/settings`

Configure per-merchant behaviour for the matching engine and refund policy.

---

## Request

```http
PUT /merchants/{merchantId}/settings
Authorization: Bearer di_live_<your-key>
Content-Type: application/json
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `defaultExpirationHours` | number | — | How many hours an unmatched incoming bank system transfer is held before being automatically refunded. Must be > 0. Default: `12`. |
| `refundPolicy` | string | — | `"on_reception"` — refund immediately when no matching payment order is found. `"on_expiration"` — hold the incoming transfer for up to `defaultExpirationHours`, then refund if still unmatched. Default: `"on_reception"`. |

Both fields are optional — send only the ones you want to change.

---

## Expiration applies to incoming transfers, not to orders

Payment orders (`POST /payments`) never expire on their own — they remain `started` until matched or explicitly cancelled.

**Expiration** applies to **incoming bank system transfers** (cash-ins) that arrive with no matching order:

- If `refundPolicy = "on_reception"`: the transfer is refunded immediately.
- If `refundPolicy = "on_expiration"`: the reconciler re-checks for a matching order on every tick for up to `defaultExpirationHours`. If the window passes without a match, the transfer is refunded.

---

## Examples

### Set a 24-hour expiration window

```json
{
  "defaultExpirationHours": 24
}
```

### Switch to on-expiration refund policy

```json
{
  "refundPolicy": "on_expiration",
  "defaultExpirationHours": 6
}
```

### Revert to immediate refunds

```json
{
  "refundPolicy": "on_reception"
}
```

---

## Response

```json
{
  "merchantId": "merchant1",
  "defaultExpirationHours": 24,
  "refundPolicy": "on_expiration"
}
```

---

## Error responses

| Status | Code | Cause |
|--------|------|-------|
| `400` | `invalid_request` | `defaultExpirationHours` ≤ 0, or `refundPolicy` is not `"on_reception"` or `"on_expiration"` |
| `401` | `unauthorized` | Missing or invalid API key |
| `404` | `not_found` | Merchant not found or does not belong to your account |
