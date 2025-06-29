import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Adventure } from '../../models/adventure';

export const AdventureActions = createActionGroup({
  source: 'Adventure',
  events: {
    'Load Adventures Seed': emptyProps(),
    'Load Adventures Seed Success': props<{ adventures: Adventure[] }>(),

    // // List all available Adventures (now handled by AdventureIndex[])
    // 'Load Adventures': emptyProps(),
    // 'Load Adventures Success': props<{ adventures: Adventure[] }>(),
    // 'Load Adventures Failure': props<{ error: string }>(),

    // Create adventure state (uses rollback)
    'Add Adventure': props<{ adventure: Adventure }>(),
    'Add Adventure Success': props<{ adventure: Adventure }>(),
    'Add Adventure Failure': props<{ error: string }>(),

    // Load adventure state for a slot
    'Load Adventure': props<{ id: string }>(),
    'Load Adventure Success': props<{ adventure: Adventure }>(),
    'Load Adventure Failure': props<{ error: string }>(),

    // Update adventure with partial changes
    'Save Adventure': props<{ id: string; changes: Partial<Adventure> }>(),
    'Save Adventure Success': props<{ adventure: Adventure }>(),
    'Save Adventure Failure': props<{ error: string }>(),

    // Delete adventure state
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
