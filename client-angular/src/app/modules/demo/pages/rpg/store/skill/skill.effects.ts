import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
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
          console.log('loadSkillsSeed found skills: ', skills);
          return SkillActions.seedAllSkillsSuccess({ skills });
        } catch (error) {
          return SkillActions.seedAllSkillsFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllSkillsApi$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SkillActions.loadAllSkills),
      // Replace with real API call later
      // Will just use `loadSkillsSuccess`, not `loadSkillsAPISuccess`
      map(() =>
        SkillActions.loadAllSkillsFailure({ error: 'API not implemented' }),
      ),
    ),
  { functional: true },
);

// // #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

// export const addSkillDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(SkillActions.addSkill),
//       mergeMap(async ({ skill }) => {
//         try {
//           await saveService.saveSkill(skill);
//           return SkillActions.addSkillSuccess({ skill });
//         } catch (error) {
//           return SkillActions.addSkillFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadAllSkillsDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(AppActions.init, SkillActions.loadAllSkills),
//       mergeMap(async () => {
//         try {
//           const skills = await saveService.loadAllSkills();
//           return SkillActions.loadAllSkillsSuccess({ skills });
//         } catch (error) {
//           return SkillActions.loadAllSkillsFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadSkillDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(SkillActions.loadSkill),
//       mergeMap(async ({ id }) => {
//         try {
//           const skill = await saveService.loadSkill(id);
//           if (!skill) throw new Error(`Skill not found: ${id}`);
//           return SkillActions.loadSkillSuccess({ skill });
//         } catch (error) {
//           return SkillActions.loadSkillFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const saveSkillDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(SkillActions.saveSkill),
//       mergeMap(async ({ skill }) => {
//         try {
//           // Directly save the full skill (no merge with existing)
//           await saveService.saveSkill(skill);
//           return SkillActions.saveSkillSuccess({ skill });
//         } catch (error) {
//           return SkillActions.saveSkillFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const removeSkillDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(SkillActions.removeSkill),
//       mergeMap(async ({ id }) => {
//         try {
//           await saveService.deleteSkill(id);
//           return SkillActions.removeSkillSuccess({ id });
//         } catch (error) {
//           return SkillActions.removeSkillFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );
// // #endregion
