export interface Persona {
  id: string;
  name: string;
  baseAttributes: Record<string, number>; // e.g., { strength: 5, intelligence: 3 }
  tags: string[];
}
