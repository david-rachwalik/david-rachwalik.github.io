import { createFeature, createReducer, on } from '@ngrx/store';

import { AppActions } from './app.actions';

export interface AppState {
  seeded: boolean;
  currentSlotId: string | undefined;
}

export const initialState: AppState = {
  seeded: false,
  currentSlotId: undefined,
};

export const appFeature = createFeature({
  name: 'app',
  reducer: createReducer(
    initialState,
    on(AppActions.loadSeeds, (state) => ({ ...state, seeded: false })),
    on(AppActions.loadSeedsRequested, (state) => ({ ...state, seeded: false })),
    on(AppActions.seedsLoaded, (state) => ({ ...state, seeded: true })),
    on(AppActions.loadCurrentSlotId, (state) => ({ ...state })),
    on(AppActions.setCurrentSlotId, (state, { slotId }) => ({
      ...state,
      currentSlotId: slotId,
    })),
  ),
});
