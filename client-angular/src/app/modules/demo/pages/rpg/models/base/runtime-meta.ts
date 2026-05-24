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
