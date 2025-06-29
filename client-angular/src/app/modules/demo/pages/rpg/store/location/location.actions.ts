import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Location } from '../../models/location';

export const LocationActions = createActionGroup({
  source: 'Location',
  events: {
    'Load Locations': emptyProps(),
    'Load Locations Success': props<{ locations: Location[] }>(),
    'Load Locations Failure': props<{ error: string }>(),

    'Load Locations Seed': emptyProps(),
    'Load Locations Seed Success': props<{ locations: Location[] }>(),

    'Add Location': props<{ location: Location }>(),
    'Add Location Success': props<{ location: Location }>(),

    'Update Location': props<{ location: Location }>(),
    'Update Location Success': props<{ location: Location }>(),

    'Delete Location': props<{ id: string }>(),
    'Delete Location Success': props<{ id: string }>(),
  },
});
