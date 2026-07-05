import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ITEMS_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
import { Item, ItemInstance } from '../../models/item';
import { ItemActions } from '../../store/item/item.actions';
import {
  selectAllItems,
  selectItemById,
  selectItemEntities,
} from '../../store/item/item.selectors';

@Injectable({ providedIn: 'root' })
export class ItemFacade {
  constructor(private store: Store) {}

  // #region 🔸 Selectors 🔸

  all$ = this.store.select(selectAllItems); // for UI
  entities$ = this.store.select(selectItemEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectItemById(id));
  }
  // #endregion

  // #region 🔸 CRUD Methods 🔸

  /** Creates a temporary "blank canvas" for the UI (minimum valid model) */
  buildBlank(
    id: string,
    entityId: string,
    name: string,
    dimensionId: string,
    planeId: string,
  ): Item {
    return {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      description: '',
      tags: [],
      // type: 'consumable',
      attributes: [],
      effects: [],
    };
  }

  add(item: Item) {
    this.store.dispatch(ItemActions.addItem({ item }));
  }
  loadAll() {
    this.store.dispatch(ItemActions.loadAllItems());
  }
  save(changes: ItemInstance) {
    if (!changes.id) {
      console.warn(
        '[ItemFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(ItemActions.saveItem({ id: changes.id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(ItemActions.removeItem({ id }));
  }
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Item | undefined {
    return getEntityFromCatalog(ITEMS_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: ItemInstance) {
    return mergeInstanceWithCatalog(ITEMS_CATALOG, instance);
  }

  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Item): ItemInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[ItemFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Item>(full, base);
  }
  // #endregion
}
