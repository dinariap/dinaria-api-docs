
# Participants

Participants define who sends and who receives money.

## Customer

Represents the sender of funds.

Used in:

- Payments, as embedded payer data
- Customers, as a persistent person or business profile
- Virtual Accounts, through `customerId`

## Beneficiary

Represents the receiver of funds.

Used in:

- Payouts

The fields required for a beneficiary vary by country, rail, and configured use case.

## Remitter

Represents the originator of a Payout when corridor rules require sender information. It is distinct from the beneficiary and may be an individual or business.

