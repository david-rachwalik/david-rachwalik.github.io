import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Skill, SkillInstance } from '../../models/skill';
import { SkillActions } from '../../store/skill/skill.actions';
import {
  selectAllSkills,
  selectSkillById,
  selectSkillEntities,
} from '../../store/skill/skill.selectors';

@Injectable({ providedIn: 'root' })
export class SkillFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllSkills);
  entities$ = this.store.select(selectSkillEntities);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  // Creates a temporary "blank canvas" for the UI (minimum valid model)
  addBlank(
    id: string,
    entityId: string,
    name: string,
    dimensionId: string,
    planeId: string,
  ) {
    const skill: Skill = {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      description: '',
      tags: [],
      // type: 'spell',
      effects: [],
    };
    this.store.dispatch(SkillActions.addSkill({ skill }));
  }
  add(skill: Skill) {
    this.store.dispatch(SkillActions.addSkill({ skill }));
  }
  loadAll() {
    this.store.dispatch(SkillActions.loadAllSkills());
  }
  save(changes: SkillInstance) {
    if (!changes.id) {
      console.warn(
        '[SkillFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(SkillActions.saveSkill({ id: changes.id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(SkillActions.removeSkill({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectSkillById(id));
  }
  // #endregion
}
