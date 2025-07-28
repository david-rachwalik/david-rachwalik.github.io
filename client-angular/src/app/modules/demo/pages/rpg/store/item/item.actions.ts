import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Item } from '../../models/item';

export const ItemActions = createActionGroup({
  source: 'Item',
  events: {
    'Seed All Items': emptyProps(),
    'Seed All Items Success': props<{ items: Item[] }>(),
    'Seed All Items Failure': props<{ error: string }>(),

    // Create
    'Add Item': props<{ item: Item }>(),
    'Add Item Success': props<{ item: Item }>(),
    'Add Item Failure': props<{ error: string }>(),

    // Read
    'Load All Items': emptyProps(),
    'Load All Items Success': props<{ items: Item[] }>(),
    'Load All Items Failure': props<{ error: string }>(),

    'Load Item': props<{ id: string }>(),
    'Load Item Success': props<{ item: Item }>(),
    'Load Item Failure': props<{ error: string }>(),

    // Update
    'Save Item': props<{ item: Item }>(),
    'Save Item Success': props<{ item: Item }>(),
    'Save Item Failure': props<{ error: string }>(),

    // Delete
    'Remove Item': props<{ id: string }>(),
    'Remove Item Success': props<{ id: string }>(),
    'Remove Item Failure': props<{ error: string }>(),
  },
});
