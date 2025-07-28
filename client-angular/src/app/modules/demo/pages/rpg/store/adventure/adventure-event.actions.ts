import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AdventureEvent } from '../../models/adventure';

export const AdventureEventActions = createActionGroup({
  source: 'AdventureEvent',
  events: {
    // Create
    'Add Adventure Event': props<{ event: AdventureEvent }>(),
    'Add Adventure Event Success': props<{ event: AdventureEvent }>(),
    'Add Adventure Event Failure': props<{ error: string }>(),

    // Read
    'Load All Adventure Events': emptyProps(),
    'Load All Adventure Events Success': props<{ events: AdventureEvent[] }>(),
    'Load All Adventure Events Failure': props<{ error: string }>(),

    'Load Adventure Event': props<{ id: string }>(),
    'Load Adventure Event Success': props<{ event: AdventureEvent }>(),
    'Load Adventure Event Failure': props<{ error: string }>(),

    // Update
    'Save Adventure Event': props<{ event: AdventureEvent }>(),
    'Save Adventure Event Success': props<{ event: AdventureEvent }>(),
    'Save Adventure Event Failure': props<{ error: string }>(),

    // Delete
    'Remove Adventure Event': props<{ id: string }>(),
    'Remove Adventure Event Success': props<{ id: string }>(),
    'Remove Adventure Event Failure': props<{ error: string }>(),

    'Remove All Adventure Events': props<{ id: string }>(),
    'Remove All Adventure Events Success': props<{ id: string }>(),
    'Remove All Adventure Events Failure': props<{ error: string }>(),
  },
});
