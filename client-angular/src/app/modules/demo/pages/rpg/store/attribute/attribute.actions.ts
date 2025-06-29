import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Attribute } from '../../models/attribute';

export const AttributeActions = createActionGroup({
  source: 'Attribute',
  events: {
    'Load Attributes': emptyProps(),
    'Load Attributes Success': props<{ attributes: Attribute[] }>(),
    'Load Attributes Failure': props<{ error: string }>(),

    'Load Attributes Seed': emptyProps(),
    'Load Attributes Seed Success': props<{ attributes: Attribute[] }>(),
    // 'Load Attributes API': emptyProps(),
    // 'Load Attributes API Success': props<{ attributes: Attribute[] }>(),

    'Add Attribute': props<{ attribute: Attribute }>(),
    'Add Attribute Success': props<{ attribute: Attribute }>(),

    'Update Attribute': props<{ attribute: Attribute }>(),
    'Update Attribute Success': props<{ attribute: Attribute }>(),

    'Delete Attribute': props<{ id: string }>(),
    'Delete Attribute Success': props<{ id: string }>(),
  },
});
