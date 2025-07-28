import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Moment } from '../../models/moment';
import { selectCurrentMoment } from '../../store/app.selectors';
import { MomentActions } from '../../store/moment/moment.actions';
import {
  selectAllMoments,
  selectMomentById,
  selectMomentEntities,
} from '../../store/moment/moment.selectors';

@Injectable({ providedIn: 'root' })
export class MomentFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllMoments);
  entities$ = this.store.select(selectMomentEntities);

  current$ = this.store.select(selectCurrentMoment);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  add(moment: Moment) {
    this.store.dispatch(MomentActions.addMoment({ moment }));
  }
  loadAll() {
    this.store.dispatch(MomentActions.loadAllMoments());
  }
  save(moment: Moment) {
    this.store.dispatch(MomentActions.saveMoment({ moment }));
  }
  remove(id: string) {
    this.store.dispatch(MomentActions.removeMoment({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectMomentById(id));
  }
  // #endregion
}
