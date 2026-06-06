import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { Skill } from '../../models/skill';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AppActions } from '../app.actions';
import { SkillActions } from './skill.actions';

// Seed loader
export const seedAllSkills$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const skills = data.getAllSkills();
          // console.log('seedAllSkills$ found skills: ', skills);
          return SkillActions.seedAllSkillsSuccess({ skills });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return SkillActions.seedAllSkillsFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

// #region 🔸 Database Effects 🔸

export const addSkill$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(SkillActions.addSkill),
      mergeMap(async ({ skill }) => {
        try {
          await db.saveSkill(skill);
          return SkillActions.addSkillSuccess({ skill });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return SkillActions.addSkillFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadAllSkills$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.init, SkillActions.loadAllSkills),
      mergeMap(async () => {
        try {
          const skills = await db.loadAllSkills();
          return SkillActions.loadAllSkillsSuccess({ skills });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return SkillActions.loadAllSkillsFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadSkill$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(SkillActions.loadSkill),
      mergeMap(async ({ id }) => {
        try {
          const skill = await db.loadSkill(id);
          if (!skill) throw new Error(`Skill not found: ${id}`);
          return SkillActions.loadSkillSuccess({ skill });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return SkillActions.loadSkillFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const saveSkill$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(SkillActions.saveSkill),
      mergeMap(async ({ id, changes }) => {
        try {
          // Fetch the existing model and merge with partial changes
          const current = await db.loadSkill(id);
          if (!current) throw new Error(`Skill not found: ${id}`);

          // Safely map partial updates and cast to strict Model
          const updated = { ...current, ...changes } as Skill;
          await db.saveSkill(updated);

          return SkillActions.saveSkillSuccess({ skill: updated });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return SkillActions.saveSkillFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const removeSkill$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(SkillActions.removeSkill),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteSkill(id);
          return SkillActions.removeSkillSuccess({ id });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return SkillActions.removeSkillFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);
// #endregion
