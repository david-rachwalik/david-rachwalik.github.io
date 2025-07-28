import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Skill } from '../../models/skill';
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
  add(skill: Skill) {
    this.store.dispatch(SkillActions.addSkill({ skill }));
  }
  loadAll() {
    this.store.dispatch(SkillActions.loadAllSkills());
  }
  save(skill: Skill) {
    this.store.dispatch(SkillActions.saveSkill({ skill }));
  }
  remove(id: string) {
    this.store.dispatch(SkillActions.removeSkill({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectSkillById(id));
  }
  // #endregion
}
