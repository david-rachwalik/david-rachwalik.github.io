import { Tag } from '../../../models/tag';
import { DEFAULT_PLANE_ID } from '../../../utils-composite-id';
import { buildTemplateEntity, SeedInput } from '../../utils-seed';
import { COC_DIMENSION_ID } from './dimension-id';

// #region 🔸 DATA SEED RAW 🔸

const COC_TAGS_RAW: SeedInput<Tag>[] = [
  // Dimension
  { name: 'CoC', kind: 'dimension' },

  // // Attributes / Traits (Formerly "Condition Tags")
  // { name: 'Demon', kind: 'trait' },
  // { name: 'Ghost', kind: 'trait' },
  // { name: 'Mummy', kind: 'trait' },
  // { name: 'Flying', kind: 'trait' },
  // { name: 'Invisible', kind: 'trait' },
  // { name: 'Alien', kind: 'trait' },

  // Location Tags
  { name: 'Explored', kind: 'location' },

  // Species
  { name: 'Human', kind: 'species' },
  { name: 'Slime', kind: 'species', description: 'Goo' },
  { name: 'Lamia', kind: 'species' },
  { name: 'Harpy', kind: 'species' },
  { name: 'Centaur', kind: 'species' },
  { name: 'Lagomorph', kind: 'species', description: 'Bunny Rabbit' },
  { name: 'Dragon', kind: 'species' },
  { name: 'Fox', kind: 'species' },
  { name: 'Wolf', kind: 'species', description: 'Dog' },
  { name: 'Cat', kind: 'species' },
  { name: 'Horse', kind: 'species', description: 'Pony' },
  { name: 'Raccoon', kind: 'species' },
  { name: 'Lizard', kind: 'species' },
  { name: 'Bee', kind: 'species' },
  { name: 'Goblin', kind: 'species' },
  { name: 'Shark', kind: 'species' },
  { name: 'Spider', kind: 'species' },
  { name: 'Kangaroo', kind: 'species' },
  { name: 'Mouse', kind: 'species' },
  { name: 'Cow', kind: 'species' },
  { name: 'Minotaur', kind: 'species' },
  {
    name: 'Lunar Elf',
    kind: 'species',
    description:
      'Has a natural affinity for the void. Very curvatious with long, pointed back ears.',
  },
  {
    name: 'Solar Elf',
    kind: 'species',
    description:
      'Has a natural affinity for the light. Delightfully lithe and perky with long, pointed up ears.',
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

// 1. Map over raw seeds
// 2. Pass the seed, the base name property, and the Dimension/Plane
// 3. Filter out any failures to guarantee strict Tag array
export const COC_TAGS: Tag[] = COC_TAGS_RAW.map((seed) =>
  buildTemplateEntity<Tag>(seed, seed.name, COC_DIMENSION_ID, DEFAULT_PLANE_ID),
).filter((e): e is Tag => e !== undefined);
// #endregion
