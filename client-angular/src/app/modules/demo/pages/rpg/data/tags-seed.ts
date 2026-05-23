import { Tag, TagInstance } from '../models/tag';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const TAGS_SEED_RAW: TagSeedInput[] = [
  // Dimension (Games)
  { name: 'RPG Demo', kind: 'dimension' },
  { name: 'CoC', kind: 'dimension' },
  { name: 'Nimin', kind: 'dimension' },

  // --- PRIMARY TAGS ---

  // Attribute Groups
  { name: 'Core', kind: 'attribute' },
  { name: 'Defense', kind: 'attribute' },
  { name: 'Offense', kind: 'attribute' },
  { name: 'Utility', kind: 'attribute' },

  // // Effect Kinds
  // { name: 'Damage', category: 'effect' },
  // { name: 'Healing', category: 'effect' },

  // Status Effects (mechanical → often also an Effect)
  { name: 'Poisoned', kind: 'statusEffect' },
  { name: 'Confused', kind: 'statusEffect' },
  { name: 'Silenced', kind: 'statusEffect' },
  { name: 'Asleep', kind: 'statusEffect' },
  { name: 'Petrified', kind: 'statusEffect' },

  // Character Kinds
  { name: 'Player', kind: 'character' },
  { name: 'Enemy', kind: 'character' },
  { name: 'Companion', kind: 'character' },
  { name: 'Follower', kind: 'character' },
  { name: 'Persistent', kind: 'character' },

  // Location Kinds
  { name: 'Intro', kind: 'location' },
  { name: 'Safe Zone', kind: 'location' },
  { name: 'Contested Zone', kind: 'location' }, // Forest, Lake, Mountain, Desert
  { name: 'Secluded', kind: 'location' },
  { name: 'Camp', kind: 'location' },
  { name: 'Town', kind: 'location' },
  { name: 'Dungeon', kind: 'location' },

  // Moment / Event / Encounter Context
  { name: 'New Game', kind: 'moment' },
  { name: 'Combat', kind: 'moment' },
  { name: 'Vendor', kind: 'moment' },
  { name: 'Seasonal', kind: 'moment' }, // holiday

  // Item Kinds
  { name: 'Apparel', kind: 'item' },
  { name: 'Weapon', kind: 'item' },
  { name: 'Armor', kind: 'item' },
  { name: 'Accessory', kind: 'item' },
  { name: 'Ring', kind: 'item' },
  { name: 'Consumable', kind: 'item' },
  { name: 'Potion', kind: 'item' },
  { name: 'Food', kind: 'item' },
  { name: 'Key', kind: 'item' },
  { name: 'Trinket', kind: 'item' },

  // Skill Kinds
  { name: 'Aura', kind: 'skill' },
  { name: 'Buff', kind: 'skill' },
  { name: 'Curse', kind: 'skill' },
  { name: 'Perk', kind: 'skill' },
  { name: 'Trait', kind: 'skill' },

  // --- SECONDARY TAGS ---

  // Effect Elements (main)
  { name: 'Physical', kind: 'element' }, // corporeal, earth
  { name: 'Ethereal', kind: 'element' }, // soul, heart
  { name: 'Energy', kind: 'element' }, // heat, fire, lightning
  { name: 'Void', kind: 'element' }, // cold, ice, frost
  // Effect Elements (secondary)
  { name: 'Air', kind: 'element' },
  { name: 'Water', kind: 'element' },
  { name: 'Fire', kind: 'element' },
  { name: 'Ice', kind: 'element' },

  // // Mastery / Proficiency
  // { name: 'Element', kind: 'mastery' },
  // { name: 'Armor', kind: 'mastery' },
  // { name: 'Weapon', kind: 'mastery' },
  // { name: 'Zone', kind: 'mastery' },

  // Species
  { name: 'Human', kind: 'species' },
  { name: 'Slime', kind: 'species' },
  { name: 'Lamia', kind: 'species' },
  { name: 'Equin', kind: 'species' },
  { name: 'Harpy', kind: 'species' },

  // Skill Disciplines
  { name: 'Alteration', kind: 'discipline' },
  { name: 'Destruction', kind: 'discipline' },
  { name: 'Illusion', kind: 'discipline' },
  { name: 'Restoration', kind: 'discipline' },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type TagTemplateOmittedKeys =
  | 'id'
  | 'entityId' // tagId
  | 'dimensionId'
  | 'planeId';

type TagSeedInput = Omit<Tag, TagTemplateOmittedKeys>;

function createTemplateTag(seed: TagSeedInput): Tag | undefined {
  const entityId = toId(seed.name);
  const id = buildDimensionEntityCompositeId(
    entityId,
    DEFAULT_DIMENSION_ID,
    DEFAULT_PLANE_ID,
  );
  if (!id) return undefined;
  return {
    ...seed,
    id,
    entityId,
    dimensionId: DEFAULT_DIMENSION_ID,
    planeId: DEFAULT_PLANE_ID,
  };
}

// Map to final Tag[]
export const TAGS_SEED: Tag[] = TAGS_SEED_RAW.map(createTemplateTag).filter(
  (e): e is Tag => e !== undefined,
);
export const TAGS_CATALOG: Record<string, Tag> = TAGS_SEED.reduce(
  (acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  },
  {} as Record<string, Tag>,
);

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
TAGS_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate tag id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion

// Merges an TagInstance with its Tag catalog definition
export function mergeTagInstanceWithCatalog(
  instance: TagInstance,
): Tag | undefined {
  if (!instance.id) return undefined;
  const base: Tag = TAGS_CATALOG[instance.id];
  if (!base) return undefined;
  return { ...base, ...instance };
}
