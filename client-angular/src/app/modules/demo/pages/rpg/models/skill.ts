export interface Skill {
  id: string;
  name: string;
  description: string;
  execute(characterId: string, targetId?: string): string;
}
