import { Moment } from '../models/moment';

export const MOMENTS_SEED: Moment[] = [
  {
    id: 'first-steps',
    title: 'Your First Steps',
    description: 'You take your first steps into the unknown.',
    content: 'You wake up in a strange place...',
    choices: [
      { id: 'go-north', label: 'Go North' },
      { id: 'stay-put', label: 'Stay Put' },
    ],
    tags: ['intro'],
  },
  {
    id: 'first-battle',
    title: 'First Battle',
    description: '',
    content: 'A slime approaches!',
    choices: [
      /* ... */
    ],
    tags: ['combat'],
  },
];
