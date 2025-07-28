import { toId } from './utils';

// --- Global ID defaults ---
export const DEFAULT_DIMENSION_ID = 'rpg-demo'; // game name
// Default plane of existence (main, origin)
export const DEFAULT_PLANE_ID = 'prime'; // corporeal/material
export const DEFAULT_ADVENTURE_ID = 'template';
export const DEFAULT_ACCOUNT_ID = 'system';

// http://www.marvunapp.com/ohotmu/appendixes/omnapp.htm
// http://www.marvunapp.com/ohotmu/appendixes/mdapp.htm

// * Adventure applies to:  Character, AdventureEvent
// * Dimension does not apply to:  Adventure

// Naming Alternatives:
// Adventure:  Continuity, Saga, Chronicle, Campaign, Journey, Legacy, Odyssey
// Dimension:  Universe, Realm, World, Plane, Domain, Verse, Continuum, Shard

// Mostly just exists to easily find certain game assets
export interface GameDimensionEntity {
  id: string;
  entityId: string;
  dimensionId: string; // game world/content universe
  planeId: string;
  authorId?: string;
}
// Applied to dynamic/mutable assets
export interface GameAdventureEntity extends GameDimensionEntity {
  adventureId: string; // game save
  accountId: string;
}

// entityId:dimensionId:planeId
export function buildDimensionEntityCompositeId(
  entityId?: string,
  dimensionId?: string,
  planeId?: string,
): string | undefined {
  if (!entityId || !dimensionId || !planeId) return undefined;
  return [toId(entityId), toId(dimensionId), toId(planeId)].join(':');
}

// entityId:dimensionId:planeId:adventureId:accountId
export function buildAdventureEntityCompositeId(
  entityId?: string,
  dimensionId?: string,
  planeId?: string,
  adventureId?: string,
  accountId?: string,
): string | undefined {
  if (!entityId || !dimensionId || !planeId || !adventureId || !accountId)
    return undefined;
  return [
    toId(entityId),
    toId(dimensionId),
    toId(planeId),
    toId(adventureId),
    toId(accountId),
  ].join(':');
}

export function buildDimensionEntityTemplateId(entityId?: string) {
  if (!entityId) return undefined;
  return buildDimensionEntityCompositeId(
    entityId,
    DEFAULT_DIMENSION_ID,
    DEFAULT_PLANE_ID,
  );
}

export function buildAdventureEntityTemplateId(
  entityId?: string,
  adventureId: string = DEFAULT_ADVENTURE_ID,
) {
  if (!entityId) return undefined;
  return buildAdventureEntityCompositeId(
    entityId,
    DEFAULT_DIMENSION_ID,
    DEFAULT_PLANE_ID,
    adventureId,
    DEFAULT_ACCOUNT_ID,
  );
}
