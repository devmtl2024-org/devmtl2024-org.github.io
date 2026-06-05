export function remainingSponsorships(total: number, taken: number): number {
  return Math.max(0, total - taken);
}
