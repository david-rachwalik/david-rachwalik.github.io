import { Attribute, AttributeInstance } from '../models/attribute';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const ATTRIBUTES_SEED_RAW: AttributeSeedInput[] = [
  {
    name: 'Level',
    kind: 'core',
    abbreviation: 'Lvl',
    description: 'Advance to higher ranks to gain access to more skills.',
    valueType: 'number',
    default: 1,
  },
  {
    name: 'Health',
    kind: 'core',
    abbreviation: 'HP',
    description: 'Physical condition and overall state of being.',
    valueType: 'number',
    default: 100,
    max: 100,
  },
  {
    name: 'Strength',
    kind: 'stat',
    abbreviation: 'Str',
    description: 'Physical power and carrying capacity.',
    valueType: 'number',
    default: 5,
    min: 1,
  },
  {
    name: 'Agility',
    kind: 'stat',
    abbreviation: 'Agi',
    description: 'Speed and dexterity.',
    valueType: 'number',
    default: 5,
    min: 1,
  },
  {
    name: 'Intelligence',
    kind: 'stat',
    abbreviation: 'Int',
    description: 'Reasoning and memory.',
    valueType: 'number',
    default: 5,
    min: 1,
  },
  {
    name: 'Endurance',
    kind: 'stat',
    abbreviation: 'End',
    description: 'Stamina and health.',
    valueType: 'number',
    default: 5,
    min: 1,
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type AttributeTemplateOmittedKeys =
  | 'id'
  | 'entityId' // attributeId
  | 'dimensionId'
  | 'planeId'
  | 'base'
  | 'value';

type AttributeSeedInput = Omit<Attribute, AttributeTemplateOmittedKeys>;

function createTemplateAttribute(
  seed: AttributeSeedInput,
): Attribute | undefined {
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
    base: seed.default,
    value: seed.default, // override current value for instance
  };
}

// Map to final Attribute[]
export const ATTRIBUTES_SEED: Attribute[] = ATTRIBUTES_SEED_RAW.map(
  createTemplateAttribute,
).filter((e): e is Attribute => e !== undefined);
export const ATTRIBUTES_CATALOG: Record<string, Attribute> =
  ATTRIBUTES_SEED.reduce(
    (acc, attribute) => {
      acc[attribute.id] = attribute;
      return acc;
    },
    {} as Record<string, Attribute>,
  );

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
ATTRIBUTES_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate attribute id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion

// // Merges an Attribute with its Attribute catalog definition
// export function mergeAttributeInstanceWithCatalog(
//   instance: AttributeInstance,
// ): Attribute | undefined {
//   const base: Attribute = ATTRIBUTES_CATALOG[instance.attributeId];
//   if (!base) return undefined;
//   return { ...base, ...instance.params };
// }

// Merges an AttributeInstance with its Attribute catalog definition
export function mergeAttributeInstanceWithCatalog(
  instance: AttributeInstance,
): Attribute | undefined {
  if (!instance.id) return undefined;
  const base: Attribute = ATTRIBUTES_CATALOG[instance.id];
  if (!base) return undefined;
  // return { ...base, ...instance };

  // Only apply the mutable subset; ignore other catalog fields present in instance
  const merged: Attribute = { ...base };
  if ('value' in instance && instance.value !== undefined) {
    merged.value = instance.value;
  }
  if ('base' in instance && instance.base !== undefined) {
    merged.base = instance.base;
  }
  if ('min' in instance && instance.min !== undefined) {
    merged.min = instance.min;
  }
  if ('max' in instance && instance.max !== undefined) {
    merged.max = instance.max;
  }

  return merged;
}
