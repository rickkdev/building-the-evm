const MAX_UINT256 = 2n ** 256n;

// Convert unsigned to signed (two's complement)
function toSigned(x: bigint): bigint {
  if (x >= 2n ** 255n) return x - MAX_UINT256;
  return x;
}

// Convert signed to unsigned (two's complement)
function toUnsigned(x: bigint): bigint {
  if (x < 0n) return x + MAX_UINT256;
  return x;
}

export default function evm(code: Uint8Array): {
  success: boolean;
  stack: bigint[];
} {
  const stack: bigint[] = [];
  let pc: number = 0;

  while (pc < code.length) {
    const opcode: number = code[pc];
    pc += 1;

    // STOP (0x00) - Halt execution, return success
    if (opcode === 0x00) {
      return { success: true, stack: stack.reverse() };
    }

    // PUSH0 (0x5F) - Push zero onto the stack
    if (opcode === 0x5f) {
      stack.push(0n);
      continue;
    }

    // PUSH1-PUSH32 (0x60-0x7F) - Push N bytes onto stack (N = opcode - 0x5F)
    if (opcode >= 0x60 && opcode <= 0x7f) {
      const pushBytes: number = opcode - 0x5f;
      let value: bigint = 0n;
      for (let i = 0; i < pushBytes; i++) {
        value = (value << 8n) | BigInt(code[pc]);
        pc += 1;
      }
      stack.push(value);
      continue;
    }

    // POP (0x50) - Remove top item from stack
    if (opcode === 0x50) {
      if (stack.length === 0) {
        return { success: false, stack: [] };
      }
      stack.pop();
      continue;
    }

    // ADD (0x01) - Pop a, b; push (a + b) % 2^256
    if (opcode === 0x01) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push((a + b) % 2n ** 256n);
      continue;
    }

    // MUL (0x02) - Pop a, b; push (a * b) % 2^256
    if (opcode === 0x02) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push((a * b) % 2n ** 256n);
      continue;
    }

    // SUB (0x03) - Pop a, b; push (a - b) % 2^256 (wraps on underflow)
    if (opcode === 0x03) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push((((a - b) % 2n ** 256n) + 2n ** 256n) % 2n ** 256n);
      continue;
    }

    // DIV (0x04) - Pop a, b; push a / b (integer division, 0 if b is 0)
    if (opcode === 0x04) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(b === 0n ? 0n : a / b);
      continue;
    }

    // SDIV (0x05) - Signed division. Pop a, b; push a / b as signed integers
    if (opcode === 0x05) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = toSigned(stack.pop()!);
      const b = toSigned(stack.pop()!);
      if (b === 0n) {
        stack.push(0n);
      } else {
        const result = a / b;
        stack.push(toUnsigned(result));
      }
      continue;
    }

    // MOD (0x06) - Pop a, b; push a % b (0 if b is 0)
    if (opcode === 0x06) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(b === 0n ? 0n : a % b);
      continue;
    }

    // SMOD (0x07) - Signed modulo. Pop a, b; push a % b as signed integers
    if (opcode === 0x07) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = toSigned(stack.pop()!);
      const b = toSigned(stack.pop()!);
      if (b === 0n) {
        stack.push(0n);
      } else {
        const result = a % b;
        stack.push(toUnsigned(result));
      }
      continue;
    }

    // ADDMOD (0x08) - Pop a, b, N; push (a + b) % N (0 if N is 0)
    if (opcode === 0x08) {
      if (stack.length < 3) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      const N = stack.pop()!;
      stack.push(N === 0n ? 0n : (a + b) % N);
      continue;
    }

    // MULMOD (0x09) - Pop a, b, N; push (a * b) % N (0 if N is 0)
    if (opcode === 0x09) {
      if (stack.length < 3) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      const N = stack.pop()!;
      stack.push(N === 0n ? 0n : (a * b) % N);
      continue;
    }

    // EXP (0x0A) - Pop a, b; push a^b % 2^256
    if (opcode === 0x0a) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(a ** b % 2n ** 256n);
      continue;
    }

    // SIGNEXTEND (0x0B) - Extend sign bit of byte k to fill 256 bits
    if (opcode === 0x0b) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
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
            ((2n ** 256n - 1n) >> (signBitPos + 1n)) << (signBitPos + 1n);
          stack.push(x | mask);
        }
      }
      continue;
    }

    // LT (0x10) - Pop a, b; push 1 if a < b (unsigned), else 0
    if (opcode === 0x10) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(a < b ? 1n : 0n);
      continue;
    }

    // GT (0x11) - Pop a, b; push 1 if a > b (unsigned), else 0
    if (opcode === 0x11) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(a > b ? 1n : 0n);
      continue;
    }

    // SLT (0x12) - Pop a, b; push 1 if a < b (signed), else 0
    if (opcode === 0x12) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = toSigned(stack.pop()!);
      const b = toSigned(stack.pop()!);
      stack.push(a < b ? 1n : 0n);
      continue;
    }

    // SGT (0x13) - Pop a, b; push 1 if a > b (signed), else 0
    if (opcode === 0x13) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = toSigned(stack.pop()!);
      const b = toSigned(stack.pop()!);
      stack.push(a > b ? 1n : 0n);
      continue;
    }

    // EQ (0x14) - Pop a, b; push 1 if a == b, else 0
    if (opcode === 0x14) {
      if (stack.length < 2) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(a === b ? 1n : 0n);
      continue;
    }

    // ISZERO (0x15) - Pop a; push 1 if a == 0, else 0
    if (opcode === 0x15) {
      if (stack.length < 1) {
        return { success: false, stack: [] };
      }
      const a = stack.pop()!;
      stack.push(a === 0n ? 1n : 0n);
      continue;
    }
  }

  return { success: true, stack: stack.reverse() };
}
