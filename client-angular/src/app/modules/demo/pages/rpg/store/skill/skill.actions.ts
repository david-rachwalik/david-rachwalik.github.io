import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Skill } from '../../models/skill';

export const SkillActions = createActionGroup({
  source: 'Skill',
  events: {
    'Seed All Skills': emptyProps(),
    'Seed All Skills Success': props<{ skills: Skill[] }>(),
    'Seed All Skills Failure': props<{ error: string }>(),

    // Create
    'Add Skill': props<{ skill: Skill }>(),
    'Add Skill Success': props<{ skill: Skill }>(),
    'Add Skill Failure': props<{ error: string }>(),

    // Read
    'Load All Skills': emptyProps(),
    'Load All Skills Success': props<{ skills: Skill[] }>(),
    'Load All Skills Failure': props<{ error: string }>(),

    'Load Skill': props<{ id: string }>(),
    'Load Skill Success': props<{ skill: Skill }>(),
    'Load Skill Failure': props<{ error: string }>(),

    // Update
    'Save Skill': props<{ skill: Skill }>(),
    'Save Skill Success': props<{ skill: Skill }>(),
    'Save Skill Failure': props<{ error: string }>(),

    // Delete
    'Remove Skill': props<{ id: string }>(),
    'Remove Skill Success': props<{ id: string }>(),
    'Remove Skill Failure': props<{ error: string }>(),
  },
});
