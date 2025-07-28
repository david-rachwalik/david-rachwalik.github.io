import { createFeature, createReducer, on } from '@ngrx/store';

import { AppActions } from './app.actions';

export interface AppState {
  seeded: boolean; // for initial load
  error: string | null; // for any async operation
  accountId: string | undefined;
  currentSlotId: string | undefined;
}

export const initialState: AppState = {
  seeded: false,
  error: null,
  accountId: undefined,
  currentSlotId: undefined,
};

export const appFeature = createFeature({
  name: 'app',
  reducer: createReducer(
    initialState,
    // // Init
    // on(AppActions.init, (state) => ({ ...state })),
    // // Play: can be used for tracking current slot
    // on(AppActions.play, (state, { slotId }) => ({
    //   ...state,
    //   currentSlotId: slotId,
    // })),
    // // Seeds
    // on(AppActions.loadAllSeeds, (state) => ({ ...state })),
    // on(AppActions.loadAllSeedsSuccess, (state) => ({
    //   ...state,
    //   seeded: true,
    // })),

    // })),
    on(AppActions.loadAllSeedsSuccess, (state) => ({
      ...state,
      seeded: true,
    })),

    // Account Id
    on(AppActions.loadAccountId, (state) => ({ ...state, error: null })),
    on(AppActions.loadAccountIdSuccess, (state, { id }) => ({
      ...state,
      accountId: id,
    })),
    on(AppActions.loadAccountIdFailure, (state, { error }) => ({
      ...state,
      error,
    })),

    on(AppActions.setAccountId, (state, { id }) => ({
      ...state,
      accountId: id,
    })),
    on(AppActions.clearAccountId, (state) => ({
      ...state,
      accountId: undefined,
    })),

    // Adventure Slot Id
    on(AppActions.loadCurrentSlotId, (state) => ({ ...state, error: null })),
    on(AppActions.loadCurrentSlotIdSuccess, (state, { slotId }) => ({
      ...state,
      currentSlotId: slotId,
    })),
    on(AppActions.loadCurrentSlotIdFailure, (state, { error }) => ({
      ...state,
      error,
    })),

    on(AppActions.setCurrentSlotId, (state, { slotId }) => ({
      ...state,
      currentSlotId: slotId,
    })),
    on(AppActions.clearCurrentSlotId, (state) => ({
      ...state,
      currentSlotId: undefined,
    })),

    // Download Save
    on(AppActions.downloadSave, (state) => ({ ...state, error: null })),
    on(AppActions.downloadSaveFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    // Upload Save
    on(AppActions.uploadSave, (state) => ({ ...state, error: null })),
    on(AppActions.uploadSaveFailure, (state, { error }) => ({
      ...state,
      error,
    })),
  ),
});
