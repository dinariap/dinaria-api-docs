---
title: Choose Your Integration
parent: Get Started
---

# Choose your integration

Start with the outcome you want to offer your customer. The three paths use the same authentication, idempotency, error, and webhook conventions, but each represents a different money movement.

| Customer outcome | Integration path | Start here |
|---|---|---|
| Pay for an order or service | Create a single-use Payment and wait for confirmation. | [Payment Quickstart](getting-started-quickstart.md) |
| Receive funds repeatedly | Create a Customer, provision a persistent Virtual Account, and process incoming funds as Payments. | [Virtual Account Quickstart](getting-started-virtual-account.md) |
| Receive a disbursement | Ensure sufficient prefunded balance, create a Payout, and track its asynchronous result. | [Payout Quickstart](getting-started-payout.md) |

```text
Accept money     Customer payment → Payment → confirmed

Receive money    Customer → Virtual Account → incoming Payment

Send money       Prefunded available balance → Payout → beneficiary
```

Country, rail, and configured use case determine the required identity and destination fields. Check the [Country & Capability Matrix](country-capabilities.md) before building a request.

## Shared integration rules

- Authenticate with `Authorization: Bearer <API_KEY>`.
- Use a unique `Idempotency-Key` for each create operation and reuse it only when retrying the exact same request.
- Treat create responses as resource acceptance, not always as final financial completion.
- Process signed webhooks idempotently and retrieve the resource when the current state is uncertain.
