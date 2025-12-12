# EVM From Scratch - Complete Implementation TODO

This document contains all tasks required to implement an Ethereum Virtual Machine from scratch based on the test cases in `evm.json`.

---

## Table of Contents

1. [Core Infrastructure](#1-core-infrastructure)
2. [Stack Operations](#2-stack-operations)
3. [Arithmetic Operations](#3-arithmetic-operations)
4. [Comparison & Bitwise Operations](#4-comparison--bitwise-operations)
5. [Memory Operations](#5-memory-operations)
6. [Storage Operations](#6-storage-operations)
7. [Control Flow](#7-control-flow)
8. [Environment Information](#8-environment-information)
9. [Block Information](#9-block-information)
10. [Logging Operations](#10-logging-operations)
11. [System Operations](#11-system-operations)
12. [Contract Creation](#12-contract-creation)

---

## 1. Core Infrastructure

### 1.1 EVM Structure

- [ ] Create main EVM struct/class with:
  - [ ] Program counter (PC)
  - [ ] Stack (max 1024 items, each 256-bit)
  - [ ] Memory (byte-addressable, dynamically expanding)
  - [ ] Storage (key-value store, 256-bit to 256-bit)
  - [ ] Return data buffer
  - [ ] Logs array
  - [ ] Success/failure status

### 1.2 Execution Context

- [ ] Transaction context:
  - [ ] `to` - Contract address (ADDRESS opcode)
  - [ ] `from` - Caller address (CALLER opcode)
  - [ ] `origin` - Transaction origin (ORIGIN opcode)
  - [ ] `value` - Wei sent (CALLVALUE opcode)
  - [ ] `data` - Calldata bytes (CALLDATALOAD, CALLDATASIZE, CALLDATACOPY)
  - [ ] `gasprice` - Gas price (GASPRICE opcode)

### 1.3 Block Context

- [ ] Block information:
  - [ ] `coinbase` - Block miner address (COINBASE opcode)
  - [ ] `timestamp` - Block timestamp (TIMESTAMP opcode)
  - [ ] `number` - Block number (NUMBER opcode)
  - [ ] `difficulty` - Block difficulty/PREVRANDAO (DIFFICULTY opcode)
  - [ ] `gaslimit` - Block gas limit (GASLIMIT opcode)
  - [ ] `chainid` - Chain ID (CHAINID opcode)
  - [ ] `basefee` - Base fee (BASEFEE opcode)

### 1.4 World State

- [ ] Account state structure:
  - [ ] `balance` - Account balance
  - [ ] `code` - Contract bytecode
  - [ ] `storage` - Contract storage

### 1.5 Main Execution Loop

- [ ] Parse bytecode from hex string
- [ ] Fetch-decode-execute loop
- [ ] Handle unknown/invalid opcodes
- [ ] Return execution result (success, stack, return data, logs)

---

## 2. Stack Operations

### 2.1 STOP (0x00)

- [ ] Implement STOP opcode
- [ ] Test: Basic STOP execution
- [ ] Test: STOP midway through code (halts execution)

### 2.2 PUSH Operations (0x5F - 0x7F)

- [ ] Implement PUSH0 (0x5F) - Push zero onto stack (EIP-3855)
- [ ] Implement PUSH1-PUSH32 (0x60-0x7F) - Push N bytes onto stack
- [ ] Generic implementation: `size = opcode - 0x5F` for PUSH0, `size = opcode - 0x60 + 1` for PUSH1-32
- [ ] Test: PUSH0
- [ ] Test: PUSH1
- [ ] Test: PUSH2
- [ ] Test: PUSH4
- [ ] Test: PUSH6
- [ ] Test: PUSH10
- [ ] Test: PUSH11
- [ ] Test: PUSH32
- [ ] Test: Multiple PUSHes (verify stack order)

### 2.3 POP (0x50)

- [ ] Implement POP opcode
- [ ] Test: POP removes top item

### 2.4 DUP Operations (0x80 - 0x8F)

- [ ] Implement DUP1-DUP16 - Duplicate Nth stack item
- [ ] Generic implementation: `n = opcode - 0x80 + 1`
- [ ] Test: DUP1
- [ ] Test: DUP3
- [ ] Test: DUP5
- [ ] Test: DUP8

### 2.5 SWAP Operations (0x90 - 0x9F)

- [ ] Implement SWAP1-SWAP16 - Swap top with Nth+1 stack item
- [ ] Generic implementation: `n = opcode - 0x90 + 1`
- [ ] Test: SWAP1
- [ ] Test: SWAP3
- [ ] Test: SWAP5
- [ ] Test: SWAP7

---

## 3. Arithmetic Operations

### 3.1 ADD (0x01)

- [ ] Implement ADD opcode
- [ ] Handle 256-bit overflow (wrap around)
- [ ] Test: Basic addition (1 + 2 = 3)
- [ ] Test: Overflow (MAX_UINT256 + 2 = 1)

### 3.2 MUL (0x02)

- [ ] Implement MUL opcode
- [ ] Handle 256-bit overflow (mod 2^256)
- [ ] Test: Basic multiplication (2 \* 3 = 6)
- [ ] Test: Overflow (MAX_UINT256 \* 2)

### 3.3 SUB (0x03)

- [ ] Implement SUB opcode
- [ ] Handle underflow (wrap around)
- [ ] Test: Basic subtraction (3 - 2 = 1)
- [ ] Test: Underflow (2 - 3 = MAX_UINT256)

### 3.4 DIV (0x04)

- [ ] Implement DIV opcode (unsigned)
- [ ] Handle division by zero (returns 0)
- [ ] Discard fractional part
- [ ] Test: Basic division (6 / 2 = 3)
- [ ] Test: Integer division (2 / 6 = 0)
- [ ] Test: Division by zero (returns 0)

### 3.5 SDIV (0x05)

- [ ] Implement SDIV opcode (signed)
- [ ] Handle two's complement negative numbers
- [ ] Handle division by zero (returns 0)
- [ ] Test: Positive division (10 / 10 = 1)
- [ ] Test: Negative / Negative (-2 / -1 = 2)
- [ ] Test: Positive / Negative (10 / -2 = -5)
- [ ] Test: Division by zero (returns 0)

### 3.6 MOD (0x06)

- [ ] Implement MOD opcode (unsigned)
- [ ] Handle mod by zero (returns 0)
- [ ] Test: Basic mod (10 mod 3 = 1)
- [ ] Test: Mod by larger number (5 mod 17 = 5)
- [ ] Test: Mod by zero (returns 0)

### 3.7 SMOD (0x07)

- [ ] Implement SMOD opcode (signed)
- [ ] Handle two's complement
- [ ] Handle mod by zero (returns 0)
- [ ] Test: Positive mod (10 mod 3 = 1)
- [ ] Test: Negative mod (-10 mod -3 = -1)
- [ ] Test: Mod by zero (returns 0)

### 3.8 ADDMOD (0x08)

- [ ] Implement ADDMOD opcode: (a + b) mod N
- [ ] Avoid intermediate overflow
- [ ] Test: Basic (10 + 10) mod 8 = 4
- [ ] Test: With MAX_UINT256 overflow

### 3.9 MULMOD (0x09)

- [ ] Implement MULMOD opcode: (a \* b) mod N
- [ ] Avoid intermediate overflow (use 512-bit intermediate)
- [ ] Test: Basic (10 \* 10) mod 8 = 4
- [ ] Test: With MAX_UINT256 overflow

### 3.10 EXP (0x0A)

- [ ] Implement EXP opcode: a^b mod 2^256
- [ ] Test: 10^2 = 100 (0x64)

### 3.11 SIGNEXTEND (0x0B)

- [ ] Implement SIGNEXTEND opcode
- [ ] Extend sign bit of byte at position
- [ ] Test: Positive number (no change)
- [ ] Test: Negative number (0xFF -> all 1s)

---

## 4. Comparison & Bitwise Operations

### 4.1 Comparison Operations

#### LT (0x10)

- [ ] Implement LT opcode (unsigned less than)
- [ ] Test: 9 < 10 = 1
- [ ] Test: 10 < 10 = 0
- [ ] Test: 11 < 10 = 0

#### GT (0x11)

- [ ] Implement GT opcode (unsigned greater than)
- [ ] Test: 10 > 9 = 1
- [ ] Test: 10 > 10 = 0
- [ ] Test: 10 > 11 = 0

#### SLT (0x12)

- [ ] Implement SLT opcode (signed less than)
- [ ] Test: -1 < 0 = 1
- [ ] Test: -1 < -1 = 0
- [ ] Test: 0 < -1 = 0

#### SGT (0x13)

- [ ] Implement SGT opcode (signed greater than)
- [ ] Test: 10 > 9 = 1 (positive)
- [ ] Test: -2 > -2 = 0
- [ ] Test: -2 > -3 = 1

#### EQ (0x14)

- [ ] Implement EQ opcode
- [ ] Test: 10 == 10 = 1
- [ ] Test: 10 == 9 = 0

#### ISZERO (0x15)

- [ ] Implement ISZERO opcode
- [ ] Test: ISZERO(9) = 0
- [ ] Test: ISZERO(0) = 1

### 4.2 Bitwise Operations

#### AND (0x16)

- [ ] Implement AND opcode
- [ ] Test: 0xE & 0x3 = 0x2

#### OR (0x17)

- [ ] Implement OR opcode
- [ ] Test: 0xE | 0x3 = 0xF

#### XOR (0x18)

- [ ] Implement XOR opcode
- [ ] Test: 0xF0 ^ 0x0F = 0xFF

#### NOT (0x19)

- [ ] Implement NOT opcode (bitwise complement)
- [ ] Test: NOT(0x0F) = 0xFF...F0

#### BYTE (0x1A)

- [ ] Implement BYTE opcode
- [ ] Extract byte at position from 256-bit value
- [ ] Test: 31st byte (least significant)
- [ ] Test: 30th byte
- [ ] Test: 29th byte
- [ ] Test: Out of range (returns 0)

#### SHL (0x1B)

- [ ] Implement SHL opcode (shift left)
- [ ] Discard bits that overflow
- [ ] Test: 1 << 1 = 2
- [ ] Test: Overflow (bits discarded)
- [ ] Test: Shift too large (returns 0)

#### SHR (0x1C)

- [ ] Implement SHR opcode (logical shift right)
- [ ] Test: 2 >> 1 = 1
- [ ] Test: Bits discarded
- [ ] Test: Shift too large (returns 0)

#### SAR (0x1D)

- [ ] Implement SAR opcode (arithmetic shift right)
- [ ] Fill with sign bit (1s for negative)
- [ ] Test: Positive number (same as SHR)
- [ ] Test: Negative number (fills with 1s)
- [ ] Test: Shift too large negative (all 1s)
- [ ] Test: Shift too large positive (all 0s)

---

## 5. Memory Operations

### 5.1 Memory Infrastructure

- [ ] Implement expandable memory
- [ ] Track memory size (MSIZE)
- [ ] Memory expansion in 32-byte chunks

### 5.2 MLOAD (0x51)

- [ ] Implement MLOAD opcode
- [ ] Load 32 bytes from memory offset
- [ ] Test: Load stored value
- [ ] Test: Load from offset (tail bytes)

### 5.3 MSTORE (0x52)

- [ ] Implement MSTORE opcode
- [ ] Store 32 bytes at memory offset
- [ ] Test: Store and load value
- [ ] Test: Store with offset

### 5.4 MSTORE8 (0x53)

- [ ] Implement MSTORE8 opcode
- [ ] Store single byte at memory offset
- [ ] Test: Store byte and load word

### 5.5 MSIZE (0x59)

- [ ] Implement MSIZE opcode
- [ ] Return highest accessed memory offset (rounded to 32 bytes)
- [ ] Test: Initial MSIZE = 0
- [ ] Test: After MLOAD = 0x20
- [ ] Test: Memory chunks (0x60 for offset 0x39)
- [ ] Test: After MSTORE8

---

## 6. Storage Operations

### 6.1 SSTORE (0x55)

- [ ] Implement SSTORE opcode
- [ ] Store 256-bit value at 256-bit key
- [ ] Test: Store and load at slot 0
- [ ] Test: Store at non-zero slot

### 6.2 SLOAD (0x54)

- [ ] Implement SLOAD opcode
- [ ] Load 256-bit value from 256-bit key
- [ ] Return 0 for uninitialized slots
- [ ] Test: Load stored value
- [ ] Test: Load empty slot (returns 0)

---

## 7. Control Flow

### 7.1 JUMP (0x56)

- [ ] Implement JUMP opcode
- [ ] Set PC to stack value
- [ ] Validate destination is JUMPDEST
- [ ] Test: Jump to valid JUMPDEST
- [ ] Test: Jump to non-JUMPDEST (fail)
- [ ] Test: Jump to PUSH argument (bad boundary, fail)

### 7.2 JUMPI (0x57)

- [ ] Implement JUMPI opcode (conditional jump)
- [ ] Jump if condition != 0
- [ ] Test: Condition = 0 (no jump)
- [ ] Test: Condition != 0 (jump)

### 7.3 JUMPDEST (0x5B)

- [ ] Implement JUMPDEST opcode
- [ ] Valid jump destination marker
- [ ] Pre-analyze code for valid JUMPDESTs

### 7.4 PC (0x58)

- [ ] Implement PC opcode
- [ ] Push current program counter
- [ ] Test: PC at position 0
- [ ] Test: PC after some code

### 7.5 GAS (0x5A)

- [ ] Implement GAS opcode
- [ ] For tests: return MAX_UINT256
- [ ] Test: GAS returns MAX_UINT256

### 7.6 INVALID (0xFE)

- [ ] Implement INVALID opcode
- [ ] Return success = false
- [ ] Test: INVALID halts execution with failure

---

## 8. Environment Information

### 8.1 ADDRESS (0x30)

- [ ] Implement ADDRESS opcode
- [ ] Push current contract address (tx.to)
- [ ] Test: Returns correct address

### 8.2 BALANCE (0x31)

- [ ] Implement BALANCE opcode
- [ ] Get balance of address from state
- [ ] Return 0 for non-existent accounts
- [ ] Test: Get balance of account with balance
- [ ] Test: Get balance of empty account (0)

### 8.3 ORIGIN (0x32)

- [ ] Implement ORIGIN opcode
- [ ] Push transaction origin (tx.origin)
- [ ] Test: Returns correct origin

### 8.4 CALLER (0x33)

- [ ] Implement CALLER opcode
- [ ] Push direct caller (msg.sender)
- [ ] Test: Returns correct caller

### 8.5 CALLVALUE (0x34)

- [ ] Implement CALLVALUE opcode
- [ ] Push wei sent with call (msg.value)
- [ ] Test: Returns correct value

### 8.6 CALLDATALOAD (0x35)

- [ ] Implement CALLDATALOAD opcode
- [ ] Load 32 bytes from calldata at offset
- [ ] Pad with zeros if reading past end
- [ ] Test: Load from offset 0
- [ ] Test: Load from end (pad with zeros)

### 8.7 CALLDATASIZE (0x36)

- [ ] Implement CALLDATASIZE opcode
- [ ] Push size of calldata
- [ ] Test: Returns correct size
- [ ] Test: No data (returns 0)

### 8.8 CALLDATACOPY (0x37)

- [ ] Implement CALLDATACOPY opcode
- [ ] Copy calldata to memory
- [ ] Update MSIZE
- [ ] Test: Copy full calldata
- [ ] Test: Copy tail (pad with zeros)

### 8.9 CODESIZE (0x38)

- [ ] Implement CODESIZE opcode
- [ ] Push size of current code
- [ ] Test: Small code (1 byte)
- [ ] Test: Larger code

### 8.10 CODECOPY (0x39)

- [ ] Implement CODECOPY opcode
- [ ] Copy code to memory
- [ ] Pad with zeros if reading past end
- [ ] Test: Copy code to memory
- [ ] Test: Copy past end (pad with zeros)

### 8.11 GASPRICE (0x3A)

- [ ] Implement GASPRICE opcode
- [ ] Push transaction gas price
- [ ] Test: Returns correct gasprice

### 8.12 EXTCODESIZE (0x3B)

- [ ] Implement EXTCODESIZE opcode
- [ ] Get code size of external account
- [ ] Return 0 for non-existent accounts
- [ ] Test: Get size of contract with code
- [ ] Test: Get size of empty account (0)

### 8.13 EXTCODECOPY (0x3C)

- [ ] Implement EXTCODECOPY opcode
- [ ] Copy external code to memory
- [ ] Test: Copy external code

### 8.14 RETURNDATASIZE (0x3D)

- [ ] Implement RETURNDATASIZE opcode
- [ ] Push size of last call's return data
- [ ] Test: Initially 0
- [ ] Test: After CALL

### 8.15 RETURNDATACOPY (0x3E)

- [ ] Implement RETURNDATACOPY opcode
- [ ] Copy return data to memory
- [ ] Test: Copy return data after CALL

### 8.16 EXTCODEHASH (0x3F)

- [ ] Implement EXTCODEHASH opcode
- [ ] Get keccak256 hash of external code
- [ ] Return 0 for non-existent accounts
- [ ] Test: Get hash of contract code
- [ ] Test: Get hash of empty account (0)

### 8.17 BLOCKHASH (0x40)

- [ ] Implement BLOCKHASH opcode
- [ ] For tests: return 0
- [ ] Test: Returns 0

### 8.18 SELFBALANCE (0x47)

- [ ] Implement SELFBALANCE opcode
- [ ] Push balance of current contract
- [ ] Test: Returns correct balance

---

## 9. Block Information

### 9.1 COINBASE (0x41)

- [ ] Implement COINBASE opcode
- [ ] Push block miner address
- [ ] Test: Returns correct coinbase
- [ ] Test: Different coinbase value

### 9.2 TIMESTAMP (0x42)

- [ ] Implement TIMESTAMP opcode
- [ ] Push block timestamp
- [ ] Test: Returns correct timestamp

### 9.3 NUMBER (0x43)

- [ ] Implement NUMBER opcode
- [ ] Push block number
- [ ] Test: Returns correct block number

### 9.4 DIFFICULTY (0x44)

- [ ] Implement DIFFICULTY opcode
- [ ] Push block difficulty (or PREVRANDAO post-merge)
- [ ] Test: Returns correct difficulty

### 9.5 GASLIMIT (0x45)

- [ ] Implement GASLIMIT opcode
- [ ] Push block gas limit
- [ ] Test: Returns correct gas limit

### 9.6 CHAINID (0x46)

- [ ] Implement CHAINID opcode
- [ ] Push chain ID
- [ ] Test: Returns correct chain ID

### 9.7 BASEFEE (0x48)

- [ ] Implement BASEFEE opcode
- [ ] Push block base fee
- [ ] Test: Returns correct base fee

---

## 10. Logging Operations

### 10.1 Log Infrastructure

- [ ] Implement log structure:
  - [ ] address (emitting contract)
  - [ ] data (arbitrary bytes)
  - [ ] topics (0-4 indexed values)

### 10.2 LOG0 (0xA0)

- [ ] Implement LOG0 opcode
- [ ] No topics, just data
- [ ] Test: Emit log with data

### 10.3 LOG1 (0xA1)

- [ ] Implement LOG1 opcode
- [ ] 1 topic + data
- [ ] Test: Emit log with 1 topic

### 10.4 LOG2 (0xA2)

- [ ] Implement LOG2 opcode
- [ ] 2 topics + data
- [ ] Test: Emit log with 2 topics

### 10.5 LOG3 (0xA3)

- [ ] Implement LOG3 opcode
- [ ] 3 topics + data
- [ ] Test: Emit log with 3 topics

### 10.6 LOG4 (0xA4)

- [ ] Implement LOG4 opcode
- [ ] 4 topics + data
- [ ] Test: Emit log with 4 topics

### 10.7 Generic LOG Implementation

- [ ] `n = opcode - 0xA0`
- [ ] Pop n topics from stack
- [ ] Read data from memory

---

## 11. System Operations

### 11.1 SHA3/KECCAK256 (0x20)

- [ ] Implement SHA3 opcode
- [ ] Use keccak256 algorithm (NOT standard SHA3)
- [ ] Hash memory region
- [ ] Test: Hash known value

### 11.2 RETURN (0xF3)

- [ ] Implement RETURN opcode
- [ ] Return data from memory region
- [ ] Set success = true
- [ ] Test: Return data

### 11.3 REVERT (0xFD)

- [ ] Implement REVERT opcode
- [ ] Return data from memory region
- [ ] Set success = false
- [ ] Test: Revert with data

### 11.4 CALL (0xF1)

- [ ] Implement CALL opcode
- [ ] Parameters: gas, to, value, argsOffset, argsSize, retOffset, retSize
- [ ] Recursively call EVM
- [ ] Handle return data
- [ ] Push 1 on success, 0 on failure
- [ ] Test: Call contract that returns data
- [ ] Test: Call contract that returns CALLER
- [ ] Test: Call contract that reverts

### 11.5 DELEGATECALL (0xF4)

- [ ] Implement DELEGATECALL opcode
- [ ] Execute code in caller's context
- [ ] Preserve msg.sender and msg.value
- [ ] Use caller's storage
- [ ] Test: DELEGATECALL preserves context

### 11.6 STATICCALL (0xFA)

- [ ] Implement STATICCALL opcode
- [ ] Like CALL but read-only
- [ ] Revert if state modification attempted
- [ ] Test: STATICCALL returns data
- [ ] Test: STATICCALL reverts on write

### 11.7 Static Context Flag

- [ ] Track whether in static context
- [ ] Block state-modifying operations in static context:
  - [ ] SSTORE
  - [ ] CREATE/CREATE2
  - [ ] SELFDESTRUCT
  - [ ] LOG0-LOG4
  - [ ] CALL with value > 0

---

## 12. Contract Creation

### 12.1 CREATE (0xF0)

- [ ] Implement CREATE opcode
- [ ] Calculate new address: keccak256(rlp([sender, nonce]))[12:]
- [ ] Execute initialization code
- [ ] Store returned bytecode
- [ ] Push new address on success, 0 on failure
- [ ] Test: CREATE empty account
- [ ] Test: CREATE with code
- [ ] Test: CREATE that reverts

### 12.2 CREATE2 (0xF5)

- [ ] Implement CREATE2 opcode (if needed for tests)
- [ ] Calculate new address: keccak256(0xff + sender + salt + keccak256(init_code))[12:]

### 12.3 SELFDESTRUCT (0xFF)

- [ ] Implement SELFDESTRUCT opcode
- [ ] Transfer balance to target address
- [ ] Delete account from state
- [ ] Test: SELFDESTRUCT transfers balance

---

## Summary: Opcode Implementation Checklist

| Opcode         | Hex       | Status |
| -------------- | --------- | ------ |
| STOP           | 0x00      | [ ]    |
| ADD            | 0x01      | [ ]    |
| MUL            | 0x02      | [ ]    |
| SUB            | 0x03      | [ ]    |
| DIV            | 0x04      | [ ]    |
| SDIV           | 0x05      | [ ]    |
| MOD            | 0x06      | [ ]    |
| SMOD           | 0x07      | [ ]    |
| ADDMOD         | 0x08      | [ ]    |
| MULMOD         | 0x09      | [ ]    |
| EXP            | 0x0A      | [ ]    |
| SIGNEXTEND     | 0x0B      | [ ]    |
| LT             | 0x10      | [ ]    |
| GT             | 0x11      | [ ]    |
| SLT            | 0x12      | [ ]    |
| SGT            | 0x13      | [ ]    |
| EQ             | 0x14      | [ ]    |
| ISZERO         | 0x15      | [ ]    |
| AND            | 0x16      | [ ]    |
| OR             | 0x17      | [ ]    |
| XOR            | 0x18      | [ ]    |
| NOT            | 0x19      | [ ]    |
| BYTE           | 0x1A      | [ ]    |
| SHL            | 0x1B      | [ ]    |
| SHR            | 0x1C      | [ ]    |
| SAR            | 0x1D      | [ ]    |
| SHA3           | 0x20      | [ ]    |
| ADDRESS        | 0x30      | [ ]    |
| BALANCE        | 0x31      | [ ]    |
| ORIGIN         | 0x32      | [ ]    |
| CALLER         | 0x33      | [ ]    |
| CALLVALUE      | 0x34      | [ ]    |
| CALLDATALOAD   | 0x35      | [ ]    |
| CALLDATASIZE   | 0x36      | [ ]    |
| CALLDATACOPY   | 0x37      | [ ]    |
| CODESIZE       | 0x38      | [ ]    |
| CODECOPY       | 0x39      | [ ]    |
| GASPRICE       | 0x3A      | [ ]    |
| EXTCODESIZE    | 0x3B      | [ ]    |
| EXTCODECOPY    | 0x3C      | [ ]    |
| RETURNDATASIZE | 0x3D      | [ ]    |
| RETURNDATACOPY | 0x3E      | [ ]    |
| EXTCODEHASH    | 0x3F      | [ ]    |
| BLOCKHASH      | 0x40      | [ ]    |
| COINBASE       | 0x41      | [ ]    |
| TIMESTAMP      | 0x42      | [ ]    |
| NUMBER         | 0x43      | [ ]    |
| DIFFICULTY     | 0x44      | [ ]    |
| GASLIMIT       | 0x45      | [ ]    |
| CHAINID        | 0x46      | [ ]    |
| SELFBALANCE    | 0x47      | [ ]    |
| BASEFEE        | 0x48      | [ ]    |
| POP            | 0x50      | [ ]    |
| MLOAD          | 0x51      | [ ]    |
| MSTORE         | 0x52      | [ ]    |
| MSTORE8        | 0x53      | [ ]    |
| SLOAD          | 0x54      | [ ]    |
| SSTORE         | 0x55      | [ ]    |
| JUMP           | 0x56      | [ ]    |
| JUMPI          | 0x57      | [ ]    |
| PC             | 0x58      | [ ]    |
| MSIZE          | 0x59      | [ ]    |
| GAS            | 0x5A      | [ ]    |
| JUMPDEST       | 0x5B      | [ ]    |
| PUSH0          | 0x5F      | [ ]    |
| PUSH1-PUSH32   | 0x60-0x7F | [ ]    |
| DUP1-DUP16     | 0x80-0x8F | [ ]    |
| SWAP1-SWAP16   | 0x90-0x9F | [ ]    |
| LOG0-LOG4      | 0xA0-0xA4 | [ ]    |
| CREATE         | 0xF0      | [ ]    |
| CALL           | 0xF1      | [ ]    |
| RETURN         | 0xF3      | [ ]    |
| DELEGATECALL   | 0xF4      | [ ]    |
| STATICCALL     | 0xFA      | [ ]    |
| REVERT         | 0xFD      | [ ]    |
| INVALID        | 0xFE      | [ ]    |
| SELFDESTRUCT   | 0xFF      | [ ]    |

---

## Implementation Order (Recommended)

Based on test case progression in `evm.json`:

### Phase 1: Basic Execution

1. Core infrastructure (PC, stack, execution loop)
2. STOP
3. PUSH0, PUSH1-PUSH32
4. POP
5. Basic arithmetic: ADD, MUL, SUB, DIV, MOD

### Phase 2: Extended Arithmetic

6. SDIV, SMOD
7. ADDMOD, MULMOD
8. EXP
9. SIGNEXTEND

### Phase 3: Comparisons & Bitwise

10. LT, GT, SLT, SGT, EQ, ISZERO
11. AND, OR, XOR, NOT
12. SHL, SHR, SAR
13. BYTE

### Phase 4: Stack Manipulation

14. DUP1-DUP16
15. SWAP1-SWAP16

### Phase 5: Control Flow

16. INVALID
17. PC, GAS
18. JUMP, JUMPI, JUMPDEST

### Phase 6: Memory

19. MSTORE, MLOAD, MSTORE8
20. MSIZE
21. SHA3

### Phase 7: Environment (Transaction)

22. ADDRESS, CALLER, ORIGIN
23. GASPRICE
24. CALLVALUE
25. CALLDATALOAD, CALLDATASIZE, CALLDATACOPY

### Phase 8: Environment (Block)

26. BASEFEE, COINBASE, TIMESTAMP
27. NUMBER, DIFFICULTY, GASLIMIT
28. CHAINID, BLOCKHASH

### Phase 9: State

29. BALANCE, SELFBALANCE
30. CODESIZE, CODECOPY
31. EXTCODESIZE, EXTCODECOPY, EXTCODEHASH
32. SSTORE, SLOAD

### Phase 10: Logging

33. LOG0-LOG4

### Phase 11: Calls & Returns

34. RETURN, REVERT
35. CALL
36. RETURNDATASIZE, RETURNDATACOPY
37. DELEGATECALL
38. STATICCALL

### Phase 12: Contract Creation

39. CREATE
40. SELFDESTRUCT

---

## Test Count by Category

| Category       | Test Count |
| -------------- | ---------- |
| STOP           | 2          |
| PUSH           | 10         |
| POP            | 1          |
| ADD            | 2          |
| MUL            | 2          |
| SUB            | 2          |
| DIV            | 3          |
| MOD            | 3          |
| ADDMOD         | 2          |
| MULMOD         | 2          |
| EXP            | 1          |
| SIGNEXTEND     | 2          |
| SDIV           | 4          |
| SMOD           | 3          |
| LT             | 3          |
| GT             | 3          |
| SLT            | 3          |
| SGT            | 3          |
| EQ             | 2          |
| ISZERO         | 2          |
| NOT            | 1          |
| AND            | 1          |
| OR             | 1          |
| XOR            | 1          |
| SHL            | 3          |
| SHR            | 3          |
| SAR            | 4          |
| BYTE           | 4          |
| DUP            | 4          |
| SWAP           | 4          |
| INVALID        | 1          |
| PC             | 2          |
| GAS            | 1          |
| JUMP           | 3          |
| JUMPI          | 2          |
| MSTORE         | 2          |
| MSTORE8        | 1          |
| MSIZE          | 4          |
| SHA3           | 1          |
| ADDRESS        | 1          |
| CALLER         | 1          |
| ORIGIN         | 1          |
| GASPRICE       | 1          |
| BASEFEE        | 1          |
| COINBASE       | 2          |
| TIMESTAMP      | 1          |
| NUMBER         | 1          |
| DIFFICULTY     | 1          |
| GASLIMIT       | 1          |
| CHAINID        | 1          |
| BLOCKHASH      | 1          |
| BALANCE        | 2          |
| CALLVALUE      | 1          |
| CALLDATALOAD   | 2          |
| CALLDATASIZE   | 2          |
| CALLDATACOPY   | 2          |
| CODESIZE       | 2          |
| CODECOPY       | 2          |
| EXTCODESIZE    | 2          |
| EXTCODECOPY    | 1          |
| EXTCODEHASH    | 2          |
| SELFBALANCE    | 1          |
| SSTORE         | 2          |
| SLOAD          | 1          |
| LOG0-LOG4      | 5          |
| RETURN         | 1          |
| REVERT         | 1          |
| CALL           | 3          |
| RETURNDATASIZE | 2          |
| RETURNDATACOPY | 1          |
| DELEGATECALL   | 1          |
| STATICCALL     | 2          |
| CREATE         | 3          |
| SELFDESTRUCT   | 1          |

**Total: ~120+ tests**

---

## Notes & Tips

1. **256-bit integers**: Use a big integer library (e.g., `big.Int` in Go, `BigInt` in JS, `U256` in Rust)

2. **Two's complement**: For signed operations, the most significant bit indicates sign. -1 = 0xFF...FF

3. **Memory expansion**: Memory grows in 32-byte words. Access to offset N expands memory to ceil((N+1)/32)\*32

4. **JUMPDEST validation**: Pre-scan bytecode to find valid JUMPDESTs (not inside PUSH data)

5. **Keccak256**: Use keccak256, NOT SHA3-256 (they have different padding)

6. **Gas**: For simplicity, these tests don't track gas. Return MAX_UINT256 for GAS opcode

7. **Error handling**: Return success=false for invalid operations, don't throw exceptions

8. **Stack order**: Top of stack is first element in test expectations

---

Good luck with your EVM implementation!
