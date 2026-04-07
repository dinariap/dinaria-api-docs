---
title: Payments Redirect Flow
nav_order: 8
parent: Guides
---

# Completing a payment

After creating a payment, the response includes a `paymentData` object with the instructions the customer needs to complete the transfer.

## How it works
1. Merchant creates a payment (`POST /payments`)
2. API returns `paymentData` with transfer instructions
3. Merchant displays those instructions to the customer
4. Customer completes the bank transfer or PIX
5. Dinaria reconciles the incoming funds and marks the payment `confirmed`

## ARS — bank transfer

Display `paymentData.cbu` (or `paymentData.alias`) and `paymentData.reference` to the customer. Instruct them to initiate a CBU/CVU bank transfer and include the reference in the transfer description.

## BRL — PIX

Display `paymentData.pixKey` to the customer. Instruct them to open their bank app, initiate a PIX transfer to that key, and use `paymentData.reference` as the transfer description.

## Important
Never rely on a redirect for confirmation. Always confirm final state using:
- Webhooks (recommended) — listen for `payment.status_changed` with `status: "confirmed"`
- `GET /payments/{transactionId}`
