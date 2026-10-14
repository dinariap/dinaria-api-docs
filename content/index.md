# Dinaria API V2

Integrate local payments, payouts, refunds, balances, customers, virtual accounts, and webhooks through one consistent API.

## Environments

| Environment | Base URL |
|---|---|
| Sandbox | `https://sbx.dinaria.com` |
| Production | `https://payments.dinaria.com` |

Authenticate every request with `Authorization: Bearer <API_KEY>`. Use an `Idempotency-Key` for every create or mutation request that supports it.

## Start here

| Guide | Purpose |
|---|---|
| [Choose your integration](getting-started-choose-integration.md) | Start from the customer outcome: accept, receive, or send money. |
| [Payment Quickstart](getting-started-quickstart.md) | Create and track your first Payment. |
| [Virtual Account Quickstart](getting-started-virtual-account.md) | Create a Customer and a persistent receiving account. |
| [Payout Quickstart](getting-started-payout.md) | Send funds from a prefunded available balance. |
| [Authentication and idempotency](authentication-idempotency.md) | Choose credential scope and prevent duplicate mutations. |
| [Country and capability matrix](country-capabilities.md) | Find supported currencies, methods, rails, and modes. |
| [Errors and failures](payments-errors-retries.md) | Handle HTTP errors and asynchronous resource failures. |

## Money in

Use [Payments](payments-overview.md) for single-use or reusable collection experiences, including local bank transfers, QR, and Binance Pay. Use [Customers](customers.md) and [Virtual Accounts](virtual-accounts.md) when your integration needs a persistent receiving account linked to a known customer. Refund eligible confirmed payments through the [Refund API](payments-refunds.md).

## Money out

Use [Payouts](payouts-overview.md) to send funds from a prefunded available balance to local beneficiary rails. Creation starts an asynchronous lifecycle; webhooks communicate the final outcome.

## Operational APIs

- [Balance](accounts-balance.md)
- [Sandbox simulation](payments-sandbox-simulate.md)
- [Webhook subscriptions and events](webhooks-overview.md)
- [API Reference](#apiref)

Field requirements can vary by country, rail, and configured use case. Examples are illustrative and do not make every shown field universally required or optional.
