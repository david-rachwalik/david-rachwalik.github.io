import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs';

import { ALL_SKILLS } from '../../data/game-catalogs';
import { mergeHybridData } from '../../data/utils-seed';
import { Skill } from '../../models/skill';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AppActions } from '../app.actions';
import { SkillActions } from './skill.actions';

// Seed loader
export const seedAllSkills$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      mergeMap(async () => {
        try {
          // Fetch custom templates from IndexedDB
          const dbTemplates = await db.loadAllSkills();
          // Merge static seed data with custom templates
          const skills = mergeHybridData(ALL_SKILLS, dbTemplates);
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
