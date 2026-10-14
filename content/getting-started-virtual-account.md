---
title: Virtual Account Quickstart
parent: Get Started
---

# Virtual Account Quickstart

Use this flow when a known customer needs a persistent destination for receiving funds. The initial public capability provisions an ARS CVU in Argentina.

## 1. Configure the client

```bash
DINARIA_BASE_URL="https://sbx.dinaria.com"
DINARIA_API_KEY="<API_KEY>"
```

## 2. Create the Customer

```bash
curl --request POST "$DINARIA_BASE_URL/v2/customers" \
  --header "Authorization: Bearer $DINARIA_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: customer-001-create-v1" \
  --data '{
    "externalId": "CUSTOMER-001",
    "type": "individual",
    "firstName": "Juan",
    "lastName": "Pérez",
    "country": "AR",
    "documentType": "CUIT",
    "documentNumber": "20234567897",
    "documentCountry": "AR"
  }'
```

Store the returned `customerId`. Identity and contact requirements vary by country and configured use case.

## 3. Create the Virtual Account

```bash
curl --request POST "$DINARIA_BASE_URL/v2/virtual-accounts" \
  --header "Authorization: Bearer $DINARIA_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: va-customer-001-v1" \
  --data '{
    "externalId": "VA-CUSTOMER-001",
    "customerId": "6b5dbb40-07ec-44f3-b210-a965c2bdb40d",
    "country": "AR",
    "currency": "ARS",
    "rail": "ar_cvu"
  }'
```

Creation returns `201 Created`. Provisioning may finish as `active` or continue asynchronously as `pending`. Provide the account details to the customer only when the Virtual Account is `active`.

## 4. Process incoming funds

Funds received through the Virtual Account are represented as Payments. Listen for `payment.created` and `payment.status_changed`, and use the Payment's `virtualAccountId` to associate the deposit with the persistent destination.

The observed `payer` may differ from the Customer who owns the Virtual Account. Do not replace the account owner with the depositor identity.

## Next steps

- [Customers](customers.md)
- [Virtual Accounts](virtual-accounts.md)
- [Payment lifecycle](payments-lifecycle.md)
- [Webhooks](webhooks-overview.md)
