// System opcodes: SHA3

import { keccak256 } from "js-sha3";

// SHA3 (0x20) - Keccak256 hash of memory region
export function sha3(stack: bigint[], memory: Uint8Array): Uint8Array {
  const offset = Number(stack.pop()!);
  const size = Number(stack.pop()!);

  // Expand memory if needed
  const needed = offset + size;
  const newSize = Math.ceil(needed / 32) * 32;
  if (newSize > memory.length) {
    const newMemory = new Uint8Array(newSize);
    newMemory.set(memory);
    memory = newMemory;
  }

  // Get data from memory
  const data = memory.slice(offset, offset + size);

  // Hash it
  const hash = keccak256(data);

  // Convert hex string to bigint
  const result = BigInt("0x" + hash);
  stack.push(result);

  return memory;
}
