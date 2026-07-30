# Dinaria API

Move money across payment methods, currencies, and payout rails through a single unified API.

---

## Get Started

| | |
|---|---|
| [**Quickstart**](#getting-started-quickstart.md) | Get your first payment running in minutes. |
| [**15-Minute Integration**](#getting-started-15-minute.md) | Full end-to-end integration walkthrough. |
| [**Common Pitfalls**](#getting-started-common-pitfalls.md) | Errors developers hit most often and how to avoid them. |

---

## Core Concepts

| | |
|---|---|
| [**Money Movement Model**](#concepts-money-movement.md) | How funds flow through the platform — accounts, balances, and settlement. |
| [**Participants**](#concepts-participants.md) | Merchants, payers, and beneficiaries explained. |
| [**FX Handling**](#concepts-fx.md) | How foreign-exchange rates are applied and locked. |
| [**Data Formats**](#data-formats-iso.md) | Currency codes, amounts, timestamps, and identifiers. |

---

## Configuration

| | |
|---|---|
| [**Merchant Settings**](#merchant-settings.md) | Expiration windows, refund policy, payout flags, and more. |

---

## Money In

| | |
|---|---|
| [**Overview**](#payments-overview.md) | What a Dinaria payment is and how it works end-to-end. |
| [**Getting Started**](#payments-getting-started.md) | Base URLs, authentication, and your first API call. |
| [**Quickstart: First Payment**](#payments-quickstart.md) | Step-by-step guide to creating a payment. |
| [**Payment Lifecycle**](#payments-lifecycle.md) | All states a payment goes through from creation to settlement. |
| [**Create a Payment**](#payments-create.md) | Request reference for `POST /payments`. |
| [**Redirect Flow**](#payments-redirect-flow.md) | How to redirect payers to complete payment. |
| [**Retrieve a Payment**](#payments-retrieve.md) | Polling and fetching payment status. |
| [**Errors & Retries**](#payments-errors-retries.md) | Error codes, retry strategy, and idempotency. |
| [**Best Practices**](#payments-best-practices.md) | Recommendations for reliability and reconciliation. |
| [**Step-by-Step Example**](#payments-step-by-step.md) | A complete flow from order creation to confirmed receipt. |
| [**Sandbox: Simulate a Pay-in**](#payments-sandbox-simulate.md) | Drive a sandbox payment to `confirmed` without a real transfer. |

---

## Money Out

| | |
|---|---|
| [**Overview**](#payouts-overview.md) | Payout capabilities and supported rails. |
| [**Payout Flow**](#payouts-flow.md) | How a payout moves from request to bank credit. |
| [**Create a Payout**](#payouts-create.md) | Request reference for `POST /payouts`. |
| [**Retrieve & List Payouts**](#payouts-retrieve.md) | Fetch payout status and history. |

---

## Webhooks

| | |
|---|---|
| [**Overview**](#webhooks-overview.md) | What events Dinaria emits and when. |
| [**Registration**](#webhooks-registration.md) | Register your endpoint to receive events. |
| [**Receiving**](#webhooks-receiving.md) | Processing incoming webhook payloads. |
| [**Security**](#webhooks-security.md) | Signature verification and replay protection. |
| [**Verification Examples**](#webhooks-examples.md) | Code samples for verifying signatures in multiple languages. |
| [**Best Practices**](#webhooks-best-practices.md) | Reliability, ordering, and idempotency for event handlers. |
| [**Rotate Secret**](#webhooks-rotate-secret.md) | How to rotate your webhook signing secret safely. |
| [**Event Types**](#webhooks-event-types.md) | Full catalogue of event types and their payloads. |

---

## Crypto

| | |
|---|---|
| [**Overview**](#crypto-overview.md) | Supported on-chain operations and authentication. |
| [**Relay**](#crypto-relay.md) | Broadcast a pre-signed Tron transaction through Dinaria's node. |
| [**Settlement**](#crypto-settlement.md) | Convert BRL to USDT and deliver on-chain to any Tron address. |

---

## API Reference

The full OpenAPI specification is available in the [**API Reference**](#apiref) section.
