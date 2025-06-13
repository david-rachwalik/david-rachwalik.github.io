import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {};

const pluralNames = {};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
