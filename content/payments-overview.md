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

After creating a payment, the response includes a `paymentData` object with the instructions the customer needs to complete the transfer. The available methods depend on the country.

<div class="country-ar">

### Argentina (ARS)

| `paymentMethod` (request) | `paymentData.type` (response) | What to display |
|---|---|---|
| `bank_transfer` *(default)* | `bank_transfer` | `cbu` or `alias` + `reference` — customer makes a bank transfer |

> Dynamic-QR collection is **not yet available for ARS**. Static CBU/CVU transfers remain the default and only method for Argentina today. PIX-style QR support is on the roadmap.

</div>

<div class="country-br">

### Brasil (BRL)

| `paymentMethod` (request) | `paymentData.type` (response) | What to display |
|---|---|---|
| `instant_bank_transfer` *(default)* | `pix_transfer` | `pixKey` + `reference` — customer sends a PIX to that key |
| `pix_qr` | `pix_qr` | `qrCodeString` / `qrCodeBase64` + `qrExpiresAt` — customer scans the dynamic QR |

**Choosing a method.** Brazil supports two PIX collection methods that you select per-payment via `paymentMethod`:

- **`instant_bank_transfer`** *(default)* — a static PIX deposit key is returned. Reconciliation matches the incoming credit by the payer's CPF/CNPJ + amount, and the order expiration is fully controlled by `expiresAfter` / `expiration` (default 24h).
- **`pix_qr`** — a per-order **dynamic** PIX QR (BR-Code) is minted by Dinaria at create time. The response includes `qrCodeString` (EMV/TLV string for QR libraries or copy-and-paste PIX) and `qrCodeBase64` (drop-in PNG). The QR — and the order — expire in **15 minutes**. Reconciliation uses the QR's embedded `externalId` for guaranteed 1:1 matching, which is the most reliable option when the same amount may be paid by multiple customers or when you don't know the payer's CPF/CNPJ in advance.

</div>

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

