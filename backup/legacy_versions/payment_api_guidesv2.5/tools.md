---
title: Merchant Tools & Admin Pages (Sandbox)
nav_order: 18
parent: Guides
---

# Merchant tools & admin pages (sandbox)

This guide describes the merchant‑facing tools and admin pages available in the
sandbox environment, what each page is for, and who should use it.

## Primary API base URL (sandbox)
- **URL**: `https://api.sandbox.dinaria.com`
- **Audience**: Merchant integrations and Dinaria internal systems
- **Hosted by**: `dinapay` (port 8090)

Use this base URL for all API calls from your backend (create payments, retrieve
status, register webhooks, etc.).

## Simulate a pay-in (sandbox)

After `POST /payments` returns `status: "started"`:

<div class="country-ar" markdown="1">

**Argentina (ARS):** `POST /sandbox/payments/{transactionId}/receive` with `{}` body.

</div>

<div class="country-br" markdown="1">

**Brasil (BRL):** `POST /trf/cashin/simulate` with `externalId`, `taxId`, and `amount`.

</div>

See `content/19_sandbox_cashin_simulation.md` for full examples and matching rules.

## Merchant portal (sandbox)

- **URL:** Ask support
- **Username:** account ID (e.g. `bpn`)
- **Password:** provided by Dinaria

## Dinapay (merchant admin views)

### Merchant Payments
- **URL**: `/paytomerch/payments`
- **Full**: `https://admin.sandbox.dinaria.com/paytomerch/payments`
- **Audience**: Merchant admin / merchant support
- **Hosted by**: `dinapay` (port 8090)
- **What it does**:
  - Shows a filtered list of your merchant’s payments.
  - Helps support teams verify payment status and troubleshoot customer reports.
  - Useful to confirm status transitions when a webhook is delayed or missing.

### Merchant Webhooks
- **URL**: `/paytomerch/webhooks`
- **Full**: `https://admin.sandbox.dinaria.com/paytomerch/webhooks`
- **Audience**: Merchant admin / technical support
- **Hosted by**: `dinapay` (port 8090)
- **What it does**:
  - Displays webhook registrations (destination URLs) for your merchant.
  - Helps verify that the correct endpoint is configured.
  - Useful when rotating webhook secrets or changing environments.

## Authentication

All admin pages under `admin.sandbox.dinaria.com` require **Basic Auth**.
Credentials are provided by Dinaria or configured in your sandbox account.
