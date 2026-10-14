---
title: Webhook Event Types
nav_order: 20
parent: Webhooks
---

# Webhook event types

V2 webhook deliveries contain the complete current resource in `data.object` and identify the event in `eventType`. A single webhook registration using API version `2` can receive Payment, Refund, Payout, and Virtual Account events at the same URL.

| Resource | Event types | Public statuses |
|---|---|---|
| Payment | `payment.created`, `payment.status_changed` | `started`, `pending`, `confirmed`, `cancelled`, `expired`, `failed`, `refunded` |
| Refund | `refund.created`, `refund.status_changed` | `pending`, `succeeded`, `failed` |
| Payout | `payout.created`, `payout.status_changed` | `processing`, `confirmed`, `failed`, `cancelled`, `reversed` |
| Virtual Account | `virtual_account.created`, `virtual_account.status_changed` | `pending`, `active`, `blocked`, `closed`, `failed` |

`payout.created` means the payout was durably accepted and persisted. The Payout resource normally has `status: processing`; `created` is an event name, not a payout status.

## V2 envelope

| Field | Description |
|---|---|
| `eventId` | Stable UUID used for deduplication. |
| `eventType` | Event name from the table above. |
| `apiVersion` | `"2"`. |
| `merchantId` | Merchant that owns a Payment, Refund, or Payout resource. |
| `creationDate` | Event time for Payment, Refund, and Payout events. |
| `createdAt` | Event time for Virtual Account events. |
| `resourceVersion` | Monotonic version used to reject out-of-order updates. |
| `previousStatus` | Previous public status; omitted when it does not apply. |
| `data.object` | Complete current resource representation. |

## Payout example

```json
{
  "eventId": "55f81c7d-989a-40fe-a8ef-f9354ca6688a",
  "eventType": "payout.status_changed",
  "apiVersion": "2",
  "merchantId": "merchant-123",
  "creationDate": "2026-09-10T20:00:00Z",
  "resourceVersion": 2,
  "previousStatus": "processing",
  "data": {
    "object": {
      "payoutId": "82e07c90-82a5-4e40-bdf0-7a982de47745",
      "externalId": "PAYOUT-1001",
      "source": { "amount": "1.00", "currency": "USDT" },
      "destination": {
        "country": "VE",
        "currency": "VES",
        "amount": "36.50",
        "beneficiary": {
          "type": "individual",
          "name": "Maria Gonzalez",
          "documentType": "RIF",
          "documentNumber": "V27127416",
          "mobile": "+584242005748"
        },
        "rail": { "type": "ve_mobile_payment", "bankCode": "0102" }
      },
      "status": "confirmed",
      "bankSystemTrxId": "BANK-908172",
      "creationDate": "2026-09-10T19:56:45Z",
      "confirmationDate": "2026-09-10T20:00:00Z"
    }
  }
}
```

Webhook delivery is at least once and events can arrive out of order. Deduplicate by `eventId` and store the greatest `resourceVersion` processed for each resource.

Deposits into a Virtual Account are reported through Payment events. The Payment object identifies the receiving `virtualAccountId` and may include payer data. Virtual Account events describe creation and lifecycle changes of the account itself.
