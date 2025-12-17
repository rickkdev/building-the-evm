// Stack opcodes: PUSH0, PUSH1-32, POP, DUP1-16, SWAP1-16

// PUSH0 (0x5F) - Push zero onto the stack
export function push0(stack: bigint[]): void {
  stack.push(0n);
}

// PUSH1-PUSH32 (0x60-0x7F) - Push N bytes onto stack
export function pushN(stack: bigint[], code: Uint8Array, pc: number, n: number): number {
  let value = 0n;
  for (let i = 0; i < n; i++) {
    value = (value << 8n) | BigInt(code[pc + i]);
  }
  stack.push(value);
  return pc + n; // Return new PC position
}

// POP (0x50) - Remove top item from stack
export function pop(stack: bigint[]): void {
  stack.pop();
}

// DUP1-DUP16 (0x80-0x8F) - Duplicate nth stack item to top
// n=1 means duplicate top item
export function dup(stack: bigint[], n: number): void {
  const index = stack.length - n;
  stack.push(stack[index]);
}

// SWAP1-SWAP16 (0x90-0x9F) - Swap top with (n+1)th item
// n=1 means swap top with second item
export function swap(stack: bigint[], n: number): void {
  const topIndex = stack.length - 1;
  const swapIndex = stack.length - 1 - n;
  const temp = stack[topIndex];
  stack[topIndex] = stack[swapIndex];
  stack[swapIndex] = temp;
}
