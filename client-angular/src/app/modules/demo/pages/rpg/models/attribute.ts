export type AttributeType = 'stat' | 'skill' | 'trait';
export type AttributeValueType = 'text' | 'number';

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
  description: string;
  value?: number;
  valueType: AttributeValueType;
  defaultValue: string | number;
  min?: number;
  max?: number;
  tags: string[]; // Tags that influence this attribute
}
