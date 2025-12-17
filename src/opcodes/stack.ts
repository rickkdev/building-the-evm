// Stack opcodes: PUSH0, PUSH1-32, POP

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
