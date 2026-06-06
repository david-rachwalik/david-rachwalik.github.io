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
  {
    name: 'RPG Demo',
    kind: 'dimension',
    description: 'The core template demo environment/universe.',
  },
  { name: 'CoC', kind: 'dimension' },
  { name: 'Nimin', kind: 'dimension' },

  // --- PRIMARY TAGS ---

  // Attribute Groups
  {
    name: 'Core',
    kind: 'attribute',
    description: 'Fundamental statistics like Strength or Agility.',
  },
  {
    name: 'Defense',
    kind: 'attribute',
    description: 'Damage mitigation and resistances.',
  },
  {
    name: 'Offense',
    kind: 'attribute',
    description: 'Damage boosting and armor penetration.',
  },
  {
    name: 'Utility',
    kind: 'attribute',
    description: 'Non-combat or indirect statistics.',
  },

  // // Effect Kinds
  // { name: 'Damage', category: 'effect' },
  // { name: 'Healing', category: 'effect' },

  // Status Effects (mechanical → often also an Effect)
  {
    name: 'Poisoned',
    kind: 'statusEffect',
    description: 'Takes damage over time.',
  },
  {
    name: 'Confused',
    kind: 'statusEffect',
    description: 'May attack randomly or hurt themselves.',
  },
  {
    name: 'Silenced',
    kind: 'statusEffect',
    description: 'Cannot use magical or vocal skills.',
  },
  {
    name: 'Asleep',
    kind: 'statusEffect',
    description: 'Cannot act until awakened or damaged.',
  },
  {
    name: 'Petrified',
    kind: 'statusEffect',
    description: 'Turned to stone; entirely immobilized.',
  },

  // Character Kinds
  {
    name: 'Player',
    kind: 'character',
    description: 'The main user-controlled protagonist.',
  },
  { name: 'Enemy', kind: 'character', description: 'Hostile combatants.' },
  {
    name: 'Companion',
    kind: 'character',
    description: 'Primary party members.',
  },
  {
    name: 'Follower',
    kind: 'character',
    description: 'Secondary or temporary allies.',
  },
  {
    name: 'Persistent',
    kind: 'character',
    description: 'NPCs whose state is permanently saved between encounters.',
  },
  {
    name: 'Ephemeral',
    kind: 'character',
    description:
      'Temporary entity; garbage collected when the player leaves the Moment.',
  },

  // Location Kinds
  {
    name: 'Intro',
    kind: 'location',
    description: 'Starting zones or tutorials.',
  },
  {
    name: 'Safe Zone',
    kind: 'location',
    description: 'Areas where combat cannot occur.',
  },
  {
    name: 'Contested Zone', // Forest, Lake, Mountain, Desert
    kind: 'location',
    description: 'Areas with active hostilities.',
  },
  {
    name: 'Secluded',
    kind: 'location',
    description: 'Hidden or hard-to-reach areas.',
  },
  { name: 'Camp', kind: 'location', description: 'Temporary resting spots.' },
  {
    name: 'Town',
    kind: 'location',
    description: 'Social hubs with vendors and quests.',
  },
  {
    name: 'Dungeon',
    kind: 'location',
    description: 'Hostile instances with bosses and loot.',
  },

  // Moment / Event / Encounter Context
  {
    name: 'New Game',
    kind: 'moment',
    description: 'The initialization of a new save file.',
  },
  {
    name: 'Combat',
    kind: 'moment',
    description: 'A hostile encounter requiring violent resolution.',
  },
  {
    name: 'Vendor',
    kind: 'moment',
    description: 'A peaceful trading encounter.',
  },
  {
    name: 'Seasonal',
    kind: 'moment',
    description: 'Time-limited or holiday-specific events.',
  },

  // Item Kinds
  { name: 'Apparel', kind: 'item', description: 'Clothing or cosmetic gear.' },
  { name: 'Weapon', kind: 'item', description: 'Offensive armaments.' },
  { name: 'Armor', kind: 'item', description: 'Defensive gear.' },
  {
    name: 'Accessory',
    kind: 'item',
    description: 'Supplemental stat-boosting gear.',
  },
  { name: 'Ring', kind: 'item', description: 'Magical finger bands.' },
  {
    name: 'Consumable',
    kind: 'item',
    description: 'Items destroyed upon use.',
  },
  { name: 'Potion', kind: 'item', description: 'Drinkable elixirs.' },
  { name: 'Food', kind: 'item', description: 'Edible provisions.' },
  { name: 'Key', kind: 'item', description: 'Tools for unlocking pathways.' },
  {
    name: 'Trinket',
    kind: 'item',
    description: 'Valuable or lore-relevant miscellany.',
  },

  // Skill Kinds
  {
    name: 'Aura',
    kind: 'skill',
    description: 'Passive effects radiating to nearby targets.',
  },
  {
    name: 'Buff',
    kind: 'skill',
    description: 'Beneficial enhancements applied to allies.',
  },
  {
    name: 'Curse',
    kind: 'skill',
    description: 'Detrimental ailments applied to enemies.',
  },
  { name: 'Perk', kind: 'skill', description: 'Acquired passive advantages.' },
  {
    name: 'Trait',
    kind: 'skill',
    description: 'Innate passive characteristics.',
  },

  // --- SECONDARY TAGS ---

  // Effect Elements (main)
  {
    name: 'Physical',
    kind: 'element',
    description:
      'Corporeal or Earthen force; bludgeoning, piercing, & slashing.',
  },
  {
    name: 'Ethereal',
    kind: 'element',
    description: 'Spiritual, mental, or soul-based energy.',
  },
  {
    name: 'Energy',
    kind: 'element',
    description: 'Heat, fire, or lightning.',
  },
  { name: 'Void', kind: 'element', description: 'Cold, ice, or emptiness.' },

  // Effect Elements (secondary)
  {
    name: 'Air',
    kind: 'element',
    description: 'Wind and atmospheric manipulation.',
  },
  { name: 'Water', kind: 'element', description: 'Fluid and tidal forces.' },
  { name: 'Fire', kind: 'element', description: 'Combustion and heat.' },
  { name: 'Ice', kind: 'element', description: 'Frost and freezing.' },

  // // Mastery / Proficiency
  // { name: 'Element', kind: 'mastery' },
  // { name: 'Armor', kind: 'mastery' },
  // { name: 'Weapon', kind: 'mastery' },
  // { name: 'Zone', kind: 'mastery' },

  // Species
  { name: 'Human', kind: 'species', description: 'Standard bipedal hominids.' },
  {
    name: 'Slime',
    kind: 'species',
    description: 'Amorphous gelatinous entities.',
  },
  {
    name: 'Lamia',
    kind: 'species',
    description: 'Half-human, half-serpentine entities.',
  },
  {
    name: 'Equin',
    kind: 'species',
    description: 'Equine or centaur-like beings.',
  },
  { name: 'Harpy', kind: 'species', description: 'Avian-humanoid hybrids.' },

  // Skill Disciplines
  {
    name: 'Alteration',
    kind: 'discipline',
    description: 'Manipulation of physical properties.',
  },
  {
    name: 'Destruction',
    kind: 'discipline',
    description: 'Magic focused on causing harm.',
  },
  {
    name: 'Illusion',
    kind: 'discipline',
    description: 'Deception of the senses.',
  },
  {
    name: 'Restoration',
    kind: 'discipline',
    description: 'Healing and curative magic.',
  },
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

export function getTagInstanceFromCatalog(id: string): Tag | undefined {
  if (!id) return undefined;
  return TAGS_CATALOG[id] ?? undefined;
}

// Merges an TagInstance with its Tag catalog definition
export function mergeTagInstanceWithCatalog(
  instance: TagInstance,
): Tag | undefined {
  if (!instance.id) return undefined;
  const base: Tag = TAGS_CATALOG[instance.id];
  if (!base) return undefined;
  return { ...base, ...instance };
}
