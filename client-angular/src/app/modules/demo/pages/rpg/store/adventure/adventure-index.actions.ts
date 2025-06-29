import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AdventureIndex } from '../../models/adventure';

export const AdventureIndexActions = createActionGroup({
  source: 'AdventureIndex',
  events: {
    // Create new adventure index (uses rollback)
    'Add Adventure Index': props<{ index: AdventureIndex }>(),
    'Add Adventure Index Success': props<{ index: AdventureIndex }>(),
    'Add Adventure Index Failure': props<{ error: string }>(),

    // Load all indexes (metadata)
    'Load Adventure Indexes': emptyProps(),
    'Load Adventure Indexes Success': props<{ slots: AdventureIndex[] }>(),
    'Load Adventure Indexes Failure': props<{ error: string }>(),

    // Update adventure index with partial changes
    'Save Adventure Index': props<{
      id: string;
      changes: Partial<AdventureIndex>;
    }>(),
    'Save Adventure Index Success': props<{ index: AdventureIndex }>(),
    'Save Adventure Index Failure': props<{ error: string }>(),

    // Delete index
    'Remove Adventure Index': props<{ id: string }>(),
    'Remove Adventure Index Success': props<{ id: string }>(),
    'Remove Adventure Index Failure': props<{ error: string }>(),
  },
});
