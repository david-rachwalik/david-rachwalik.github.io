import { Location } from '../models/location';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const LOCATIONS_SEED_RAW: LocationSeedInput[] = [
  {
    name: 'Village Square',
    description: 'A peaceful central hub with friendly townsfolk.',
    tags: ['safe-zone', 'town'],
  },
  {
    name: 'Peaceful Village',
    description: 'A quiet town at the edge of the forest.',
    tags: ['safe-zone', 'town'],
  },
  {
    name: 'Practice Zone',
    description: 'Time to cut loose on some target dummies!',
    tags: ['safe-zone', 'combat'], // cannot die
  },
  {
    name: 'Dark Cave',
    description: 'You sense danger within.',
    tags: ['dungeon'],
  },
  {
    name: 'Goblin Ambush!',
    description: 'Several goblins have sprung out, blades drawn.',
    tags: ['combat'],
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type LocationTemplateOmittedKeys =
  | 'id'
  | 'entityId' // locationId
  | 'dimensionId'
  | 'planeId';

type LocationSeedInput = Omit<Location, LocationTemplateOmittedKeys>;

function createTemplateLocation(seed: LocationSeedInput): Location | undefined {
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

// Map to final Location[]
export const LOCATIONS_SEED: Location[] = LOCATIONS_SEED_RAW.map(
  createTemplateLocation,
).filter((e): e is Location => e !== undefined);

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
LOCATIONS_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate location id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion
