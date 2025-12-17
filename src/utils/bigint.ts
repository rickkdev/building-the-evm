// 256-bit math constants and helpers

export const MAX_UINT256 = 2n ** 256n;

// Convert unsigned to signed (two's complement)
export function toSigned(x: bigint): bigint {
  if (x >= 2n ** 255n) return x - MAX_UINT256;
  return x;
}

// Convert signed to unsigned (two's complement)
export function toUnsigned(x: bigint): bigint {
  if (x < 0n) return x + MAX_UINT256;
  return x;
}
