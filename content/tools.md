---
title: Tools
---

# Sandbox tools

Merchant-facing utilities on the sandbox environment.

## API

| | |
|--|--|
| Base URL | Ask support |
| Auth | `Authorization: Bearer di_sand_…` |

Use this base for `POST /payments`, `POST /payouts`, `GET /balance`, webhooks, and simulate endpoints.

## Simulate a pay-in

After creating a payment in sandbox, drive it to `confirmed` without a real bank transfer. Use the 🇦🇷 / 🇧🇷 filter in the top bar to see only your country.

<div class="country-ar">

**Argentina (ARS):** `POST /sandbox/payments/{transactionId}/receive` with `{}` body.

</div>

<div class="country-br">

**Brasil (BRL):** `POST /trf/cashin/simulate` with `externalId`, `taxId`, and `amount`.

</div>

Full examples and matching rules: [Sandbox: Simulate a Pay-in](payments-sandbox-simulate.md).

## Portal login

| | |
|--|--|
| URL | Ask support |
| Username | Your account ID (e.g. `bpn`) — not the merchant ID |
| Password | Set by Dinaria for your sandbox account |

After login, direct merchants land on `/account/orders`; platform accounts on `/account/`.

## Admin pages

Hosted at ask support (session auth).

| Page | Path |
|------|------|
| Merchant payments | `/paytomerch/payments` |
| Merchant webhooks | `/paytomerch/webhooks` |

Credentials are provided by Dinaria when your sandbox account is provisioned.
