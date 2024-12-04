export function getEnumKey(
  enumObj: { [s: string]: unknown },
  value: string | number
): string | undefined {
  return Object.entries(enumObj).find(([_, val]) => val === value)?.[0];
}
