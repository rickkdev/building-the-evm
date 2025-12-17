// Bitwise opcodes: NOT, AND, OR, XOR, BYTE, SHL, SHR, SAR

import { MAX_UINT256, toSigned, toUnsigned } from "../utils/bigint";

// NOT (0x19) - Flip all 256 bits
export function not(stack: bigint[]): void {
  const a = stack.pop()!;
  stack.push(MAX_UINT256 - 1n - a);
}

// AND (0x16) - Bitwise AND
export function and(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a & b);
}

// OR (0x17) - Bitwise OR
export function or(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a | b);
}

// XOR (0x18) - Bitwise XOR
export function xor(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a ^ b);
}

// BYTE (0x1A) - Get byte at position (0 = most significant)
export function byte(stack: bigint[]): void {
  const i = stack.pop()!;
  const x = stack.pop()!;
  if (i >= 32n) {
    stack.push(0n);
  } else {
    stack.push((x >> (248n - i * 8n)) & 0xffn);
  }
}

// SHL (0x1B) - Shift left
export function shl(stack: bigint[]): void {
  const shift = stack.pop()!;
  const value = stack.pop()!;
  if (shift >= 256n) {
    stack.push(0n);
  } else {
    stack.push((value << shift) % MAX_UINT256);
  }
}

// SHR (0x1C) - Shift right (logical)
export function shr(stack: bigint[]): void {
  const shift = stack.pop()!;
  const value = stack.pop()!;
  if (shift >= 256n) {
    stack.push(0n);
  } else {
    stack.push(value >> shift);
  }
}

// SAR (0x1D) - Shift right (arithmetic, preserves sign)
export function sar(stack: bigint[]): void {
  const shift = stack.pop()!;
  const value = stack.pop()!;
  const signed = toSigned(value);
  if (shift >= 256n) {
    // If negative, fill with 1s; if positive, fill with 0s
    stack.push(signed < 0n ? MAX_UINT256 - 1n : 0n);
  } else {
    stack.push(toUnsigned(signed >> shift));
  }
}
