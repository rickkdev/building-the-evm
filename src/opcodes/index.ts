// Opcode handler registry

import { push0, pop } from "./stack";
import { add, mul, sub, div, sdiv, mod, smod, addmod, mulmod, exp, signextend } from "./arithmetic";
import { lt, gt, slt, sgt, eq, iszero } from "./comparison";

type OpcodeHandler = {
  fn: (stack: bigint[]) => void;
  minStack: number;
};

export const handlers: Record<number, OpcodeHandler> = {
  // Stack operations
  0x50: { fn: pop, minStack: 1 },       // POP
  0x5f: { fn: push0, minStack: 0 },     // PUSH0

  // Arithmetic operations
  0x01: { fn: add, minStack: 2 },       // ADD
  0x02: { fn: mul, minStack: 2 },       // MUL
  0x03: { fn: sub, minStack: 2 },       // SUB
  0x04: { fn: div, minStack: 2 },       // DIV
  0x05: { fn: sdiv, minStack: 2 },      // SDIV
  0x06: { fn: mod, minStack: 2 },       // MOD
  0x07: { fn: smod, minStack: 2 },      // SMOD
  0x08: { fn: addmod, minStack: 3 },    // ADDMOD
  0x09: { fn: mulmod, minStack: 3 },    // MULMOD
  0x0a: { fn: exp, minStack: 2 },       // EXP
  0x0b: { fn: signextend, minStack: 2 },// SIGNEXTEND

  // Comparison operations
  0x10: { fn: lt, minStack: 2 },        // LT
  0x11: { fn: gt, minStack: 2 },        // GT
  0x12: { fn: slt, minStack: 2 },       // SLT
  0x13: { fn: sgt, minStack: 2 },       // SGT
  0x14: { fn: eq, minStack: 2 },        // EQ
  0x15: { fn: iszero, minStack: 1 },    // ISZERO
};
