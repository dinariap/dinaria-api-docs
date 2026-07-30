---
title: Security
nav_order: 13
parent: Webhooks
---

# Webhook security & signature verification

All webhook events are signed so you can verify their authenticity and integrity.

**Always verify the signature before processing any webhook event.**

---

## Headers

| Header | Description |
|--------|-------------|
| `X-Webhook-Timestamp` | Unix timestamp (seconds) |
| `X-Webhook-Signature` | Signature header (see format below) |

Example (normal):

```http
X-Webhook-Timestamp: 1737000000
X-Webhook-Signature: t=1737000000,v1=9d0c...ab12
```

Example (during secret rotation grace period — both v1 and v2 present):

```http
X-Webhook-Timestamp: 1737000000
X-Webhook-Signature: t=1737000000,v1=9d0c...ab12,v2=3e7f...cc99
```

---

## Signature algorithm

**Signed payload:**

```
<timestamp>.<raw_body>
```

**Signature:**

```
HMAC_SHA256(webhookSecret, signed_payload)
```

> The full secret string including the `whsec_` prefix is used as the HMAC key.

---

## Verification rules

1. Extract `t` (timestamp) and `v1` from `X-Webhook-Signature`.
2. Reject if `|now - t| > 300` (5 minutes).
3. Compute `HMAC_SHA256(secret, "<t>.<raw_body>")`.
4. Compare with `v1` using **constant-time comparison**.
5. If `v1` fails and `v2` is present (rotation grace period), retry with your **previous** secret.
6. Reject if all checks fail.

---

## Code examples

### Node.js

```javascript
const crypto = require('crypto');

function verifyWebhook(rawBody, signatureHeader, secret) {
  const parts = Object.fromEntries(
    signatureHeader.split(',').map(p => p.split('=', 2))
  );
  const timestamp = parts['t'];
  if (!timestamp) return false;

  // Reject stale events (±5 minutes)
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) return false;

  const signed = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signed)
    .digest('hex');

  const v1 = parts['v1'] || '';
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}
```

### Python

```python
import hashlib, hmac, time

def verify_webhook(raw_body: bytes, signature_header: str, secret: str) -> bool:
    parts = dict(p.split('=', 1) for p in signature_header.split(','))
    timestamp = parts.get('t')
    if not timestamp:
        return False

    # Reject stale events (±5 minutes)
    if abs(time.time() - int(timestamp)) > 300:
        return False

    signed = f"{timestamp}.{raw_body.decode()}".encode()
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    v1 = parts.get('v1', '')
    return hmac.compare_digest(expected, v1)
```
