import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Attribute } from '../../models/attribute';

export const AttributeActions = createActionGroup({
  source: 'Attribute',
  events: {
    'Seed All Attributes': emptyProps(),
    'Seed All Attributes Success': props<{ attributes: Attribute[] }>(),
    'Seed All Attributes Failure': props<{ error: string }>(),

    // Create
    'Add Attribute': props<{ attribute: Attribute }>(),
    'Add Attribute Success': props<{ attribute: Attribute }>(),
    'Add Attribute Failure': props<{ error: string }>(),

    // Read
    'Load All Attributes': emptyProps(),
    'Load All Attributes Success': props<{ attributes: Attribute[] }>(),
    'Load All Attributes Failure': props<{ error: string }>(),

    'Load Attribute': props<{ id: string }>(),
    'Load Attribute Success': props<{ attribute: Attribute }>(),
    'Load Attribute Failure': props<{ error: string }>(),

    // Update
    'Save Attribute': props<{ attribute: Attribute }>(),
    'Save Attribute Success': props<{ attribute: Attribute }>(),
    'Save Attribute Failure': props<{ error: string }>(),

    // Delete
    'Remove Attribute': props<{ id: string }>(),
    'Remove Attribute Success': props<{ id: string }>(),
    'Remove Attribute Failure': props<{ error: string }>(),
  },
});
