export type AttributeValue = boolean | number | string;

export type AttributeType = 'stat' | 'skill' | 'trait';
export type AttributeValueType = 'boolean' | 'number' | 'text';

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

export interface AttributeViewModel {
  id: string;
  name: string;
  value: number;
  max?: number;
  description?: string;
}
