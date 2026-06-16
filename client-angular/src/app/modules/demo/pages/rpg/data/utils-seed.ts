// import { Attribute } from '../models/attribute';
// import { Effect } from '../models/effect';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// Universal System Keys (omitted from all seeds)
export type SystemOmittedKeys =
  | 'id'
  | 'entityId'
  | 'dimensionId'
  | 'planeId'
  | 'adventureId'
  | 'accountId';

// Runtime representation of system keys for diffing
export const SYSTEM_OMITTED_KEYS_ARRAY = [
  'id',
  'entityId',
  'dimensionId',
  'planeId',
  'adventureId',
  'accountId',
] as const;

// Base Generic Input that strips system keys from the model
export type SeedInput<T> = Omit<T, SystemOmittedKeys>;

// // Feature-Specific Inputs (protecting runtime-only properties)
// export type AttributeSeedInput = Omit<
//   Attribute,
//   SystemOmittedKeys | 'base' | 'value'
// >;
// export type EffectSeedInput = Omit<Effect, SystemOmittedKeys | 'current'>;

/**
 * 🔸 Universal Template Builder 🔸
 * Takes any raw data seed, generates strict system IDs, and returns a fully hydrated entity.
 *
 * @param seed The raw data object, exluding system keys
 * @param entityIdBase The string used to generate the ID (e.g. entity's name or title)
 * @param dimensionId The dimension this template belongs to
 * @param planeId The plane this template belongs to
 */
export function buildTemplateEntity<T>(
  seed: SeedInput<T>,
  entityIdBase: string,
  dimensionId: string = DEFAULT_DIMENSION_ID,
  planeId: string = DEFAULT_PLANE_ID,
): T | undefined {
  // Convert chosen property (like "Rusty Sword") into a safe string ("rusty-sword")
  const entityId = toId(entityIdBase);

  // Construct absolute database primary key
  const id = buildDimensionEntityCompositeId(entityId, dimensionId, planeId);
  if (!id) return undefined;

  // Merge system IDs into raw seed and cast it safely to the generic type
  return {
    ...seed,
    id,
    entityId,
    dimensionId,
    planeId,
  } as unknown as T;
}

// Generic Validator for Duplicate IDs
export function validateSeedDuplicateIds<T extends { id: string }>(
  seedArray: T[],
  featureName: string,
): void {
  const ids = new Set<string>();
  seedArray.forEach((e) => {
    if (ids.has(e.id)) {
      throw new Error(
        `[Seed Validation] Duplicate ID found in ${featureName}: ${e.id}`,
      );
    }
    ids.add(e.id);
  });
}

// Builds a generic catalog by converting array of entities into dictionary keyed by ID
export function buildCatalog<T extends { id: string }>(
  seedArray: T[],
): Record<string, T> {
  return seedArray.reduce(
    (acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    },
    {} as Record<string, T>,
  );
}

// Generic fetch for catalog definition (Model)
export function getEntityFromCatalog<T>(
  catalog: Record<string, T>,
  id?: string,
): T | undefined {
  if (!id) return undefined;
  return catalog[id];
}

// Generic merger between Instance & its catalog definition (Model)
export function mergeInstanceWithCatalog<
  T extends { id: string },
  U extends { id?: string },
>(catalog: Record<string, T>, instance: U): T | undefined {
  if (!instance.id) return undefined;
  const base = catalog[instance.id];
  if (!base) return undefined;
  return { ...base, ...instance };
}

// 🔸 Generic Instance Extractor
// Compares a full runtime object against a base template, removes omitted keys,
// and returns only the changed properties while guaranteeing physical ID tracking
export function extractSaveInstance<T extends { id: string; entityId: string }>(
  full: T,
  base: Partial<T>,
  omit: readonly (keyof T | string)[] = [],
): Partial<T> & { id: string; entityId: string } {
  const out: Partial<T> = {};
  const keys = new Set<keyof T>([
    ...(Object.keys(full) as (keyof T)[]),
    ...(Object.keys(base) as (keyof T)[]),
  ]);

  // Always omit system identifiers from the generic diff crawl
  const skipSet = new Set<string>([
    ...SYSTEM_OMITTED_KEYS_ARRAY,
    ...(omit as string[]),
  ]);

  for (const key of keys) {
    if (skipSet.has(key as string)) continue;
    const fv = full[key];
    const bv = base[key];
    if (fv !== undefined && !Object.is(fv, bv)) {
      out[key] = fv;
    }
  }

  // Guarantee the identity keys are preserved on the outgoing save block
  return {
    ...out,
    id: full.id,
    entityId: full.entityId,
  };
}

// Merges static base arrays with local IndexedDB overrides
export function mergeHybridData<T extends { id: string }>(
  staticAssets: T[],
  dbOverrides: T[],
): T[] {
  // Build a catalog dictionary from IDB overrides
  const dbCatalog = buildCatalog(dbOverrides);
  // Replace base items with DB overrides if they exist
  const mergedBase = staticAssets.map((base) => dbCatalog[base.id] || base);
  // Append new custom items that didn't exist in the base list
  const baseIds = new Set(staticAssets.map((b) => b.id));
  const newCustoms = dbOverrides.filter((dbItem) => !baseIds.has(dbItem.id));

  return [...mergedBase, ...newCustoms];
}
