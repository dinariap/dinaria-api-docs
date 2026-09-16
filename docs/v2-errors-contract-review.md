# V2 errors and normalized failures: contract review

This review records differences found while preparing the public V2 errors guide. It is not part of the public navigation and does not silently redefine the API contract.

## Sources reviewed

- `dinapay-contracts`: combined V2 OpenAPI, failure catalogs, ADR 0007, connector guide, Refund and webhook contracts.
- `dinapay-v2`: HTTP error mapping, resource models, persistence, asynchronous state transitions, and public serialization.
- `dinapay-connector-template`: versioned failure-mapping rules and fallback behavior.
- available Binance Pay, TransferDirecto, Insular, and PVS connector checkouts: native-state and native-error translation behavior.
- the public documentation and its served `dinapay-v2.yaml`.

## Differences requiring a contract decision

### API Reference copy corrected during this update

The OpenAPI file served by the documentation predated the normalized-failure contract: Payment had no public `failure`, and Payout `Failure` still required `{code, message, retryable}`. The canonical combined OpenAPI instead defines `PaymentFailure`, `Failure`, and `FieldError` with `{code, category, message, errors?}` and enumerated domain codes. The served copy was aligned for these failure schemas while retaining the documentation project's existing country examples and descriptive additions. The remaining differences below were not resolved silently.

### 1. `Error.field` and `Error.retryable` exist in OpenAPI but are not emitted by the main HTTP writer

- OpenAPI: both properties are optional.
- `dinapay-v2`: `writeError` currently emits only `code`, `message`, and `requestId`.

No compatibility issue exists because the fields are optional. Proposed adjustment: either keep them explicitly reserved/optional or remove them in a future contract cleanup if they are not intended for use. The public guide does not promise their presence.

### 2. HTTP error-code enums are not constrained per response in OpenAPI

- OpenAPI: error responses reference a generic `Error` schema whose `code` is any string.
- `dinapay-v2`: the central mapping currently emits `invalid_request`, `unauthorized`, `forbidden`, `not_found`, `idempotency_conflict`, `operation_in_progress`, `refund_not_supported`, and `dependency_unavailable`; Payout handlers also emit `payout_not_supported`.

Proposed adjustment: add documented examples or endpoint-specific error-code constraints to the OpenAPI after confirming that this set is the intended stable public catalog.

### 3. Payout `failure` lifecycle is broader in the schema than in the implementation

- OpenAPI: optional `failure` has no conditional restriction by `status`.
- `dinapay-v2`: the public Payout loader currently exposes it only when the operational state maps to public `failed`.
- The Payout catalog contains `payout_cancelled`, while a public `cancelled` Payout currently does not expose `failure` through that loader.

Proposed adjustment: decide whether `payout_cancelled` must be attached to `cancelled` resources or removed from the public failure catalog. The public guide describes current implementation behavior and does not synthesize a missing object.

### 4. Payment status/failure association is implemented but not expressed conditionally in OpenAPI

- OpenAPI: `Payment.failure` is optional without a status condition.
- `dinapay-v2`: normalized failure is generated for provider terminal observations, with defaults for `expired`, `cancelled`, and other failed outcomes.

Proposed adjustment: add descriptive or conditional schema language if clients need a contractual guarantee about exactly which terminal states include `failure`.

## Confirmed alignment

- Payment, Refund, and Payout normalized catalogs match their OpenAPI enums and versioned Go contract.
- Field-error codes match `failures/field-errors.json` and `FieldError` in the combined OpenAPI.
- Native provider evidence is separated from public Payment, Refund, and Payout `failure` objects and omitted from public JSON.
- Connectors own native-to-normalized mapping; the router does not classify provider failures.
- Unknown native Payment, Refund, and Payout failures map to `unknown_error`.
- Refunds use the normalized `{code, category, message, errors?}` shape. Their operation-specific codes are `insufficient_funds` and `refund_rejected`, in addition to the common catalog.
- The canonical failure guide now defines when every code is appropriate, including the definitive reconciliation rule for `payment_not_received`.
- V2 webhook objects use the same public representation as GET and therefore carry the same normalized `failure` when present.
- Same-key/same-body creation replay and changed-body conflict behavior are aligned for Payments, Refunds, and Payouts.
