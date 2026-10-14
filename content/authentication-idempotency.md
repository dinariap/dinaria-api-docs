---
title: Authentication & Idempotency
parent: Get Started
---

# Authentication and idempotency

Dinaria uses Bearer API keys. Send the key and JSON content type on every request:

```http
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

Use `https://sbx.dinaria.com` for sandbox and `https://payments.dinaria.com` for production.

## Account and merchant credentials

An API key belongs either to an account or to one merchant.

- With a merchant credential, Dinaria infers the merchant. Do not send `merchantId`.
- With an account credential, send `merchantId` when the account can operate for more than one merchant.
- Access remains limited by the scopes assigned to the credential.

Merchant-scoped request:

```json
{
  "externalId": "ORDER-1001",
  "amount": "1000.00",
  "currency": "ARS",
  "paymentMethod": "qr",
  "rail": "ar_qr",
  "destinationMode": "single_use",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-001",
    "country": "AR"
  }
}
```

The equivalent account-scoped request includes the selected merchant:

```json
{
  "merchantId": "merchant_demo_001",
  "externalId": "ORDER-1001",
  "amount": "1000.00",
  "currency": "ARS",
  "paymentMethod": "qr",
  "rail": "ar_qr",
  "destinationMode": "single_use",
  "customer": {
    "type": "individual",
    "externalId": "CUSTOMER-001",
    "country": "AR"
  }
}
```

## Idempotency

Mutable operations that declare `Idempotency-Key` in the API Reference require a unique, persistent value:

```http
Idempotency-Key: order-1001-create-v1
```

The key identifies the technical attempt. Persist it together with the exact request body.

- Repeating the same key with the same canonical body returns the existing resource.
- Reusing the key with a different body returns an idempotency conflict.
- After an ambiguous timeout, repeat the exact body with the original key.
- Do not generate a new key merely to bypass an uncertain response.

`externalId` is the operation identifier in your system. It is not an idempotency key, and the two values are not interchangeable.

## Money values

Send and receive monetary amounts as decimal strings, never JSON floating-point numbers:

```json
{
  "amount": "1000.00",
  "currency": "ARS"
}
```

Precision is currency-specific. Fiat commonly uses up to two fractional digits, while currencies such as CLP use integer amounts. Configured crypto currencies may support additional precision.
