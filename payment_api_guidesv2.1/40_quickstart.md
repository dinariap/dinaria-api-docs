
# Quickstart

## 1. Create a Payment

POST /payments

Use hosted mode (default):

{
  "amount": "1000",
  "currency": "ARS"
}

Response will include:

- actionUrl → redirect payer
- nextAction (optional)

Redirect user:

window.location = payment.actionUrl
