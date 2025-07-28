import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Tag } from '../../models/tag';

export const TagActions = createActionGroup({
  source: 'Tag',
  events: {
    'Seed All Tags': emptyProps(),
    'Seed All Tags Success': props<{ tags: Tag[] }>(),
    'Seed All Tags Failure': props<{ error: string }>(),

    // Create
    'Add Tag': props<{ tag: Tag }>(),
    'Add Tag Success': props<{ tag: Tag }>(),
    'Add Tag Failure': props<{ error: string }>(),

    // Read
    'Load All Tags': emptyProps(),
    'Load All Tags Success': props<{ tags: Tag[] }>(),
    'Load All Tags Failure': props<{ error: string }>(),

    'Load Tag': props<{ id: string }>(),
    'Load Tag Success': props<{ tag: Tag }>(),
    'Load Tag Failure': props<{ error: string }>(),

    // Update
    'Save Tag': props<{ tag: Tag }>(),
    'Save Tag Success': props<{ tag: Tag }>(),
    'Save Tag Failure': props<{ error: string }>(),

    // Delete
    'Remove Tag': props<{ id: string }>(),
    'Remove Tag Success': props<{ id: string }>(),
    'Remove Tag Failure': props<{ error: string }>(),
  },
});
