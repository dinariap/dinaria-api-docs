---
title: Webhook Registration
nav_order: 11
parent: Webhooks
---

# Registering (configuration)

Use this endpoint to register the URL where payment status updates will be delivered.

This is a **configuration** endpoint called by the merchant.

## Endpoint
```
POST /webhooks/payments
```

## Example request
```json
{
  "webhookUrl": "https://merchant.example/webhooks/payments"
}
```

## Notes
- Call once during setup, and again if your URL changes.
- This endpoint does **not** deliver events.
