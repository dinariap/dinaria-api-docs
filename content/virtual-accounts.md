---
title: Virtual Accounts
---

# Virtual Accounts

A Virtual Account is a persistent receiving destination linked to one Customer. It is not a temporary destination created for a Payment and is not a reusable collection destination managed by Payments.

The initial public capability is an ARS CVU using `rail: ar_cvu`.

## Create a Virtual Account

Create the Customer first, then use its Dinaria `customerId`:

```http
POST https://sbx.dinaria.com/v2/virtual-accounts
Authorization: Bearer <API_KEY>
Content-Type: application/json
Idempotency-Key: va-customer-001-v1
```

```json
{
  "externalId": "VA-CUSTOMER-001",
  "customerId": "6b5dbb40-07ec-44f3-b210-a965c2bdb40d",
  "country": "AR",
  "currency": "ARS",
  "rail": "ar_cvu",
  "metadata": {
    "portfolio": "demo"
  }
}
```

With an account credential, include `merchantId` when the merchant cannot be inferred. Missing required fields cause the request to fail; Dinaria does not fill identity data with fallback values.

```json
{
  "virtualAccountId": "d4f2c79b-1d48-4edf-a34b-c5f131402728",
  "externalId": "VA-CUSTOMER-001",
  "customerId": "6b5dbb40-07ec-44f3-b210-a965c2bdb40d",
  "country": "AR",
  "currency": "ARS",
  "rail": "ar_cvu",
  "status": "active",
  "account": {
    "type": "cvu",
    "number": "0000003100098765432101",
    "alias": "demo.virtual.account",
    "institution": "Dinaria"
  },
  "customerSnapshot": {
    "customerId": "6b5dbb40-07ec-44f3-b210-a965c2bdb40d",
    "externalId": "CUSTOMER-001",
    "type": "individual",
    "firstName": "Juan",
    "lastName": "Pérez",
    "country": "AR",
    "documentType": "CUIT",
    "documentNumber": "20234567897",
    "documentCountry": "AR"
  },
  "creationDate": "2026-10-14T18:00:00Z",
  "activationDate": "2026-10-14T18:00:01Z",
  "resourceVersion": 2,
  "metadata": {
    "portfolio": "demo"
  }
}
```

Creation returns `201`. Provisioning may complete synchronously as `active` or continue asynchronously as `pending`.

## Retrieve and list

```http
GET /v2/virtual-accounts/{virtualAccountId}
GET /v2/virtual-accounts?customerId={customerId}&status=active&limit=20
```

Lists are cursor-paginated and can be filtered by `merchantId`, `customerId`, `externalId`, and `status` as defined in the API Reference.

## Statuses

| Status | Meaning |
|---|---|
| `pending` | Provisioning is still in progress. |
| `active` | The destination can receive funds. |
| `blocked` | Receiving is reversibly disabled. |
| `closed` | The destination is permanently disabled. |
| `failed` | Provisioning failed terminally. |

## Block, reactivate, or close

Each lifecycle operation requires `Idempotency-Key` and a reason body:

```http
POST /v2/virtual-accounts/{virtualAccountId}/block
POST /v2/virtual-accounts/{virtualAccountId}/activate
POST /v2/virtual-accounts/{virtualAccountId}/close
```

```json
{ "reason": "merchant_request" }
```

Blocking is reversible. Closing is permanent. A close operation may return the account already closed or still pending completion.

## Deposits

A deposit may be made by a person different from the Customer who owns the Virtual Account. Funds received through a Virtual Account are represented as a public Payment and may include:

- `virtualAccountId`, identifying the persistent destination;
- `payer`, identifying the observed depositor when available;
- the standard Payment amount, currency, status, and lifecycle.

Process the deposit through the standard Payment webhooks and retrieve the Payment by `transactionId`. Do not treat the depositor as the Virtual Account owner.

## Webhooks

Virtual Account lifecycle events are:

- `virtual_account.created`
- `virtual_account.status_changed`

They use `createdAt`, `resourceVersion`, and the complete Virtual Account in `data.object`. Deduplicate by `eventId` and retrieve the resource when recovering missed or out-of-order events.
