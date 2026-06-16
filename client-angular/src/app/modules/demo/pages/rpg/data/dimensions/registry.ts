import { ExpansionPack } from '../../models/game-pack';

import { rpgDemoDimension } from './rpg-demo/rpg-demo-pack';
// 🔸 Import private CoC module here locally but do not push it!
import { cocDimension } from './coc/coc-pack';

// export const EXPANSION_PACKS: ExpansionPack[] = [];
export const EXPANSION_PACKS: ExpansionPack[] = [
  rpgDemoDimension,
  cocDimension,
];
