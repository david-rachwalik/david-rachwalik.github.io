import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { LOCATIONS_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
import { Location, LocationInstance } from '../../models/location';
import { LocationActions } from '../../store/location/location.actions';
import {
  selectAllLocations,
  selectLocationById,
  selectLocationEntities,
} from '../../store/location/location.selectors';

@Injectable({ providedIn: 'root' })
export class LocationFacade {
  constructor(private store: Store) {}

  // #region 🔸 Selectors 🔸

  all$ = this.store.select(selectAllLocations); // for UI
  entities$ = this.store.select(selectLocationEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectLocationById(id));
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
  ): Location {
    return {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      description: '',
      tags: [],
      effects: [],
    };
  }

  add(location: Location) {
    this.store.dispatch(LocationActions.addLocation({ location }));
  }
  loadAll() {
    this.store.dispatch(LocationActions.loadAllLocations());
  }
  save(changes: LocationInstance) {
    if (!changes.id) {
      console.warn(
        '[LocationFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(
      LocationActions.saveLocation({ id: changes.id, changes }),
    );
  }
  remove(id: string) {
    this.store.dispatch(LocationActions.removeLocation({ id }));
  }
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Location | undefined {
    return getEntityFromCatalog(LOCATIONS_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: LocationInstance) {
    return mergeInstanceWithCatalog(LOCATIONS_CATALOG, instance);
  }

  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Location): LocationInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[LocationFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Location>(full, base);
  }
  // #endregion
}
