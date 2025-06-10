export function toId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with "-"
    .replace(/-+/g, '-') // collapse multiple "-"
    .replace(/^-|-$/g, ''); // trim leading/trailing "-"
}
