// Control flow opcodes: INVALID, PC, GAS, JUMP, JUMPI, JUMPDEST

import { MAX_UINT256 } from "../utils/bigint";

// PC (0x58) - Push current program counter
export function pc(stack: bigint[], currentPc: number): void {
  stack.push(BigInt(currentPc));
}

// GAS (0x5A) - Push remaining gas (we use MAX for simplicity)
export function gas(stack: bigint[]): void {
  stack.push(MAX_UINT256 - 1n);
}

// JUMPDEST (0x5B) - Valid jump destination (no-op)
export function jumpdest(): void {
  // Does nothing, just marks valid jump target
}

// Find all valid JUMPDEST positions in bytecode
export function findValidJumpDests(code: Uint8Array): Set<number> {
  const valid = new Set<number>();
  let i = 0;
  while (i < code.length) {
    const opcode = code[i];
    if (opcode === 0x5b) {
      // JUMPDEST
      valid.add(i);
    }
    // Skip PUSH data bytes
    if (opcode >= 0x60 && opcode <= 0x7f) {
      i += opcode - 0x5f;
    }
    i++;
  }
  return valid;
}
