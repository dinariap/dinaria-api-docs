---
title: Money Movement Model
parent: Core Concepts
---

# Money movement model

Dinaria separates inbound and outbound resources while presenting a consistent public lifecycle.

## Money in

A Payment describes an amount a customer should pay. Create it with `POST /v2/payments`, show the returned `actionUrl` or structured `paymentData`, and wait for a signed webhook or retrieve the Payment before fulfilling the order.

A Virtual Account is a persistent receiving destination linked to a Customer. Funds received into it are still represented as Payments, which identify the relevant `virtualAccountId`.

Refunds reverse all or part of an eligible Payment. They are Money In lifecycle resources, not Payouts.

## Balance

`GET /v2/balance` reports the available amount by currency for the selected merchant. Available funds may come from successful inbound Payments or from a separate prefunding process, according to the configured financial model. Always read the balance rather than deriving it from Payment or Payout history.

## Money out

A Payout sends funds from a prefunded available balance to a beneficiary. Creation durably accepts the instruction and starts in `processing`; final delivery is asynchronous. Track `payout.status_changed` and retrieve the resource when reconciling.

```text
Customer payment ──→ Payment ──────┐
                         └──→ Refund ──→ customer
                                   │
External prefunding ───────────────┴──→ available balance ──→ Payout ──→ beneficiary
```

Prefunding is a prerequisite for a Payout when sufficient funds are not already available. It is separate from creating the Payout and is not represented by `POST /v2/payouts`.

Country-specific rails determine the fields required to complete either direction. See the [country and capability matrix](country-capabilities.md).
