export type AttributeType = 'stat' | 'skill' | 'trait';

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
  valueType: string | number;
  min?: number;
  max?: number;
  tags: string[]; // Tags that influence this attribute
}
