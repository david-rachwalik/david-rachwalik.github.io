export interface Item {
  id: string;
  name: string;
  description: string;
  // effects: { attribute: string; delta: number }[];
  effects: Record<string, number>;
  tags: string[];
}
