import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { getTagInstanceFromCatalog } from '../../data/tags-seed';
import { Tag, TagInstance } from '../../models/tag';
import { TagActions } from '../../store/tag/tag.actions';
import {
  selectAllTags,
  selectTagById,
  selectTagEntities,
} from '../../store/tag/tag.selectors';

@Injectable({ providedIn: 'root' })
export class TagFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllTags);
  entities$ = this.store.select(selectTagEntities);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  // Creates a temporary "blank canvas" for the UI (minimum valid model)
  addBlank(
    id: string,
    entityId: string,
    dimensionId: string,
    planeId: string,
    name: string,
  ) {
    const tag: Tag = {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      kind: 'system',
      category: 'general',
    } as Tag;
    this.store.dispatch(TagActions.addTag({ tag }));
  }
  add(tag: Tag) {
    this.store.dispatch(TagActions.addTag({ tag }));
  }
  loadAll() {
    this.store.dispatch(TagActions.loadAllTags());
  }
  save(changes: TagInstance) {
    if (!changes.id) {
      console.warn('[TagFacade] Save aborted: Instance is missing ID', changes);
      return;
    }
    this.store.dispatch(TagActions.saveTag({ id: changes.id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(TagActions.removeTag({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectTagById(id));
  }
  // #endregion

  // ---- Typed, dynamic utilities (no any, no unsafe indexing) ----
  private static mergeInstanceOverBase<T extends object, U extends Partial<T>>(
    base: T,
    inst: U,
    omit: readonly (keyof T)[] = [],
  ): T {
    const patch: Partial<T> = {};
    for (const key of Object.keys(inst) as (keyof T)[]) {
      if (omit.includes(key)) continue;
      const val = inst[key as keyof U];
      if (val !== undefined) {
        patch[key] = val as T[typeof key];
      }
    }
    return { ...base, ...patch };
  }

  private static diffFromBase<T extends object>(
    full: T,
    base: Partial<T>,
    omit: readonly (keyof T)[] = [],
  ): Partial<T> {
    const out: Partial<T> = {};
    const keys = new Set<keyof T>([
      ...(Object.keys(full) as (keyof T)[]),
      ...(Object.keys(base) as (keyof T)[]),
    ]);
    console.group('[diffFromBase]');
    console.log('Full:', full);
    console.log('Base:', base);
    for (const key of keys) {
      if (omit.includes(key)) continue;
      const fv = full[key];
      const bv = base[key];
      if (fv !== undefined && !Object.is(fv, bv)) {
        out[key] = fv as T[typeof key];
        console.log(`Diff: ${String(key)} | full:`, fv, '| base:', bv);
      }
    }
    console.log('Result diff:', out);
    console.groupEnd();
    return out;
  }

  // #region 🔸 Tag Logic 🔸

  // Convert full Tag → TagInstance (entityId + diffs)
  tagToInstance(full: Tag): TagInstance | undefined {
    // const base = getTagInstanceFromCatalog(full.entityId);
    const base = getTagInstanceFromCatalog(full.entityId) as
      | TagInstance
      | undefined;

    console.group('[tagToInstance]');
    console.log('Full Tag:', full);
    console.log('Catalog Tag:', base);
    // if (!base) return undefined;
    if (!base) {
      console.warn('No catalog tag found for entityId:', full.entityId);
      console.groupEnd();
      return undefined;
    }
    // const patch = CharacterFacade.diffFromBase<Tag>(full, base, [
    //   'id',
    //   'entityId',
    //   'dimensionId',
    //   'planeId',
    // ] as const);
    // const out: TagInstance = {
    //   entityId: full.entityId,
    //   ...(full.id ? ({ id: full.id } as Pick<TagInstance, 'id'>) : {}),
    //   ...(patch as Partial<TagInstance>),
    // };
    const patch = TagFacade.diffFromBase<Tag>(full, base);
    const out: TagInstance = {
      entityId: full.entityId,
      ...patch,
    };
    console.log('TagInstance:', out);
    console.groupEnd();
    return out;
  }
  // #endregion
}
