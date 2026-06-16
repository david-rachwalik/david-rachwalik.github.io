import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { TAGS_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
import { Tag, TagInstance } from '../../models/tag';
import { TagActions } from '../../store/tag/tag.actions';
import {
  selectAllTags,
  selectTagById,
  selectTagEntities,
} from '../../store/tag/tag.selectors';

@Injectable({ providedIn: 'root' })
export class TagFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllTags); // for UI
  entities$ = this.store.select(selectTagEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectTagById(id));
  }
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸

  // Creates a temporary "blank canvas" for the UI (minimum valid model)
  addBlank(
    id: string,
    entityId: string,
    dimensionId: string,
    planeId: string,
    name: string,
  ) {
    const tag: Tag = {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      kind: 'system',
      category: 'general',
    } as Tag;
    this.store.dispatch(TagActions.addTag({ tag }));
  }
  add(tag: Tag) {
    this.store.dispatch(TagActions.addTag({ tag }));
  }
  loadAll() {
    this.store.dispatch(TagActions.loadAllTags());
  }
  save(changes: TagInstance) {
    if (!changes.id) {
      console.warn('[TagFacade] Save aborted: Instance is missing ID', changes);
      return;
    }
    this.store.dispatch(TagActions.saveTag({ id: changes.id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(TagActions.removeTag({ id }));
  }
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Tag | undefined {
    return getEntityFromCatalog(TAGS_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: TagInstance) {
    return mergeInstanceWithCatalog(TAGS_CATALOG, instance);
  }

  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Tag): TagInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[TagFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Tag>(full, base);
  }
  // #endregion
}
