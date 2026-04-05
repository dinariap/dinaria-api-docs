# Stablecoin Settlement — Overview

Dinaria supports two on-chain operations on the Tron network (TRC-20):

| Operation | What it does |
|-----------|--------------|
| **On-ramp** | Convert BRL from your Dinaria balance into USDT and deliver it to any Tron address. Executed atomically through the Exchange — no polling required. |
| **Blockchain Access** | Query balances and allowances, broadcast pre-signed transactions, and check submission status through Dinaria's Tron full node. You sign locally; Dinaria never holds your private key. |

Both operations use the same `Authorization: Bearer <api-key>` scheme as the rest of the Dinaria API.

- **On-ramp** (`POST /payouts` with `tron_address`) uses your **merchant-scoped** key — the same key used for BRL payouts.
- **Blockchain Access** (`/v1/chains/tron/...`) uses an **account-level** key.

---

## Authentication

```
Authorization: Bearer di_live_...
```

---

## Network

All production operations run on **Tron mainnet**. A `network` parameter is accepted on on-ramp and blockchain access endpoints to target the **Shasta testnet** during integration.

| Value | Chain |
|-------|-------|
| `mainnet` (default) | Tron mainnet — real funds |
| `shasta` | Shasta testnet — test tokens only |

---

## USDT Contract Addresses

| Network | Contract address |
|---------|-----------------|
| mainnet | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |
| shasta  | `TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs` |

---

## Related

- [Blockchain Access — Tron Node](51_crypto_relay.md)
- [On-ramp — BRL to USDT](52_crypto_settlement.md)
