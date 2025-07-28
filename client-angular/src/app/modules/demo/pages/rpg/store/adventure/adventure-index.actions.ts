import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AdventureIndex } from '../../models/adventure';

export const AdventureIndexActions = createActionGroup({
  source: 'AdventureIndex',
  events: {
    // Create adventure index state (uses rollback)
    'Add Adventure Index': props<{ index: AdventureIndex }>(),
    'Add Adventure Index Success': props<{ index: AdventureIndex }>(),
    'Add Adventure Index Failure': props<{ error: string }>(),

    // Read adventure index (metadata) state
    'Load All Adventure Indexes': emptyProps(),
    'Load All Adventure Indexes Success': props<{ slots: AdventureIndex[] }>(),
    'Load All Adventure Indexes Failure': props<{ error: string }>(),

    // Update adventure index with partial changes
    // 'Save Adventure Index': props<{
    //   id: string;
    //   changes: Partial<AdventureIndex>;
    // }>(),
    'Save Adventure Index': props<{ index: AdventureIndex }>(),
    'Save Adventure Index Success': props<{ index: AdventureIndex }>(),
    'Save Adventure Index Failure': props<{ error: string }>(),

    // Delete adventure index state
    'Remove Adventure Index': props<{ id: string }>(),
    'Remove Adventure Index Success': props<{ id: string }>(),
    'Remove Adventure Index Failure': props<{ error: string }>(),

    'Remove All Adventure Indexes': props<{ id: string }>(),
    'Remove All Adventure Indexes Success': props<{ id: string }>(),
    'Remove All Adventure Indexes Failure': props<{ error: string }>(),
  },
});
