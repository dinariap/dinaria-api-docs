# Crypto — Overview

Dinaria supports two on-chain operations on the Tron network (TRC-20):

| Operation | What it does |
|-----------|--------------|
| **Relay** | Broadcast a raw, pre-signed Tron transaction through Dinaria's node. You sign locally; Dinaria never holds your private key. |
| **Settlement** | Convert BRL from your Dinaria balance into USDT and deliver it to any Tron address. Handled atomically through Transfero OTC. |

Both operations use the same `Authorization: Bearer <api-key>` scheme as the rest of the Dinaria API.

- **Settlement** (`POST /payouts` with `tron_address`) uses your **merchant-scoped** key — the same key used for BRL payouts.
- **Relay** (`POST /v1/relay/broadcast`) uses an **account-level** key.

---

## Authentication

```
Authorization: Bearer di_live_...
```

---

## Network

All production operations run on **Tron mainnet**. A `network` parameter is accepted on settlement endpoints to target the **Shasta testnet** during integration.

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

- [Relay — Broadcast a Transaction](51_crypto_relay.md)
- [Settlement — BRL to USDT](52_crypto_settlement.md)
