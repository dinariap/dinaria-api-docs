---
title: Tools
---

# Sandbox tools

Merchant-facing utilities on the sandbox environment.

## API

| | |
|--|--|
| Base URL | `https://api.sandbox.dinaria.com` |
| Auth | `Authorization: Bearer di_sand_…` |

Use this base for `POST /payments`, `POST /payouts`, `GET /balance`, webhooks, and simulate endpoints.

## Simulate a pay-in

After creating a payment in sandbox, drive it to `confirmed` without a real bank transfer:

- **ARS:** `POST /sandbox/payments/{transactionId}/receive` (empty body)
- **BRL:** `POST /trf/cashin/simulate`

See [Sandbox: Simulate a Pay-in](19_sandbox_cashin_simulation.md).

## Portal login

| | |
|--|--|
| URL | `https://sandbox.dinaria.com/login` |
| Username | Your account ID (e.g. `bpn`) — not the merchant ID |
| Password | Set by Dinaria for your sandbox account |

After login, direct merchants land on `/account/orders`; platform accounts on `/account/`.

## Admin pages

Hosted at `https://admin.sandbox.dinaria.com` (session auth).

| Page | Path |
|------|------|
| Merchant payments | `/paytomerch/payments` |
| Merchant webhooks | `/paytomerch/webhooks` |
| Operator dashboard | `/pay/` |

Credentials are provided by Dinaria when your sandbox account is provisioned.
