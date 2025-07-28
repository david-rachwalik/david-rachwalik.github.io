import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Moment } from '../../models/moment';

export const MomentActions = createActionGroup({
  source: 'Moment',
  events: {
    'Seed All Moments': emptyProps(),
    'Seed All Moments Success': props<{ moments: Moment[] }>(),
    'Seed All Moments Failure': props<{ error: string }>(),

    // Create
    'Add Moment': props<{ moment: Moment }>(),
    'Add Moment Success': props<{ moment: Moment }>(),
    'Add Moment Failure': props<{ error: string }>(),

    // Read
    'Load All Moments': emptyProps(),
    'Load All Moments Success': props<{ moments: Moment[] }>(),
    'Load All Moments Failure': props<{ error: string }>(),

    'Load Moment': props<{ id: string }>(),
    'Load Moment Success': props<{ moment: Moment }>(),
    'Load Moment Failure': props<{ error: string }>(),

    // Update
    'Save Moment': props<{ moment: Moment }>(),
    'Save Moment Success': props<{ moment: Moment }>(),
    'Save Moment Failure': props<{ error: string }>(),

    // Delete
    'Remove Moment': props<{ id: string }>(),
    'Remove Moment Success': props<{ id: string }>(),
    'Remove Moment Failure': props<{ error: string }>(),
  },
});
