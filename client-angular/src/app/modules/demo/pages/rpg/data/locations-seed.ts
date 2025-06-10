import { Location } from '../models/location';

export const LOCATIONS_SEED: Location[] = [
  {
    id: 'village-square',
    name: 'Village Square',
    description: 'A peaceful central hub with friendly townsfolk.',
    tags: ['safe-zone', 'town'],
  },
  {
    id: 'peaceful-village',
    name: 'Peaceful Village',
    description: 'A quiet town at the edge of the forest.',
    tags: ['safe-zone', 'town'],
  },
  {
    id: 'cave',
    name: 'Dark Cave',
    description: 'You sense danger within.',
    tags: [],
  },
];
