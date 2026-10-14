---
title: Customers
---

# Customers

Customers are reusable person or business profiles. A Customer has a Dinaria `customerId`, your stable `externalId`, identity data, metadata, a status, and a monotonic `resourceVersion`.

Required identity and contact fields depend on the published country and product data policy. Individuals use `firstName` and `lastName`; businesses use `legalName`.

## Create a Customer

```http
POST https://sbx.dinaria.com/v2/customers
Authorization: Bearer <API_KEY>
Content-Type: application/json
Idempotency-Key: customer-001-create-v1
```

Merchant credential:

```json
{
  "externalId": "CUSTOMER-001",
  "type": "individual",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "+5491112345678",
  "country": "AR",
  "documentType": "CUIT",
  "documentNumber": "20234567897",
  "documentCountry": "AR",
  "address": {
    "country": "AR",
    "city": "Buenos Aires",
    "line1": "Calle de Prueba 100",
    "postalCode": "C1000"
  },
  "metadata": {
    "segment": "demo"
  }
}
```

With an account credential, add `merchantId` when the account operates for multiple merchants.

```json
{
  "customerId": "6b5dbb40-07ec-44f3-b210-a965c2bdb40d",
  "externalId": "CUSTOMER-001",
  "type": "individual",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "country": "AR",
  "documentType": "CUIT",
  "documentNumber": "20234567897",
  "documentCountry": "AR",
  "status": "active",
  "creationDate": "2026-10-14T18:00:00Z",
  "resourceVersion": 1,
  "metadata": {
    "segment": "demo"
  }
}
```

For a business, send `type: business` and `legalName` instead of personal names.

## Retrieve and list

```http
GET /v2/customers/{customerId}
GET /v2/customers?merchantId=merchant_demo_001&externalId=CUSTOMER-001&status=active&limit=20
```

The list is cursor-paginated. `merchantId` is only needed when an account-scoped credential cannot infer the merchant.

## Update mutable data

```http
PATCH /v2/customers/{customerId}
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

```json
{
  "email": "juan.updated@example.com",
  "metadata": {
    "segment": "verified"
  }
}
```

`externalId`, `type`, and `country` are not mutable through this operation.

## Statuses and lifecycle

| Status | Meaning |
|---|---|
| `active` | The Customer may be used by supported products. |
| `blocked` | Use is temporarily disabled. |
| `archived` | The Customer is retained as historical data and is no longer active. |

Block or reactivate a Customer with an idempotent lifecycle action:

```http
POST /v2/customers/{customerId}/block
Idempotency-Key: customer-001-block-v1
```

```json
{ "reason": "merchant_request" }
```

```http
POST /v2/customers/{customerId}/activate
Idempotency-Key: customer-001-activate-v1
```

## Errors

Creation and updates can return `invalid_request`, authorization errors, conflicts, and `422` when the data cannot satisfy the applicable product policy. Use the top-level error `code` for programmatic behavior and retain `requestId` for support.

Customers do not currently define separate public webhook event types. Virtual Account events include an immutable `customerSnapshot` of the identity used for provisioning.
