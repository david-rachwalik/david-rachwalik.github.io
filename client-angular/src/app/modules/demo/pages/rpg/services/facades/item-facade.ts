import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

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

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllItems);
  entities$ = this.store.select(selectItemEntities);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
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
  byId$(id: string) {
    return this.store.select(selectItemById(id));
  }
  // #endregion
}
