// Primarily exists to easily find key game assets
export interface GameDimensionEntity {
  id: string;
  entityId: string;
  dimensionId: string; // game world/content universe
  planeId: string;
  authorId?: string;
}

// Applied to the more dynamic/mutable game assets
export interface GameAdventureEntity extends GameDimensionEntity {
  adventureId: string; // game save
  accountId: string;
}
