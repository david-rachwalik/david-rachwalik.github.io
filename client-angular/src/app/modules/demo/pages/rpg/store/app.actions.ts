import { createActionGroup, emptyProps, props } from '@ngrx/store';

// import { AdventureIndex } from '../models/adventure';

export const AppActions = createActionGroup({
  source: 'RPG Demo',
  events: {
    Init: emptyProps(),
    Play: props<{ slotId: string }>(),

    'Load All Seeds': emptyProps(),
    'Load All Seeds Success': emptyProps(),

    // Adventure Slot ID
    'Load Current Slot Id': emptyProps(),
    'Load Current Slot Id Success': props<{ slotId: string }>(),
    'Load Current Slot Id Failure': props<{ error: string }>(),

    'Set Current Slot Id': props<{ slotId: string }>(),
    // 'Set Adventure Slot': props<{ slotId: string; slot: AdventureIndex }>(),
    'Clear Current Slot Id': emptyProps(),

    // Account ID
    // 'Set Account Id': props<{ id: string }>(),
    'Load Account Id': emptyProps(),
    'Load Account Id Success': props<{ id: string }>(),
    'Load Account Id Failure': props<{ error: string }>(),

    'Set Account Id': props<{ id: string }>(),
    'Clear Account Id': emptyProps(),

    // --- User Actions (export/import saves) ---

    'Download Save': props<{ slotId: string }>(),
    'Download Save Success': props<{ slotId: string }>(),
    'Download Save Failure': props<{ slotId: string; error: string }>(),

    'Upload Save': props<{ file: File }>(),
    'Upload Save Success': props<{ file: File }>(),
    'Upload Save Failure': props<{ error: string }>(),
  },
});
