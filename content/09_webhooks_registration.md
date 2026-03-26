---
title: Registration
nav_order: 11
parent: Webhooks
---

# Webhook registration

## Register a URL

```
POST /webhooks/payments
```

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

Call once during setup, and again if your URL changes. Registering the same URL a second time rotates the secret.

### Response (201)

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments",
  "webhookSecret": "whsec_9f3c2a1b7d5e4c3a...",
  "createdAt": "2026-01-16T18:00:00Z"
}
```

> The `webhookSecret` is shown **only once**. Store it securely (e.g. in a secret manager). It cannot be retrieved again.

---

## List registered webhooks

```
GET /webhooks/payments
```

Returns all webhook URLs registered for your API key scope. Secrets are **not** included.

### Response

```json
{
  "object": "list",
  "data": [
    {
      "webhookUrl": "https://merchant.example/webhooks/payments",
      "scope": "merchant",
      "createdAt": "2026-01-16T18:00:00Z"
    }
  ]
}
```

---

## Deregister a URL

```
DELETE /webhooks/payments
```

```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

Returns `204 No Content` on success. Any pending deliveries for this URL are also removed.

---

## Scoping

The scope of events delivered depends on the API key used to register:

| Key type | Events delivered |
|----------|-----------------|
| Merchant-scoped key | Only events for that merchant |
| Account-scoped key | Events for all merchants under the account |
