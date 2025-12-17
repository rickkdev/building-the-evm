// Memory opcodes: MLOAD, MSTORE, MSTORE8, MSIZE

// Expand memory to fit offset + size, rounded to 32-byte chunks
function expandMemory(memory: Uint8Array, offset: number, size: number): Uint8Array {
  if (size === 0) return memory;
  const needed = offset + size;
  const newSize = Math.ceil(needed / 32) * 32;
  if (newSize > memory.length) {
    const newMemory = new Uint8Array(newSize);
    newMemory.set(memory);
    return newMemory;
  }
  return memory;
}

// MSTORE (0x52) - Store 32 bytes at memory[offset]
export function mstore(stack: bigint[], memory: Uint8Array): Uint8Array {
  const offset = Number(stack.pop()!);
  const value = stack.pop()!;
  memory = expandMemory(memory, offset, 32);
  // Write 32 bytes, big-endian
  for (let i = 0; i < 32; i++) {
    memory[offset + i] = Number((value >> BigInt((31 - i) * 8)) & 0xffn);
  }
  return memory;
}

// MSTORE8 (0x53) - Store 1 byte at memory[offset]
export function mstore8(stack: bigint[], memory: Uint8Array): Uint8Array {
  const offset = Number(stack.pop()!);
  const value = stack.pop()!;
  memory = expandMemory(memory, offset, 1);
  memory[offset] = Number(value & 0xffn);
  return memory;
}

// MLOAD (0x51) - Load 32 bytes from memory[offset]
export function mload(stack: bigint[], memory: Uint8Array): Uint8Array {
  const offset = Number(stack.pop()!);
  memory = expandMemory(memory, offset, 32);
  let value = 0n;
  for (let i = 0; i < 32; i++) {
    value = (value << 8n) | BigInt(memory[offset + i]);
  }
  stack.push(value);
  return memory;
}

// MSIZE (0x59) - Return current memory size (in bytes)
export function msize(stack: bigint[], memory: Uint8Array): void {
  stack.push(BigInt(memory.length));
}
