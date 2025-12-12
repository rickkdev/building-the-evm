export default function evm(code: Uint8Array): {
  success: boolean;
  stack: bigint[];
} {
  const stack: bigint[] = [];

  // Your implementation here

  return { success: true, stack };
}
