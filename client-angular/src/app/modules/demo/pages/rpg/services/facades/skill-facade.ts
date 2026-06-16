import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { SKILLS_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
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

  all$ = this.store.select(selectAllSkills); // for UI
  entities$ = this.store.select(selectSkillEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectSkillById(id));
  }
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
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Skill | undefined {
    return getEntityFromCatalog(SKILLS_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: SkillInstance) {
    return mergeInstanceWithCatalog(SKILLS_CATALOG, instance);
  }

  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Skill): SkillInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[SkillFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Skill>(full, base);
  }
  // #endregion
}
