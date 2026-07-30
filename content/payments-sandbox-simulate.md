---
title: Sandbox — Simulate a Pay-in
---

# Sandbox: simulate a pay-in

After `POST /payments` returns `status: "started"`, call a simulate endpoint to inject the inbound transfer. The reconciler matches it to your open order within about **10–15 seconds**.

Use the **🇦🇷 Argentina / 🇧🇷 Brasil** buttons in the top bar to show only the section for your integration. Click the active button again to show both.

---

## Authentication

Every simulate call requires your sandbox merchant API key:

```http
Authorization: Bearer di_sand_xxx
Content-Type: application/json
```

The payment must belong to the **same account** as the API key. A valid key with another tenant's `transactionId` returns `404 payment not found for this account`.

Set these once for the examples below:

```bash
SANDBOX_URL="ask support"
API_KEY="di_sand_xxx"
TRANSACTION_ID="<transactionId from POST /payments>"
```

---

## Simulate endpoint

<div class="country-ar">

### Argentina (ARS)

#### Recommended — `POST /sandbox/payments/{transactionId}/receive`

An **empty body** is the common case. Amount and payer document default from the payment row.

```bash
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

**Optional overrides** — for underpayment, overpayment, or wrong-payer tests. Each field defaults to the payment row when omitted.

```json
{
  "amount": "1499.00",
  "documentNumber": "20999999999",
  "name": "Other Payer",
  "fromAccount": "2850590940090418135201"
}
```

**Matching rules.** The reconciler binds the simulated transfer using `customer.documentNumber` (CUIT/CUIL) and `amount`. If either differs from the payment you created, the order stays `started`.

#### Legacy — `POST /ars/cashin/simulate`

Use when you need explicit control over every inbound field:

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

### Brasil (BRL)

`POST /sandbox/payments/{transactionId}/receive` returns **`501 Not Implemented`** for BRL today. Use the simulate endpoint below.

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

**Matching rules.** All three must match the open `started` payment:

- `externalId`
- `taxId` — same value as `customer.documentNumber` (CPF or CNPJ)
- `amount`

</div>

---

## Verify confirmation

Poll the payment (or wait for your webhook):

```bash
curl "$SANDBOX_URL/payments/$TRANSACTION_ID" \
  -H "Authorization: Bearer $API_KEY"
```

<div class="country-ar">

**Expected (ARS):**

```json
{
  "transactionId": "ae36f8ef-4c4a-4a11-9400-945b8616bfe1",
  "status": "confirmed",
  "reconciliationStatus": "matched",
  "amount": "1500.00",
  "currency": "ARS",
  "receivedAmount": "1500.00"
}
```

</div>

<div class="country-br">

**Expected (BRL):**

```json
{
  "transactionId": "f90c7c31-7a38-46dc-99ba-188a4c99da29",
  "status": "confirmed",
  "reconciliationStatus": "matched",
  "amount": "100.00",
  "currency": "BRL",
  "receivedAmount": "100.00"
}
```

</div>

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `404 payment not found for this account` | Wrong `transactionId`, or API key from a different account |
| `401` / `invalid API key` | Missing or revoked Bearer token |
| `409 payment is not awaiting receipt` | Payment already `confirmed`, `cancelled`, or `expired` |

<div class="country-ar">

| Symptom | Likely cause |
|---------|----------------|
| Payment stays `started` after simulate | `customer.documentNumber` or `amount` does not match the payment row — use `{}` on `/receive` for the happy path |

</div>

<div class="country-br">

| Symptom | Likely cause |
|---------|----------------|
| Payment stays `started` after simulate | `externalId`, `taxId`, or `amount` on `/trf/cashin/simulate` does not match the payment |
| `501` on `/sandbox/payments/.../receive` | Expected for BRL — use `POST /trf/cashin/simulate` |

</div>

---

## Portal and admin (sandbox)

| Tool | URL |
|------|-----|
| API base | Ask support |
| Merchant portal login | Ask support |

Portal login uses your **account ID** (e.g. `bpn`) and password — not the API key.
