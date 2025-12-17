// Arithmetic opcodes: ADD, MUL, SUB, DIV, SDIV, MOD, SMOD, ADDMOD, MULMOD, EXP, SIGNEXTEND

import { MAX_UINT256, toSigned, toUnsigned } from "../utils/bigint";

// ADD (0x01) - Pop a, b; push (a + b) % 2^256
export function add(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push((a + b) % MAX_UINT256);
}

// MUL (0x02) - Pop a, b; push (a * b) % 2^256
export function mul(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push((a * b) % MAX_UINT256);
}

// SUB (0x03) - Pop a, b; push (a - b) % 2^256 (wraps on underflow)
export function sub(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push((((a - b) % MAX_UINT256) + MAX_UINT256) % MAX_UINT256);
}

// DIV (0x04) - Pop a, b; push a / b (integer division, 0 if b is 0)
export function div(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(b === 0n ? 0n : a / b);
}

// SDIV (0x05) - Signed division. Pop a, b; push a / b as signed integers
export function sdiv(stack: bigint[]): void {
  const a = toSigned(stack.pop()!);
  const b = toSigned(stack.pop()!);
  if (b === 0n) {
    stack.push(0n);
  } else {
    const result = a / b;
    stack.push(toUnsigned(result));
  }
}

// MOD (0x06) - Pop a, b; push a % b (0 if b is 0)
export function mod(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(b === 0n ? 0n : a % b);
}

// SMOD (0x07) - Signed modulo. Pop a, b; push a % b as signed integers
export function smod(stack: bigint[]): void {
  const a = toSigned(stack.pop()!);
  const b = toSigned(stack.pop()!);
  if (b === 0n) {
    stack.push(0n);
  } else {
    const result = a % b;
    stack.push(toUnsigned(result));
  }
}

// ADDMOD (0x08) - Pop a, b, N; push (a + b) % N (0 if N is 0)
export function addmod(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  const N = stack.pop()!;
  stack.push(N === 0n ? 0n : (a + b) % N);
}

// MULMOD (0x09) - Pop a, b, N; push (a * b) % N (0 if N is 0)
export function mulmod(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  const N = stack.pop()!;
  stack.push(N === 0n ? 0n : (a * b) % N);
}

// EXP (0x0A) - Pop a, b; push a^b % 2^256
export function exp(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a ** b % MAX_UINT256);
}

// SIGNEXTEND (0x0B) - Extend sign bit of byte k to fill 256 bits
export function signextend(stack: bigint[]): void {
  const k = stack.pop()!;
  const x = stack.pop()!;
  if (k >= 31n) {
    stack.push(x);
  } else {
    const signBitPos = k * 8n + 7n;
    const signBit = (x >> signBitPos) & 1n;
    if (signBit === 0n) {
      const mask = (1n << (signBitPos + 1n)) - 1n;
      stack.push(x & mask);
    } else {
      const mask =
        ((MAX_UINT256 - 1n) >> (signBitPos + 1n)) << (signBitPos + 1n);
      stack.push(x | mask);
    }
  }
}
