export function toId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with "-"
    .replace(/-+/g, '-') // collapse multiple "-"
    .replace(/^-|-$/g, ''); // trim leading/trailing "-"
}

export interface IdValuePair {
  id: string;
  value: string | number;
}

// Convert to `{ id: value }` pair, excluding any IDs provided
export function getIdValuePairs(
  record: Record<string, string | number> | undefined,
  exclude: string[] = [],
): IdValuePair[] {
  if (!record) return [];
  return Object.entries(record)
    .filter(([k]) => !exclude.includes(k))
    .map(([id, value]) => ({ id, value }));
}
