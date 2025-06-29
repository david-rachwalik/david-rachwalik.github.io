import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Item } from '../../models/item';

export const ItemActions = createActionGroup({
  source: 'Item',
  events: {
    'Load Items': emptyProps(),
    'Load Items Success': props<{ items: Item[] }>(),
    'Load Items Failure': props<{ error: string }>(),

    'Load Items Seed': emptyProps(),
    'Load Items Seed Success': props<{ items: Item[] }>(),

    'Add Item': props<{ item: Item }>(),
    'Add Item Success': props<{ item: Item }>(),

    'Update Item': props<{ item: Item }>(),
    'Update Item Success': props<{ item: Item }>(),

    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': props<{ id: string }>(),
  },
});
