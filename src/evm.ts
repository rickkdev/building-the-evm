// EVM Main execution loop

import { handlers } from "./opcodes";
import { pushN, dup, swap } from "./opcodes/stack";
import { pc as pcOp, findValidJumpDests } from "./opcodes/control";
import { mstore, mstore8, mload, msize } from "./opcodes/memory";
import { sha3 } from "./opcodes/system";

export default function evm(code: Uint8Array): {
  success: boolean;
  stack: bigint[];
} {
  const stack: bigint[] = [];
  let memory: Uint8Array = new Uint8Array(0);
  let pc = 0;
  const validJumpDests = findValidJumpDests(code);

  while (pc < code.length) {
    const opcode = code[pc];
    const currentPc = pc; // Save for PC opcode
    pc++;

    // STOP (0x00) - Halt execution, return success
    if (opcode === 0x00) {
      return { success: true, stack: stack.reverse() };
    }

    // INVALID (0xFE) - Halt execution, return failure
    if (opcode === 0xfe) {
      return { success: false, stack: [] };
    }

    // PC (0x58) - Push current program counter
    if (opcode === 0x58) {
      pcOp(stack, currentPc);
      continue;
    }

    // JUMP (0x56) - Jump to destination
    if (opcode === 0x56) {
      if (stack.length < 1) return { success: false, stack: [] };
      const dest = stack.pop()!;
      if (!validJumpDests.has(Number(dest))) {
        return { success: false, stack: [] };
      }
      pc = Number(dest);
      continue;
    }

    // JUMPI (0x57) - Conditional jump
    if (opcode === 0x57) {
      if (stack.length < 2) return { success: false, stack: [] };
      const dest = stack.pop()!;
      const cond = stack.pop()!;
      if (cond !== 0n) {
        if (!validJumpDests.has(Number(dest))) {
          return { success: false, stack: [] };
        }
        pc = Number(dest);
      }
      continue;
    }

    // MSTORE (0x52) - Store 32 bytes to memory
    if (opcode === 0x52) {
      if (stack.length < 2) return { success: false, stack: [] };
      memory = mstore(stack, memory);
      continue;
    }

    // MSTORE8 (0x53) - Store 1 byte to memory
    if (opcode === 0x53) {
      if (stack.length < 2) return { success: false, stack: [] };
      memory = mstore8(stack, memory);
      continue;
    }

    // MLOAD (0x51) - Load 32 bytes from memory
    if (opcode === 0x51) {
      if (stack.length < 1) return { success: false, stack: [] };
      memory = mload(stack, memory);
      continue;
    }

    // MSIZE (0x59) - Get memory size
    if (opcode === 0x59) {
      msize(stack, memory);
      continue;
    }

    // SHA3 (0x20) - Keccak256 hash
    if (opcode === 0x20) {
      if (stack.length < 2) return { success: false, stack: [] };
      memory = sha3(stack, memory);
      continue;
    }

    // PUSH1-PUSH32 (0x60-0x7F) - Special case: reads bytes from code
    if (opcode >= 0x60 && opcode <= 0x7f) {
      const n = opcode - 0x5f;
      pc = pushN(stack, code, pc, n);
      continue;
    }

    // DUP1-DUP16 (0x80-0x8F) - Duplicate nth item to top
    if (opcode >= 0x80 && opcode <= 0x8f) {
      const n = opcode - 0x7f; // DUP1 = 1, DUP16 = 16
      if (stack.length < n) return { success: false, stack: [] };
      dup(stack, n);
      continue;
    }

    // SWAP1-SWAP16 (0x90-0x9F) - Swap top with (n+1)th item
    if (opcode >= 0x90 && opcode <= 0x9f) {
      const n = opcode - 0x8f; // SWAP1 = 1, SWAP16 = 16
      if (stack.length < n + 1) return { success: false, stack: [] };
      swap(stack, n);
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

    // Unknown opcode - treat as invalid
  }

  return { success: true, stack: stack.reverse() };
}
