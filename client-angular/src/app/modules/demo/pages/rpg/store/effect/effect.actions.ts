import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Effect } from '../../models/effect';

export const EffectActions = createActionGroup({
  source: 'Effect',
  events: {
    'Seed All Effects': emptyProps(),
    'Seed All Effects Success': props<{ effects: Effect[] }>(),
    'Seed All Effects Failure': props<{ error: string }>(),

    // Create
    'Add Effect': props<{ effect: Effect }>(),
    'Add Effect Success': props<{ effect: Effect }>(),
    'Add Effect Failure': props<{ error: string }>(),

    // Read
    'Load All Effects': emptyProps(),
    'Load All Effects Success': props<{ effects: Effect[] }>(),
    'Load All Effects Failure': props<{ error: string }>(),

    'Load Effect': props<{ id: string }>(),
    'Load Effect Success': props<{ effect: Effect }>(),
    'Load Effect Failure': props<{ error: string }>(),

    // Update
    'Save Effect': props<{ effect: Effect }>(),
    'Save Effect Success': props<{ effect: Effect }>(),
    'Save Effect Failure': props<{ error: string }>(),

    // Delete
    'Remove Effect': props<{ id: string }>(),
    'Remove Effect Success': props<{ id: string }>(),
    'Remove Effect Failure': props<{ error: string }>(),
  },
});
