import { GameDimensionEntity } from '../utils-composite-id';
import { AttributeValue } from './attribute';
import { EffectInstance } from './effect';

export interface Item extends GameDimensionEntity {
  name: string;
  description: string;
  tags: string[];
  attributes?: Record<string, AttributeValue>;
  // effects: { attribute: string; delta: number }[];
  // effects: Record<string, number>;
  effects: EffectInstance[]; // Each is an Effect + per-use params
}

export interface InventorySlot {
  item: Item;
  qty: number;
}

export interface InventorySlotViewModel {
  id: string;
  name: string;
  description: string;
  qty: number;
  item?: Item;
}
