// Comparison opcodes: LT, GT, SLT, SGT, EQ, ISZERO

import { toSigned } from "../utils/bigint";

// LT (0x10) - Pop a, b; push 1 if a < b (unsigned), else 0
export function lt(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a < b ? 1n : 0n);
}

// GT (0x11) - Pop a, b; push 1 if a > b (unsigned), else 0
export function gt(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a > b ? 1n : 0n);
}

// SLT (0x12) - Pop a, b; push 1 if a < b (signed), else 0
export function slt(stack: bigint[]): void {
  const a = toSigned(stack.pop()!);
  const b = toSigned(stack.pop()!);
  stack.push(a < b ? 1n : 0n);
}

// SGT (0x13) - Pop a, b; push 1 if a > b (signed), else 0
export function sgt(stack: bigint[]): void {
  const a = toSigned(stack.pop()!);
  const b = toSigned(stack.pop()!);
  stack.push(a > b ? 1n : 0n);
}

// EQ (0x14) - Pop a, b; push 1 if a == b, else 0
export function eq(stack: bigint[]): void {
  const a = stack.pop()!;
  const b = stack.pop()!;
  stack.push(a === b ? 1n : 0n);
}

// ISZERO (0x15) - Pop a; push 1 if a == 0, else 0
export function iszero(stack: bigint[]): void {
  const a = stack.pop()!;
  stack.push(a === 0n ? 1n : 0n);
}
