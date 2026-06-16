import { Attribute } from '../../../models/attribute';
import { buildTemplateEntity, SeedInput } from '../../utils-seed';

type AttributeRawInput = Omit<SeedInput<Attribute>, 'base' | 'value'> & {
  default: number;
};

// #region 🔸 DATA SEED RAW 🔸

const RPG_DEMO_ATTRIBUTES_RAW: AttributeRawInput[] = [
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

export const RPG_DEMO_ATTRIBUTES: Attribute[] = RPG_DEMO_ATTRIBUTES_RAW.map(
  (raw) => {
    // Expand 'default' into the strictly required generic fields
    const seed: SeedInput<Attribute> = {
      ...raw,
      base: raw.default,
      value: raw.default,
    };

    return buildTemplateEntity<Attribute>(seed, raw.name);
  },
).filter((e): e is Attribute => e !== undefined);
// #endregion
