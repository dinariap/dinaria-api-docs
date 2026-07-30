---
title: Rotate Secret
nav_order: 15
parent: Webhooks
---

# Rotate webhook secret

Rotate your webhook signing secret at any time — for security hygiene, compliance, or after a suspected compromise.

```
POST /webhooks/payments/rotate-secret
```

## Request

JSON body — fields are optional unless you need to disambiguate:

| Field | When to use |
|-------|-------------|
| `webhookUrl` | When you have **more than one** URL registered under the same API key scope. |
| `merchantId` | **Account-scoped keys only:** rotate that **merchant’s** webhook; omit for the **account-level** registration. **Do not send** with a **merchant-scoped** key (merchant is implied by the key). |

**Merchant-scoped API key** (typical — no `merchantId`):

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

**Account-scoped API key** — merchant-specific webhook:

```json
{
  "merchantId": "my_merchant_1",
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

Equivalent paths: `/webhooks/payments/rotate`, `/webhooks/rotate-secret`, `/webhooks/rotate`.

**Account-scoped API key** — account-level webhook (omit `merchantId`; use `webhookUrl` if you have multiple URLs):

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

## Response

HTTP **200** on success.

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments",
  "webhookSecret": "whsec_2b91d0f6a1d34f0b...",
  "rotatedAt": "2026-01-17T18:10:00Z",
  "previousSecretExpiresAt": "2026-01-18T18:10:00Z"
}
```

## Notes

- The new `webhookSecret` is shown **only once** — store it immediately.
- The previous secret remains valid for **24 hours** after rotation (`previousSecretExpiresAt`).
- During the grace period, our platform signs each delivery with **both** the new and old secret:
  ```
  X-Webhook-Signature: t=1737000000,v1=<new_sig>,v2=<old_sig>
  ```
- Update your stored secret and verify with `v1`. If `v1` fails and `v2` is present, fall back to verifying with the old secret. This ensures zero-downtime rotation.
- Once `previousSecretExpiresAt` has passed, only `v1` is sent.
- Reverse proxies must forward **`/webhooks/`** subpaths (rotate URLs), not only an exact `/webhooks/payments` match, or rotation may return 404 at the edge.
