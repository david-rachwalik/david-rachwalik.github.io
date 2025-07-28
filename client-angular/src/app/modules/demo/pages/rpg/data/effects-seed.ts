import { Effect, EffectInstance } from '../models/effect';
import { toId } from '../utils';
import { DEFAULT_DIMENSION_ID } from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const EFFECTS_SEED_RAW: EffectSeedInput[] = [
  // --- Attribute Manipulation ---
  {
    // name: 'Damage Attribute',
    name: 'Damage',
    gerund: 'Damaging',
    pastTense: 'Damaged',
    description: 'Damages a named attribute of the target.',
    type: 'damage',
    kind: 'attribute',
    path: 'attributes.{attributeId}',
    operation: 'subtract', // negative value for damage
    defaultValue: 5,
    elements: ['physical'],
    tags: ['offense'],
  },
  {
    // name: 'Restore Attribute',
    name: 'Restore',
    gerund: 'Restoring',
    pastTense: 'Restored',
    description:
      'Restores an attribute up to its maximum value by repairing previous damage.',
    type: 'heal',
    kind: 'attribute',
    path: 'attributes.{attributeId}',
    operation: 'add',
    defaultValue: 5,
    elements: ['energy'],
  },
  {
    // name: 'Fortify Attribute',
    name: 'Enhance',
    gerund: 'Enhancing',
    pastTense: 'Enhanced',
    description: 'Temporarily increases an attribute.',
    type: 'buff',
    kind: 'attribute',
    path: 'attributes.{attributeId}',
    operation: 'add',
    defaultValue: 5,
    duration: 3,
  },
  {
    // name: 'Drain Attribute',
    name: 'Suppress',
    gerund: 'Suppressing',
    pastTense: 'Suppressed',
    description: 'Temporarily lowers an attribute.',
    type: 'debuff',
    kind: 'attribute',
    path: 'attributes.{attributeId}',
    operation: 'subtract',
    defaultValue: 5,
    duration: 3,
  },
  // "Drain" & "Absorb" should just be Skills with multiple Effects
  // {
  //   // name: 'Absorb Attribute',
  //   name: 'Absorb',
  //   gerund: 'Absorbing',
  //   pastTense: 'Absorbed',
  //   description: 'Transfers a portion of an attribute from target to self.',
  //   type: 'absorb',
  //   targets: [
  //     {
  //       kind: 'attribute',
  //       path: 'attributes.{attributeId}',
  //       operation: 'subtract',
  //       defaultValue: 5, // target loses
  //     },
  //     {
  //       kind: 'attribute',
  //       path: 'self.attributes.{attributeId}',
  //       operation: 'add',
  //       defaultValue: 5, // self gains
  //     },
  //   ],
  // },
  // "Stunted" should just be a Skill damaging the regen attribute
  // {
  //   // name: 'Stunted Attribute',
  //   name: 'Stunted',
  //   description: 'Prevents regeneration of an attribute.',
  //   type: 'debuff',
  //   kind: 'attribute',
  //   path: 'attributes.{attributeId}.regen',
  //   operation: 'set',
  //   defaultValue: 0,
  //   duration: 3,
  // },

  // ---  Weaknesses & Resistances & Shields ---
  {
    // name: 'Weakness to Element',
    name: 'Weak',
    gerund: 'Weaken',
    pastTense: 'Weakened',
    description: 'Decreases resistance to damage.',
    type: 'debuff',
    kind: 'attribute',
    path: 'resist.{element}',
    operation: 'multiply',
    defaultValue: 0.95,
    duration: 3,
  },
  {
    // name: 'Resist Element',
    name: 'Resist',
    gerund: 'Resisting',
    pastTense: 'Resisted',
    description: 'Increases resistance to damage.',
    type: 'buff',
    kind: 'attribute',
    path: 'resist.{element}',
    operation: 'multiply',
    defaultValue: 1.05,
    duration: 3,
    tags: ['defense'],
  },
  {
    name: 'Shield',
    description: 'Absorbs incoming damage.',
    type: 'buff',
    kind: 'attribute',
    path: 'attributes.shield',
    operation: 'add',
    defaultValue: 10,
    duration: 2,
    tags: ['defense'],
  },

  // --- Cure & Dispel ---
  {
    name: 'Cure',
    description: 'Cures target of an affliction.',
    type: 'heal',
    kind: 'state',
    path: 'status.{affliction}',
    operation: 'remove',
    defaultValue: true,
    tags: ['spell'],
  },
  {
    name: 'Dispel',
    description: 'Removes magical effects from the target.',
    type: 'dispel',
    kind: 'state',
    path: 'effects.{effectType}',
    operation: 'remove',
    defaultValue: true,
    tags: ['spell', 'magic'],
  },

  // --- Control & Status ---
  {
    name: 'Stun',
    gerund: 'Stunning',
    pastTense: 'Stunned',
    description: 'Disoriented and unable to perform certain actions.',
    type: 'debuff',
    kind: 'state',
    path: 'status.stunned',
    operation: 'set',
    defaultValue: true,
    duration: 2,
    tags: ['status', 'control'],
  },
  {
    name: 'Paralyze',
    gerund: 'Paralyzing',
    pastTense: 'Paralyzed',
    description: 'Completely incapacitated and unable to move or act.',
    type: 'debuff',
    kind: 'state',
    path: 'status.paralyzed',
    operation: 'set',
    defaultValue: true,
    duration: 2,
    tags: ['status', 'control'],
  },
  {
    name: 'Silence',
    description: 'Prevents spellcasting.',
    type: 'debuff',
    kind: 'state',
    path: 'status.silenced',
    operation: 'set',
    defaultValue: true,
    duration: 2,
    tags: ['status', 'control'],
  },
  {
    name: 'Poison',
    description: 'Applies poison, dealing damage over time.',
    type: 'debuff',
    kind: 'state',
    path: 'status.poisoned',
    operation: 'set',
    defaultValue: true,
    duration: 6,
    tags: ['status', 'control'],
  },
  {
    name: 'Blind',
    description: 'Reduces accuracy.',
    type: 'debuff',
    kind: 'state',
    path: 'status.blinded',
    operation: 'set',
    defaultValue: true,
    duration: 3,
    tags: ['status', 'control'],
  },

  // --- Summon & Conjure ---
  {
    name: 'Summon',
    description: 'Summons a helper creature.',
    type: 'summon',
    kind: 'state',
    path: 'summons',
    operation: 'add',
    defaultValue: '{creatureId}',
    duration: 5,
    tags: ['summon', 'conjuration'],
  },
  {
    name: 'Conjure Item',
    description: 'Conjures an item.',
    type: 'conjure',
    kind: 'character',
    path: 'inventory',
    operation: 'add',
    defaultValue: '{itemId}',
    tags: ['conjure', 'item'],
  },

  // --- Gravity & Movement ---
  {
    name: 'Gravity',
    description: 'Amplifies gravity, making movement difficult.',
    type: 'debuff',
    kind: 'attribute',
    path: 'attributes.agi',
    operation: 'subtract',
    defaultValue: 5,
    duration: 3,
  },
  {
    name: 'Feather',
    description: 'Decreases gravity, making movement easier.',
    type: 'buff',
    kind: 'attribute',
    path: 'attributes.agi',
    operation: 'add',
    defaultValue: 5,
    duration: 3,
  },

  // --- Water Effects ---
  {
    name: 'Water Breathing',
    description: 'Allows the target to breathe underwater.',
    type: 'buff',
    kind: 'state',
    path: 'status.waterBreathing',
    operation: 'set',
    defaultValue: true,
    duration: 5,
  },
  {
    name: 'Water Walking',
    description: 'Allows the target to walk on water.',
    type: 'buff',
    kind: 'state',
    path: 'status.waterWalking',
    operation: 'set',
    defaultValue: true,
    duration: 5,
  },

  // --- Mind & Social Effects ---
  {
    name: 'Calm',
    description: "Decreases target's aggression.",
    type: 'debuff',
    kind: 'attribute',
    path: 'attributes.aggression',
    operation: 'subtract',
    defaultValue: 10,
    duration: 3,
    tags: ['mind'],
  },
  {
    name: 'Frenzy',
    description: "Increases target's aggression.",
    type: 'buff',
    kind: 'attribute',
    path: 'attributes.aggression',
    operation: 'add',
    defaultValue: 10,
    duration: 3,
    tags: ['mind'],
  },
  {
    name: 'Demoralize',
    description: "Decreases target's confidence.",
    type: 'debuff',
    kind: 'attribute',
    path: 'attributes.confidence',
    operation: 'subtract',
    defaultValue: 10,
    duration: 3,
    tags: ['mind'],
  },
  {
    name: 'Rally',
    description: "Increases target's confidence.",
    type: 'buff',
    kind: 'attribute',
    path: 'attributes.confidence',
    operation: 'add',
    defaultValue: 10,
    duration: 3,
    tags: ['mind'],
  },
  {
    name: 'Chameleon',
    description: 'Blend into surroundings, harder to detect.',
    type: 'buff',
    kind: 'state',
    path: 'status.chameleon',
    operation: 'set',
    defaultValue: true,
    duration: 3,
    tags: ['stealth'],
  },
  {
    name: 'Charm',
    description: 'Reduces enemy hostility (boosts disposition).',
    type: 'buff',
    kind: 'attribute',
    path: 'attributes.disposition',
    operation: 'add',
    defaultValue: 10,
    duration: 8,
    tags: ['social'],
  },

  // --- Light & Vision ---
  {
    name: 'Light',
    description: 'Illuminates the target.',
    type: 'buff',
    kind: 'state',
    path: 'status.light',
    operation: 'set',
    defaultValue: true,
    duration: 5,
    tags: ['vision', 'light'],
  },
  {
    name: 'Night-Eye',
    description: 'Allows to see in the dark.',
    type: 'buff',
    kind: 'state',
    path: 'status.nightEye',
    operation: 'set',
    defaultValue: true,
    duration: 5,
    tags: ['vision', 'night-eye'],
  },

  // --- Detection & Reflection ---
  {
    name: 'Detect Life',
    description: 'See living things through obstacles.',
    type: 'buff',
    kind: 'state',
    path: 'status.detectLife',
    operation: 'set',
    defaultValue: true,
    duration: 5,
    tags: ['detect', 'life'],
  },
  {
    name: 'Reflect Damage',
    description: 'Reflects weapon damage back at attacker.',
    type: 'buff',
    kind: 'state',
    path: 'status.reflectDamage',
    operation: 'set',
    defaultValue: true,
    duration: 3,
    tags: ['defense', 'reflect'],
  },
  {
    name: 'Reflect Spell',
    description: 'Reflects spell effects back at caster.',
    type: 'buff',
    kind: 'state',
    path: 'status.reflectSpell',
    operation: 'set',
    defaultValue: true,
    duration: 3,
    tags: ['defense', 'reflect', 'spell'],
  },

  // --- Soul & Absorption ---
  {
    name: 'Soul Trap',
    description: "Traps target's soul.",
    type: 'debuff',
    kind: 'state',
    path: 'status.soulTrapped',
    operation: 'set',
    defaultValue: true,
    duration: 3,
    tags: ['soul', 'trap'],
  },
  {
    name: 'Spell Absorption',
    description: 'Turns incoming spell power into magicka.',
    type: 'buff',
    kind: 'state',
    path: 'status.spellAbsorption',
    operation: 'set',
    defaultValue: true,
    duration: 3,
    tags: ['spell', 'absorption'],
  },

  // --- Telekinesis ---
  {
    name: 'Telekinesis',
    description: 'Pick up items from a distance.',
    type: 'buff',
    kind: 'state',
    path: 'status.telekinesis',
    operation: 'set',
    defaultValue: true,
    duration: 3,
  },

  // --- Disease, Poison, Paralysis Resistances ---
  {
    name: 'Resist Disease',
    description: 'Increase resistance to disease.',
    type: 'buff',
    kind: 'attribute',
    path: 'resist.disease',
    operation: 'add',
    defaultValue: 25,
    duration: 3,
    tags: ['defense', 'resist'],
  },
  {
    name: 'Resist Paralysis',
    description: 'Increase resistance to paralysis.',
    type: 'buff',
    kind: 'attribute',
    path: 'resist.paralysis',
    operation: 'add',
    defaultValue: 25,
    duration: 3,
    tags: ['defense', 'resist'],
  },
  {
    name: 'Resist Poison',
    description: 'Increase resistance to poison.',
    type: 'buff',
    kind: 'attribute',
    path: 'resist.poison',
    operation: 'add',
    defaultValue: 25,
    duration: 3,
    tags: ['defense', 'resist'],
  },
  {
    name: 'Resist Shock',
    description: 'Increase resistance to shock.',
    type: 'buff',
    kind: 'attribute',
    path: 'resist.shock',
    operation: 'add',
    defaultValue: 25,
    duration: 3,
    tags: ['defense', 'resist'],
  },

  // --- Alteration ---
  {
    name: 'Transform',
    description: 'Causes a transformation (body or mind).',
    type: 'transform',
    kind: 'character',
    path: '{state}',
    operation: 'set',
    defaultValue: true,
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type EffectSeedInput = Omit<Effect, 'id' | 'dimensionId'>;

function createTemplateEffect(seed: EffectSeedInput): Effect {
  const nameId = toId(seed.name);
  return { ...seed, id: nameId, dimensionId: DEFAULT_DIMENSION_ID };
}

// Map to final Effect[]
export const EFFECTS_SEED: Effect[] = EFFECTS_SEED_RAW.map(
  createTemplateEffect,
).filter((e): e is Effect => e !== undefined);
export const EFFECTS_CATALOG: Record<string, Effect> = EFFECTS_SEED.reduce(
  (acc, effect) => {
    acc[effect.id] = effect;
    return acc;
  },
  {} as Record<string, Effect>,
);

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
EFFECTS_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate effect id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion

// Merges an EffectInstance with its Effect catalog definition
export function mergeEffectInstanceWithCatalog(
  instance: EffectInstance,
): Effect | undefined {
  const base = EFFECTS_CATALOG[instance.effectId];
  if (!base) return undefined;
  return { ...base, ...instance.params };
}

// // Example usage in a skill or item
// const punchSkill = {
//   id: 'punch',
//   name: 'Punch',
//   effects: [
//     { type: 'damage', params: { value: 5, element: 'physical' } },
//   ],
// };

// const fireballSkill = {
//   id: 'fireball',
//   name: 'Fireball',
//   effects: [
//     { type: 'damage', params: { value: 12, element: 'fire', aoe: true } },
//     { type: 'burn', params: { duration: 2 } },
//   ],
// };
