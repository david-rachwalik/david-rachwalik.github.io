import { GameAdventureEntity } from '../utils-composite-id';

// TODO: roll anything useful into `AdventureEvent`

// export interface BaseGameEvent extends GameAdventureEntity {
//   timestamp: string; // ISO string
//   // type: string;
// }

// // Uses a discriminated union with `type` & `payload` for each event type
// export type GameEvent =
//   | (BaseGameEvent & {
//       type: 'moment-completed';
//       payload: { momentId: string; outcome: string };
//     })
//   | (BaseGameEvent & {
//       type: 'choice-made';
//       payload: { choiceId: string; momentId: string; result: string };
//     })
//   | (BaseGameEvent & {
//       type: 'item-used';
//       payload: { itemId: string; targetId?: string };
//     });

// ----------------------------------------------------------------
// ----------------------------------------------------------------

export type GameEventTypes = 'moment-completed' | 'item-used';

export interface GameEvent extends GameAdventureEntity {
  timestamp: string; // ISO string
  type: GameEventTypes;
  // message: string;
  // data?: Record<string, unknown>;
  entityId: string; // momentId, itemId..
  choiceId: string; // Moment action, Item target..
  result: string;
}
