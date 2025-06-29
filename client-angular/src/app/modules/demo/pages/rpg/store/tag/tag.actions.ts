import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Tag } from '../../models/tag';

export const TagActions = createActionGroup({
  source: 'Tag',
  events: {
    'Load Tags': emptyProps(),
    'Load Tags Success': props<{ tags: Tag[] }>(),
    'Load Tags Failure': props<{ error: string }>(),

    'Load Tags Seed': emptyProps(),
    'Load Tags Seed Success': props<{ tags: Tag[] }>(),

    'Add Tag': props<{ tag: Tag }>(),
    'Add Tag Success': props<{ tag: Tag }>(),

    'Update Tag': props<{ tag: Tag }>(),
    'Update Tag Success': props<{ tag: Tag }>(),

    'Delete Tag': props<{ id: string }>(),
    'Delete Tag Success': props<{ id: string }>(),
  },
});
