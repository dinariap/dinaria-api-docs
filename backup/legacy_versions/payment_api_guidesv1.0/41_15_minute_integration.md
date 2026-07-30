---
title: 15-Minute Integration
nav_order: 19
parent: Guides
---

# Dinaria in 15 Minutes

Dinaria allows you to move money.

Receiving funds and sending funds are **independent capabilities**.

Payouts are always balance-driven.

---

## Part 1 — Receiving Funds (Optional)

Use this if your payouts are funded by incoming payments.

### Create a Payment

```http
POST /payments
```

```json
{
  "amount": "1000",
  "currency": "ARS"
}
```

Redirect the payer:

```js
window.location = payment.actionUrl;
```

Wait for:

```
payment.status_changed
```

Once confirmed:

Funds become available in your operating account.

---

## Part 2 — Funding Your Account

Payouts do **not require** incoming payments.

Your operating account can be prefunded.

This is common for:

- payroll
- treasury payouts
- scheduled disbursements
- cash networks

Payouts use available balance.

---

## Part 3 — Sending Funds

### Define the Beneficiary

```json
{
  "firstName": "Juan",
  "lastName": "Perez"
}
```

A beneficiary is the payout destination.

---

### Same-Currency Payout

```http
POST /payouts
```

```json
{
  "amount": "1000",
  "currency": "ARS",
  "beneficiary": {
    "firstName": "Juan",
    "lastName": "Perez"
  },
  "destination": {
    "type": "bank",
    "accountNumber": "00012345"
  }
}
```

---

### Cross-Currency Payout (FX)

Option 1 — Quote:

```http
POST /fx/quotes
```

Option 2 — Auto-quote:

```http
POST /payouts
```

```json
{
  "amount": "50",
  "currency": "USD",
  "autoQuote": true,
  "destinationCurrency": "ARS",
  "beneficiary": {
    "firstName": "Juan",
    "lastName": "Perez"
  },
  "destination": {
    "type": "bank",
    "accountNumber": "00012345"
  }
}
```

---

### Cash Payout

Cash is simply a payout rail.

```http
POST /cash/withdrawals
```

---

## Done

You can:

✔ Receive funds  
✔ Prefund your account  
✔ Send payouts  

Dinaria is now integrated.


### Advanced UI (optional)

If you don't want to redirect, read `nextAction`:

- `display_qr` → render a QR code from `nextAction.details.qr.payload`
- `display_voucher` → render barcode/QR/numeric voucher
- `display_instructions` → show transfer instructions

`actionUrl` remains the universal hosted fallback.

