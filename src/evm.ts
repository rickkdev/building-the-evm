// EVM Main execution loop

import { handlers } from "./opcodes";
import { pushN } from "./opcodes/stack";

export default function evm(code: Uint8Array): {
  success: boolean;
  stack: bigint[];
} {
  const stack: bigint[] = [];
  let pc = 0;

  while (pc < code.length) {
    const opcode = code[pc];
    pc++;

    // STOP (0x00) - Halt execution, return success
    if (opcode === 0x00) {
      return { success: true, stack: stack.reverse() };
    }

    // PUSH1-PUSH32 (0x60-0x7F) - Special case: reads bytes from code
    if (opcode >= 0x60 && opcode <= 0x7f) {
      const n = opcode - 0x5f;
      pc = pushN(stack, code, pc, n);
      continue;
    }

    // Look up handler in registry
    const handler = handlers[opcode];
    if (handler) {
      if (stack.length < handler.minStack) {
        return { success: false, stack: [] };
      }
      handler.fn(stack);
      continue;
    }

    // Unknown opcode - continue for now (will handle INVALID later)
  }

  return { success: true, stack: stack.reverse() };
}
