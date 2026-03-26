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

To rotate a **merchant-scoped** registration:

```json
{
  "merchantId": "my_merchant_1",
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

To rotate an **account-scoped** registration (omit `merchantId`):

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

## Response

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
