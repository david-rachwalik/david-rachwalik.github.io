export interface Item {
  id: string;
  name: string;
  description: string;
  // effects: { attribute: string; delta: number }[];
  effects: Record<string, number>;
  tags: string[];
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
