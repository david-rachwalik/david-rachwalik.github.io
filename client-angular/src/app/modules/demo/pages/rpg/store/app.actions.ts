import { createActionGroup, emptyProps, props } from '@ngrx/store';

// import { AdventureIndex } from '../models/adventure';

export const AppActions = createActionGroup({
  source: 'RPG Demo',
  events: {
    Init: emptyProps(),
    Play: props<{ slotId: string }>(),

    'Load Seeds': emptyProps(),
    'Load Seeds Requested': emptyProps(),
    'Seeds Loaded': emptyProps(),

    'Load Current Slot Id': emptyProps(),
    'Set Current Slot Id': props<{ slotId: string }>(),
    // 'Set Adventure Slot': props<{ slotId: string; slot: AdventureIndex }>(),
    'Clear Current Slot Id': emptyProps(),
  },
});
