import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Moment } from '../../models/moment';

export const MomentActions = createActionGroup({
  source: 'Moment',
  events: {
    'Load Moments': emptyProps(),
    'Load Moments Success': props<{ moments: Moment[] }>(),
    'Load Moments Failure': props<{ error: string }>(),

    'Load Moments Seed': emptyProps(),
    'Load Moments Seed Success': props<{ moments: Moment[] }>(),

    'Add Moment': props<{ moment: Moment }>(),
    'Add Moment Success': props<{ moment: Moment }>(),

    'Update Moment': props<{ moment: Moment }>(),
    'Update Moment Success': props<{ moment: Moment }>(),

    'Delete Moment': props<{ id: string }>(),
    'Delete Moment Success': props<{ id: string }>(),
  },
});
