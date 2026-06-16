import { EXPANSION_PACKS } from './dimensions/registry';
import { buildCatalog, validateSeedDuplicateIds } from './utils-seed';

// --- Flatten Dimension Packs by Feature ---
export const ALL_ATTRIBUTES = EXPANSION_PACKS.flatMap(
  (p) => p.attributes ?? [],
);
export const ALL_TAGS = EXPANSION_PACKS.flatMap((p) => p.tags ?? []);
export const ALL_EFFECTS = EXPANSION_PACKS.flatMap((p) => p.effects ?? []);
export const ALL_CHARACTERS = EXPANSION_PACKS.flatMap(
  (p) => p.characters ?? [],
);
export const ALL_LOCATIONS = EXPANSION_PACKS.flatMap((p) => p.locations ?? []);
export const ALL_MOMENTS = EXPANSION_PACKS.flatMap((p) => p.moments ?? []);
export const ALL_ITEMS = EXPANSION_PACKS.flatMap((p) => p.items ?? []);
export const ALL_SKILLS = EXPANSION_PACKS.flatMap((p) => p.skills ?? []);

// --- Validate All Data ---
validateSeedDuplicateIds(ALL_ATTRIBUTES, 'Attributes');
validateSeedDuplicateIds(ALL_TAGS, 'Tags');
validateSeedDuplicateIds(ALL_EFFECTS, 'Effects');
validateSeedDuplicateIds(ALL_CHARACTERS, 'Characters');
validateSeedDuplicateIds(ALL_LOCATIONS, 'Locations');
validateSeedDuplicateIds(ALL_MOMENTS, 'Moments');
validateSeedDuplicateIds(ALL_ITEMS, 'Items');
validateSeedDuplicateIds(ALL_SKILLS, 'Skills');

// --- Build Catalogs/Dictionaries of Full Models ---
export const ATTRIBUTES_CATALOG = buildCatalog(ALL_ATTRIBUTES);
export const TAGS_CATALOG = buildCatalog(ALL_TAGS);
export const EFFECTS_CATALOG = buildCatalog(ALL_EFFECTS);
export const CHARACTERS_CATALOG = buildCatalog(ALL_CHARACTERS);
export const LOCATIONS_CATALOG = buildCatalog(ALL_LOCATIONS);
export const MOMENTS_CATALOG = buildCatalog(ALL_MOMENTS);
export const ITEMS_CATALOG = buildCatalog(ALL_ITEMS);
export const SKILLS_CATALOG = buildCatalog(ALL_SKILLS);
