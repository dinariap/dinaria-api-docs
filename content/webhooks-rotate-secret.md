---
title: Rotate Webhook Secret
nav_order: 15
parent: Webhooks
---

# Rotate a V2 webhook secret

```http
POST https://api.sandbox.dinaria.com/v2/webhooks/{webhookId}/rotate-secret
Authorization: Bearer <YOUR_API_KEY>
```

The response returns the subscription with the new `webhookSecret`. Store it securely; secrets are only returned at creation and rotation.

The previous secret remains valid for 24 hours:

1. Add the new secret to your verifier.
2. During the overlap, accept a signature matching either active secret.
3. Deploy and confirm that deliveries verify successfully.
4. Remove the previous secret after the 24-hour window.

During rotation, `X-Webhook-Signature` can contain multiple `v1` entries. A delivery is valid when any digest matches an active secret.

See [Webhook Security](webhooks-security.md) for the signing algorithm.
