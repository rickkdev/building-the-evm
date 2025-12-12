export default function evm(code: Uint8Array): {
  success: boolean;
  stack: bigint[];
} {
  const stack: bigint[] = [];
  let pc: number = 0;

  while (pc < code.length) {
    const opcode: number = code[pc];
    pc += 1;

    if (opcode === 0x00) {
      return { success: true, stack };
    }
    if (opcode === 0x5f) {
      stack.push(0n);
      continue;
    }
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
  }
  return { success: true, stack };
}
