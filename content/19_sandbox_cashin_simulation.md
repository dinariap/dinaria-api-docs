---
title: Sandbox — Simulate a Pay-in
---

# Sandbox: simulate a pay-in

> **Sandbox only.** These endpoints are available on `https://api.sandbox.dinaria.com` and are **not** exposed in production.

After `POST /payments` returns `status: "started"`, call a simulate endpoint to inject the inbound transfer. The reconciler matches it to your open order within about **10–15 seconds**.

## Authentication

Every simulate call requires your sandbox merchant API key:

```http
Authorization: Bearer di_sand_xxx
Content-Type: application/json
```

The payment must belong to the **same account** as the API key. A valid key with another tenant's `transactionId` returns `404 payment not found for this account`.

---

## Recommended: unified receive endpoint (ARS)

For Argentine (ARS) payments, use a single endpoint that defaults amount and payer document from the payment row. An **empty body** is the common case.

```bash
SANDBOX_URL="https://api.sandbox.dinaria.com"
API_KEY="di_sand_xxx"
TRANSACTION_ID="ae36f8ef-4c4a-4a11-9400-945b8616bfe1"

curl -X POST "$SANDBOX_URL/sandbox/payments/$TRANSACTION_ID/receive" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**

```json
{
  "status": "queued",
  "paymentId": "ae36f8ef-4c4a-4a11-9400-945b8616bfe1",
  "eventId": "MOCK-AVISO-6004c9e8-0c0d-4b53-9067-5dea1ecc0b2d"
}
```

### Optional overrides (ARS)

Use these fields to test mismatch, underpayment, or overpayment scenarios. Each defaults to the matching value on the payment row when omitted.

```json
{
  "amount": "1499.00",
  "documentNumber": "20999999999",
  "name": "Other Payer",
  "fromAccount": "2850590940090418135201"
}
```

---

<div class="country-ar">

## Argentina (ARS)

### Matching rules

The reconciler matches the simulated inbound transfer to your payment using:

- `customer.documentNumber` (CUIT/CUIL) on the payment order
- `amount`

If either field differs from what you sent at payment creation, the order stays `started`.

### Legacy route (still supported)

If you need explicit control over every wire field, `POST /ars/cashin/simulate` remains available:

```bash
curl -X POST "$SANDBOX_URL/ars/cashin/simulate" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cbu": "2850590940090418135201",
    "cuit": "20234567897",
    "amount": "1500.00",
    "idTrxCliente": "9032000000000000023",
    "nombre": "Juan Pérez"
  }'
```

`idTrxCliente` should match `paymentData.reference` from the create-payment response when testing reference-based matching.

</div>

<div class="country-br">

## Brasil (BRL)

`POST /sandbox/payments/{transactionId}/receive` returns **`501 Not Implemented`** for BRL today. Use the dedicated simulate endpoint instead.

```bash
curl -X POST "$SANDBOX_URL/trf/cashin/simulate" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "BRL",
    "externalId": "ORD-1001",
    "taxId": "12345678901",
    "payerName": "João Silva"
  }'
```

### Matching rules

The reconciler matches using:

- `externalId` — must match the payment's `externalId`
- `taxId` — must match `customer.documentNumber` (CPF or CNPJ)
- `amount`

All three must align with the open `started` payment.

</div>

---

## Verify confirmation

Poll the payment (or wait for your webhook):

```bash
curl "$SANDBOX_URL/payments/$TRANSACTION_ID" \
  -H "Authorization: Bearer $API_KEY"
```

Expected when matched:

```json
{
  "transactionId": "ae36f8ef-4c4a-4a11-9400-945b8616bfe1",
  "status": "confirmed",
  "reconciliationStatus": "matched",
  "receivedAmount": "1500.00"
}
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Payment stays `started` after simulate | `documentNumber` / `externalId` / `amount` mismatch with the payment row |
| `404 payment not found for this account` | Wrong `transactionId`, or API key from a different account |
| `401` / `invalid API key` | Missing or revoked Bearer token |
| `409 payment is not awaiting receipt` | Payment already `confirmed`, `cancelled`, or `expired` |
| BRL `501` on `/sandbox/payments/.../receive` | Use `POST /trf/cashin/simulate` instead |

---

## Portal and admin (sandbox)

| Tool | URL |
|------|-----|
| API base | `https://api.sandbox.dinaria.com` |
| Merchant portal login | `https://sandbox.dinaria.com/login` |
| Operator admin | `https://admin.sandbox.dinaria.com/paytomerch/payments` |

Portal login uses your **account ID** (e.g. `bpn`) and password — not the API key.
