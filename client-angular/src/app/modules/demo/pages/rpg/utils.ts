export function toId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with "-"
    .replace(/-+/g, '-') // collapse multiple "-"
    .replace(/^-|-$/g, ''); // trim leading/trailing "-"
}

export function arrayToSet(input?: string[] | Set<string>): Set<string> {
  if (input instanceof Set) return input;
  return new Set(input ?? []);
}

export function setToArray(input?: Set<string>): string[] {
  return input ? Array.from(input) : [];
}

export function arrayToEntityMap<T extends { id: string }>(
  arr: T[],
): Record<string, T> {
  return arr.reduce(
    (acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    },
    {} as Record<string, T>,
  );
}

export type RuntimeMetaSourceType =
  | 'effect'
  | 'character'
  | 'skill'
  | 'item'
  | 'location'
  | 'moment'
  | 'system';

// Runtime & provenance tracking metadata
export interface RuntimeMeta {
  sourceType?: RuntimeMetaSourceType;
  sourceId?: string; // id of the source (skill/item/etc.)
  appliedBy?: string; // who applied it
  appliedAt?: string; // ISO timestamp
  appliedTo?: string; // entityId
  targetId?: string; // generated from appliedTo
  // This has live/effective amount - catalog has default/start amount
  duration?: number; // turns remaining
  cooldown?: number; // turns until available
  // Optionally, can add a 'script' property for custom JS or engine code
}
