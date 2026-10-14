---
title: Sandbox Simulation
parent: Money In
---

# Sandbox simulation

Use the simulation endpoint to request a deterministic observation for an existing sandbox Payment. Simulation uses the normal Payment resource and produces the same public lifecycle webhooks as any other status change.

## Request

```http
POST /v2/sandbox/payments/{transactionId}/simulate
Authorization: Bearer <API_KEY>
Content-Type: application/json
Idempotency-Key: simulate-order-1001-confirmed-v1
```

```bash
curl --request POST \
  "https://sbx.dinaria.com/v2/sandbox/payments/8dd5d1ee-1ba0-4311-bbbd-fd19765b2f93/simulate" \
  --header "Authorization: Bearer <API_KEY>" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: simulate-order-1001-confirmed-v1" \
  --data '{
    "scenario": "payment.confirmed",
    "delaySeconds": 0,
    "payer": {
      "name": "Juan Pérez",
      "documentType": "CUIT",
      "documentNumber": "20234567897",
      "institution": {
        "name": "Banco de Prueba"
      }
    }
  }'
```

`payer` is optional and lets a test describe the observed sender without changing the Payment owner or customer.

## Scenarios

| Scenario | Requested observation |
|---|---|
| `payment.pending` | Processing remains pending. |
| `payment.confirmed` | The payment method confirms receipt. |
| `payment.rejected` | A definitive rejection is observed. |
| `payment.expired` | The payment expires without completion. |

The capability selected for the Payment determines which scenarios it accepts. The scenario controls test behavior but never changes the normal Payment or webhook schemas.

## Response

```json
{
  "simulationId": "9e077dd5-66f5-4773-b265-7dd6a8f5c227",
  "transactionId": "8dd5d1ee-1ba0-4311-bbbd-fd19765b2f93",
  "requestedScenario": "payment.confirmed",
  "status": "accepted",
  "scheduledAt": "2026-10-14T18:05:00Z"
}
```

HTTP `202` means the simulation was durably accepted. Retrieve the Payment or process `payment.status_changed` to obtain the resulting public state.

Simulation is a sandbox testing mechanism. It does not describe production processing times or operational availability.
