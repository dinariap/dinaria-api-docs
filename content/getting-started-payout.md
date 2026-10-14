---
title: Payout Quickstart
parent: Get Started
---

# Payout Quickstart

Use this flow to send funds to a beneficiary. A Payout is created against the available source-currency balance, so make sure the account is sufficiently prefunded before submitting it. Prefunding is a separate process and is not performed by `POST /v2/payouts`.

## 1. Configure the client

```bash
DINARIA_BASE_URL="https://sbx.dinaria.com"
DINARIA_API_KEY="<API_KEY>"
```

## 2. Check the available balance

```bash
curl "$DINARIA_BASE_URL/v2/balance" \
  --header "Authorization: Bearer $DINARIA_API_KEY"
```

Confirm that the available ARS balance covers the example payout.

## 3. Create the Payout

```bash
curl --request POST "$DINARIA_BASE_URL/v2/payouts" \
  --header "Authorization: Bearer $DINARIA_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: payout-ar-1001-v1" \
  --data '{
    "externalId": "PAYOUT-AR-1001",
    "source": {
      "amount": "15000",
      "currency": "ARS"
    },
    "destination": {
      "country": "AR",
      "currency": "ARS",
      "beneficiary": {
        "type": "individual",
        "name": "María González"
      },
      "rail": {
        "type": "ar_bank_transfer",
        "accountType": "cbu",
        "accountNumber": "0000003100012345678901"
      }
    }
  }'
```

The beneficiary and rail fields are illustrative. Required data varies by country, rail, and configured use case.

A new request returns `201 Created`, normally with `status: processing`. An identical replay using the same idempotency key returns the original result as `200 OK`; it does not create another Payout.

## 4. Track the result

Store the returned `payoutId`. Listen for `payout.created` and `payout.status_changed`, and retrieve canonical state when required:

```bash
curl "$DINARIA_BASE_URL/v2/payouts/<PAYOUT_ID>" \
  --header "Authorization: Bearer $DINARIA_API_KEY"
```

`confirmed` means delivery succeeded. `failed`, `cancelled`, and `reversed` are distinct terminal outcomes. Do not treat the create response as delivery confirmation.

## Next steps

- [Payout overview](payouts-overview.md)
- [Payout flow](payouts-flow.md)
- [Country & Capability Matrix](country-capabilities.md)
- [Webhooks](webhooks-overview.md)
