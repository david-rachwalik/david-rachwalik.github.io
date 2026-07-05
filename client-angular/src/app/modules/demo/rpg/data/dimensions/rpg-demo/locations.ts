import { Location } from '../../../models/location';
import { buildTemplateEntity, SeedInput } from '../../utils-seed';

// #region 🔸 DATA SEED RAW 🔸

const RPG_DEMO_LOCATIONS_RAW: SeedInput<Location>[] = [
  {
    name: 'Village Square',
    description: 'A peaceful central hub with friendly townsfolk.',
    tags: ['safe-zone', 'town'],
    effects: [],
  },
  {
    name: 'Peaceful Village',
    description: 'A quiet town at the edge of the forest.',
    tags: ['safe-zone', 'town'],
    effects: [],
  },
  {
    name: 'Practice Zone',
    description: 'Time to cut loose on some target dummies!',
    tags: ['safe-zone', 'combat'], // cannot die
    effects: [],
  },
  {
    name: 'Dark Cave',
    description: 'You sense danger within.',
    tags: ['dungeon'],
    effects: [],
  },
  {
    name: 'Goblin Ambush!',
    description: 'Several goblins have sprung out, blades drawn.',
    tags: ['combat'],
    effects: [],
  },
];
// #endregion

// #region 🔸 BUILD SEED DATA 🔸

export const RPG_DEMO_LOCATIONS: Location[] = RPG_DEMO_LOCATIONS_RAW.map(
  (seed) => buildTemplateEntity<Location>(seed, seed.name),
).filter((e): e is Location => e !== undefined);
// #endregion
