import { GameDimensionEntity } from '../utils-composite-id';
import { AttributeInstance } from './attribute';
import { EffectInstance } from './effect';

export interface Item extends GameDimensionEntity {
  name: string;
  description: string;
  tags: string[];
  attributes: AttributeInstance[];
  effects: EffectInstance[];
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
