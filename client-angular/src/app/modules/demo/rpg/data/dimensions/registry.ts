import { ExpansionPack } from '../../models/game-pack';

import { rpgDemoDimension } from './rpg-demo/rpg-demo-pack';
// TODO: eventually remove CoC module after testing is complete
import { cocDimension } from './coc/coc-pack';

export const EXPANSION_PACKS: ExpansionPack[] = [
  rpgDemoDimension,
  cocDimension,
];
