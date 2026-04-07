---
title: Payments Overview
nav_order: 6
parent: Guides
---

# Payments

Payments are the core resource of the Payment API.

A payment represents a transaction initiated by the merchant and completed by the customer.

## Key fields
- `transactionId`: platform-generated payment identifier
- `externalId`: merchant-provided identifier (order/checkout reference)
- `metadata`: payment-level free-form key-value data

## Where funds go

Payments are credited to an **operating account** for the payment currency.

## Payment instructions — `paymentData`

After creating a payment, the response includes a `paymentData` object with the instructions the customer needs to complete the transfer.

| Currency | `paymentData.type` | What to display |
|---|---|---|
| ARS | `bank_transfer` | `cbu` or `alias` + `reference` — instruct the customer to make a bank transfer |
| BRL | `pix_transfer` | `pixKey` + `reference` — instruct the customer to send a PIX to that key |

## nextAction (Advanced UI)

`nextAction` is optional and intended for advanced integrations building their own UI.
It carries action-specific payloads (voucher details, QR codes, or required customer fields).

### Types

| type | When you may see it | What to do (advanced UI) |
|---|---|---|
| `redirect_to_url` | Authorization/hosted redirect flows | Redirect to `details.url` |
| `display_qr` | Methods that provide a QR payload (e.g., PIX, UPI, PromptPay) | Render QR from `details.qr.payload` (or use `details.qr.imageUrl`) |
| `display_instructions` | Transfer instructions (CLABE/CVU/IBAN + reference) | Show `details.transfer` and `details.instructions` |
| `display_voucher` | Cash pay-in vouchers (barcode / QR / numeric) | Render voucher and show steps |
| `display_reference` | Reference-only methods | Show `details.reference` and instructions |
| `collect_customer_data` | Hosted flow needs more customer data | Collect the required fields, then retry or continue via hosted flow |
| `none` | No user action needed | Nothing |

### Example: QR-based completion

```json
{
  "nextAction": {
    "type": "display_qr",
    "details": {
      "qr": {
        "payload": "00020126...6304ABCD",
        "format": "EMVCO",
        "expiresAt": "2026-03-01T20:00:00Z"
      },
      "instructions": ["Open your bank app", "Scan the QR", "Confirm the payment"],
      "method": { "scheme": "PIX", "country": "BR" }
    }
  }
}
```

