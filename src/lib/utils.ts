export function normalizeHandle(input: string): string {
  return input.replace('@', '').trim().toLowerCase()
}
