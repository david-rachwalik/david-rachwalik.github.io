import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Location } from '../../models/location';

export const LocationActions = createActionGroup({
  source: 'Location',
  events: {
    'Seed All Locations': emptyProps(),
    'Seed All Locations Success': props<{ locations: Location[] }>(),
    'Seed All Locations Failure': props<{ error: string }>(),

    // Createitem
    'Add Location': props<{ location: Location }>(),
    'Add Location Success': props<{ location: Location }>(),
    'Add Location Failure': props<{ error: string }>(),

    // Readitem
    'Load All Locations': emptyProps(),
    'Load All Locations Success': props<{ locations: Location[] }>(),
    'Load All Locations Failure': props<{ error: string }>(),

    'Load Location': props<{ id: string }>(),
    'Load Location Success': props<{ location: Location }>(),
    'Load Location Failure': props<{ error: string }>(),

    // Update
    'Save Location': props<{ location: Location }>(),
    'Save Location Success': props<{ location: Location }>(),
    'Save Location Failure': props<{ error: string }>(),

    // Deleteitem
    'Remove Location': props<{ id: string }>(),
    'Remove Location Success': props<{ id: string }>(),
    'Remove Location Failure': props<{ error: string }>(),
  },
});
