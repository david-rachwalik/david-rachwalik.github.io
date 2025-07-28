import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Adventure } from '../../models/adventure';

export const AdventureActions = createActionGroup({
  source: 'Adventure',
  events: {
    'Seed All Adventures': emptyProps(),
    'Seed All Adventures Success': props<{ adventures: Adventure[] }>(),
    'Seed All Adventures Failure': props<{ error: string }>(),

    // Create (uses rollback)
    'Add Adventure': props<{ adventure: Adventure }>(),
    'Add Adventure Success': props<{ adventure: Adventure }>(),
    'Add Adventure Failure': props<{ error: string }>(),

    // Read
    'Load All Adventures': emptyProps(),
    'Load All Adventures Success': props<{ adventures: Adventure[] }>(),
    'Load All Adventures Failure': props<{ error: string }>(),

    'Load Adventure': props<{ id: string }>(),
    'Load Adventure Success': props<{ adventure: Adventure }>(),
    'Load Adventure Failure': props<{ error: string }>(),

    // Update (with partial changes)
    'Save Adventure': props<{ id: string; changes: Partial<Adventure> }>(),
    'Save Adventure Success': props<{ adventure: Adventure }>(),
    'Save Adventure Failure': props<{ error: string }>(),

    // Delete
    'Remove Adventure': props<{ id: string }>(),
    'Remove Adventure Success': props<{ id: string }>(),
    'Remove Adventure Failure': props<{ error: string }>(),

    // Adventure event logs
    'Add Log Entry': props<{ slotId: string; message: string }>(),
    'Clear Log': props<{ slotId: string }>(),

    // Clear in-memory adventure
    'Clear Adventure': emptyProps(),
  },
});
