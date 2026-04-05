# Blockchain Access (Tron Node)

Blockchain Access gives you authenticated access to Dinaria's Tron full node. You can query balances and allowances, broadcast pre-signed transactions, and check submission status — all without exposing your private key to Dinaria.

**Base path:** `/v1/chains/tron`

---

## Authentication

All Blockchain Access endpoints use an **account-level** API key:

```
Authorization: Bearer di_live_...
```

The `network` query parameter (or `X-Network` header) selects the chain. Accepted values: `mainnet`, `shasta`.

---

## Read Endpoints

### Get Address Balance

Returns TRX balance and optionally one or more TRC-20 token balances for any address.

```
GET /v1/chains/tron/addresses/{address}/balance
    ?network=mainnet
    &contracts=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

| Parameter | Description |
|-----------|-------------|
| `address` | Tron address (`T…` base58check). |
| `network` | `mainnet` or `shasta`. |
| `contracts` | Optional. One or more TRC-20 contract addresses, comma-separated or repeated. Contract must exist in Dinaria's catalog. |

**Response — `200 OK`**

```json
{
  "address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "network": "mainnet",
  "trxSun": "1500000000",
  "tokens": [
    {
      "contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      "symbol": "USDT",
      "decimals": 6,
      "balance": "50000000"
    }
  ]
}
```

`trxSun` is the TRX balance in sun (1 TRX = 1,000,000 sun). `balance` for TRC-20 tokens is in the token's base units; divide by `10^decimals` to get human-readable amount.

---

### Get TRC-20 Token Balance

Returns the token balance of a specific owner for a given contract.

```
GET /v1/chains/tron/contracts/{contract}/balance
    ?owner=TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE
    &network=mainnet
```

| Parameter | Description |
|-----------|-------------|
| `contract` | TRC-20 contract address. Must exist in Dinaria's catalog. |
| `owner` | Address to query. |
| `network` | `mainnet` or `shasta`. |

**Response — `200 OK`**

```json
{
  "contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "owner": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "balance": "50000000",
  "decimals": 6
}
```

---

### Get TRC-20 Allowance

Returns how much a spender is approved to transfer on behalf of an owner.

```
GET /v1/chains/tron/contracts/{contract}/allowance
    ?owner=TOwnerAddr...
    &spender=TSpenderAddr...
    &network=mainnet
```

| Parameter | Description |
|-----------|-------------|
| `contract` | TRC-20 contract address. |
| `owner` | Address that granted the allowance. |
| `spender` | Address that may spend on owner's behalf. |
| `network` | `mainnet` or `shasta`. |

**Response — `200 OK`**

```json
{
  "contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "owner": "TOwnerAddr...",
  "spender": "TSpenderAddr...",
  "allowance": "0",
  "decimals": 6
}
```

---

## Broadcast Endpoints

### Broadcast a Transaction

Submits a pre-signed Tron transaction to the network.

```
POST /v1/chains/tron/transactions/broadcast
```

**Request**

```json
{
  "network": "mainnet",
  "signedTransaction": {
    "raw_data": { ... },
    "raw_data_hex": "0a02...",
    "txID": "a1b2c3...",
    "signature": ["3045..."]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `network` | string | | `mainnet` (default) or `shasta`. |
| `signedTransaction` | object | ✓ | The signed transaction object returned by `triggersmartcontract` after you add the signature. |

**Response — `200 OK`**

```json
{
  "submissionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "txid": "a1b2c3d4...",
  "result": true,
  "network": "mainnet"
}
```

`submissionId` is a Dinaria-internal UUID you can use to query the submission status later.

---

### Dry-Run a Transaction

Estimates energy consumption without broadcasting. Use before submitting to check fee cost.

```
POST /v1/chains/tron/transactions/dry-run
```

**Request**

```json
{
  "network": "mainnet",
  "signedTransaction": { ... }
}
```

**Response** — passes through the Tron node's `triggerconstantcontract` response, wrapped:

```json
{
  "httpStatus": 200,
  "result": {
    "energy_used": 13382,
    "constant_result": ["..."],
    "result": { "result": true }
  }
}
```

---

### Get Submission Status

Retrieve the status of a previously broadcast transaction by its Dinaria submission ID.

```
GET /v1/chains/tron/transactions/{submissionId}
```

**Response — `200 OK`**

```json
{
  "submissionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "confirmed",
  "network": "mainnet",
  "txid": "a1b2c3d4...",
  "submittedAt": "2026-04-03T14:01:05Z"
}
```

| `status` value | Meaning |
|----------------|---------|
| `pending` | Submitted, not yet on-chain. |
| `confirmed` | Included in a block. |
| `failed` | Node rejected or dropped. See `errorCode` / `errorMessage`. |

---

## Catalog Endpoints

### List Networks

Returns the networks Dinaria supports.

```
GET /v1/chains/networks
```

### Get Network Details

```
GET /v1/chains/networks/{code}
```

Returns RPC configuration, chain ID, and status for a specific network (e.g. `mainnet`, `shasta`).

---

## End-to-End Example: USDT Transfer

```bash
# 1. Build the unsigned transaction
TX=$(curl -s -X POST https://api.trongrid.io/wallet/triggersmartcontract \
  -H "Content-Type: application/json" \
  -d '{
    "owner_address": "TSENDER",
    "contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    "function_selector": "transfer(address,uint256)",
    "parameter": "<abi-encoded recipient + amount>",
    "fee_limit": 50000000,
    "visible": true
  }')

# 2. Sign locally (private key never leaves your system)
SIGNED=$(your-signing-tool sign "$TX")

# 3. Broadcast via Dinaria Blockchain Access
curl -X POST https://api.dinaria.com/v1/chains/tron/transactions/broadcast \
  -H "Authorization: Bearer di_live_..." \
  -H "Content-Type: application/json" \
  -d "{\"network\": \"mainnet\", \"signedTransaction\": $SIGNED}"

# 4. Check balance afterward
curl "https://api.dinaria.com/v1/chains/tron/addresses/TRECIPIENT/balance \
  ?network=mainnet \
  &contracts=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" \
  -H "Authorization: Bearer di_live_..."
```

---

## Building & Signing Transactions

Dinaria does not provide a signing service. Use any secp256k1-capable library:

| Language | Library |
|----------|---------|
| Java | [BouncyCastle](https://www.bouncycastle.org/) |
| JavaScript / TypeScript | [TronWeb](https://developers.tron.network/docs/tronweb-intro) |
| Python | [tronpy](https://tronpy.readthedocs.io/) |
| Go | [decred/dcrd secp256k1](https://github.com/decred/dcrd/tree/master/dcrec/secp256k1) |
