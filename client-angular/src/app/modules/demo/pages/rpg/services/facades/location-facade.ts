import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Location } from '../../models/location';
import { LocationActions } from '../../store/location/location.actions';
import {
  selectAllLocations,
  selectLocationById,
  selectLocationEntities,
} from '../../store/location/location.selectors';

@Injectable({ providedIn: 'root' })
export class LocationFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllLocations);
  entities$ = this.store.select(selectLocationEntities);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  add(location: Location) {
    this.store.dispatch(LocationActions.addLocation({ location }));
  }
  loadAll() {
    this.store.dispatch(LocationActions.loadAllLocations());
  }
  save(location: Location) {
    this.store.dispatch(LocationActions.saveLocation({ location }));
  }
  remove(id: string) {
    this.store.dispatch(LocationActions.removeLocation({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectLocationById(id));
  }
  // #endregion
}
