# Crypto — Relay (Broadcast a Transaction)

The relay endpoint broadcasts a raw, pre-signed Tron transaction through Dinaria's full node.  
You build and sign the transaction locally; Dinaria never has access to your private key.

---

## Endpoint

```
POST /v1/relay/broadcast
```

---

## Use Cases

- USDT (TRC-20) transfers between Tron addresses you control.
- Any Tron transaction (TRX, TRC-10, TRC-20) that you can sign locally.

---

## Request

```json
{
  "rawTransaction": "<hex-encoded signed transaction>",
  "network": "mainnet"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rawTransaction` | string | ✓ | Hex-encoded signed Tron transaction (output of `signTransaction`). |
| `network` | string | | `mainnet` (default) or `shasta`. |

---

## Response — `200 OK`

```json
{
  "txid": "a1b2c3d4...",
  "result": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `txid` | string | Tron transaction hash. |
| `result` | bool | `true` if the node accepted the broadcast. |

---

## Response — Error

| Status | `error` | Meaning |
|--------|---------|---------|
| 400 | `invalid_transaction` | The hex payload is malformed or the signature is invalid. |
| 502 | `broadcast_failed` | The Tron node rejected the transaction. |

---

## Building & Signing a Transaction

Dinaria does **not** provide a signing service. Build and sign using any TRC-20-compatible library:

- **Java**: [BouncyCastle](https://www.bouncycastle.org/) (secp256k1)
- **JavaScript/TypeScript**: [TronWeb](https://developers.tron.network/docs/tronweb-intro)
- **Python**: [tronpy](https://tronpy.readthedocs.io/)

### Unsigned transaction via TronGrid (example)

```bash
curl -X POST https://api.trongrid.io/wallet/triggersmartcontract \
  -H "Content-Type: application/json" \
  -d '{
    "owner_address": "T<your-address>",
    "contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    "function_selector": "transfer(address,uint256)",
    "parameter": "<abi-encoded address + amount>",
    "fee_limit": 50000000,
    "call_value": 0,
    "visible": true
  }'
```

Sign the returned `raw_data_hex` field with your private key using secp256k1, then POST the result to Dinaria's relay.

---

## Full Example

```bash
# 1. Build unsigned transaction
TX=$(curl -s -X POST https://api.trongrid.io/wallet/triggersmartcontract \
  -H "Content-Type: application/json" \
  -d '{ "owner_address": "TSENDER", "contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        "function_selector": "transfer(address,uint256)", "parameter": "...",
        "fee_limit": 50000000, "visible": true }')

# 2. Sign the raw_data_hex (local; private key never leaves your system)
SIGNED_HEX=$(your-signing-tool sign "$TX")

# 3. Broadcast via Dinaria relay
curl -X POST https://api.dinaria.com/v1/relay/broadcast \
  -H "Authorization: Bearer dna_live_..." \
  -H "Content-Type: application/json" \
  -d "{\"rawTransaction\": \"$SIGNED_HEX\", \"network\": \"mainnet\"}"
```
