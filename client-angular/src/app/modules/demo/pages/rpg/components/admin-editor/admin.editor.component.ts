import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable, switchMap, take } from 'rxjs';

// --- Explicit Model Imports for strict typing ---
import { AdventureInstance } from '../../models/adventure';
import { AttributeInstance } from '../../models/attribute';
import { CharacterInstance } from '../../models/character';
import { EffectInstance } from '../../models/effect';
import { ItemInstance } from '../../models/item';
import { LocationInstance } from '../../models/location';
import { MomentInstance } from '../../models/moment';
import { SkillInstance } from '../../models/skill';
import { TagInstance } from '../../models/tag';

// --- Implied Selector Imports ---
import { selectAllAdventures } from '../../store/adventure/adventure.selectors';
import { selectAllAttributes } from '../../store/attribute/attribute.selectors';
import { selectAllCharacters } from '../../store/character/character.selectors';
import { selectAllEffects } from '../../store/effect/effect.selectors';
import { selectAllItems } from '../../store/item/item.selectors';
import { selectAllLocations } from '../../store/location/location.selectors';
import { selectAllMoments } from '../../store/moment/moment.selectors';
import { selectAllSkills } from '../../store/skill/skill.selectors';
import { selectAllTags } from '../../store/tag/tag.selectors';

// --- Implied Action Imports ---
import { AdventureActions } from '../../store/adventure/adventure.actions';
import { AttributeActions } from '../../store/attribute/attribute.actions';
import { CharacterActions } from '../../store/character/character.actions';
import { EffectActions } from '../../store/effect/effect.actions';
import { ItemActions } from '../../store/item/item.actions';
import { LocationActions } from '../../store/location/location.actions';
import { MomentActions } from '../../store/moment/moment.actions';
import { SkillActions } from '../../store/skill/skill.actions';
import { TagActions } from '../../store/tag/tag.actions';

import { buildDimensionEntityTemplateId } from '../../utils-composite-id';
import { AdminConfirmDialogComponent } from './admin.confirm.dialog.component';
import { SeedJsonDialogComponent } from './admin.json.dialog.component';

@Component({
  selector: 'app-admin-editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    TitleCasePipe,
  ],
  templateUrl: './admin.editor.component.html',
  styleUrls: ['./admin.editor.component.css'],
})
export class AdminEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private dialog = inject(MatDialog);

  feature$!: Observable<string>;
  id$!: Observable<string>;
  allTags$ = this.store.select(selectAllTags); // Provides tag catalog to the UI

  // Writable local copy of the entity for the UI form
  editableEntity: Record<string, unknown> | null = null;
  selectedTagToAdd: string | null = null; // Used for proper two-way structural binding

  private originalEntityStr: string = ''; // Snapshot for dirty checking

  // Expose tags strictly for the HTML template to satisfy ngtsc
  get editableTags(): string[] {
    const tags = this.editableEntity?.['tags'];
    // Safely ensures a string array return (avoids type assertions)
    if (Array.isArray(tags)) {
      return tags.filter((t): t is string => typeof t === 'string');
    }
    return [];
  }

  // Check if current form differs from original snapshot
  get hasChanges(): boolean {
    if (!this.editableEntity) return false;
    return JSON.stringify(this.editableEntity) !== this.originalEntityStr;
  }

  ngOnInit() {
    this.feature$ = this.route.paramMap.pipe(
      map((p) => p.get('feature') || ''),
    );
    this.id$ = this.route.paramMap.pipe(map((p) => p.get('id') || ''));

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const featureStr = params.get('feature');
          const id = params.get('id');

          if (!featureStr || !id) return [null];

          const featureObs$ = this.getFeatureObservable(featureStr);
          if (!featureObs$) return [null];

          return featureObs$.pipe(
            map((items: unknown[]) => {
              return (
                items.find(
                  (item): item is Record<string, unknown> =>
                    typeof item === 'object' &&
                    item !== null &&
                    'id' in item &&
                    (item as Record<string, unknown>)['id'] === id,
                ) || null
              );
            }),
          );
        }),
        take(1), // Take 1 prevents overwriting user edits when the store dynamically refreshes
      )
      .subscribe((entity) => {
        if (entity) {
          // Deep clone the object for safe, mutable local form state
          this.editableEntity = structuredClone(entity);
          this.originalEntityStr = JSON.stringify(this.editableEntity); // Save snapshot
        }
      });
  }

  // Strictly typed method to fetch the correct store slice
  private getFeatureObservable(feature: string): Observable<unknown[]> | null {
    switch (feature) {
      case 'tags':
        return this.store.select(selectAllTags);
      case 'attributes':
        return this.store.select(selectAllAttributes);
      case 'effects':
        return this.store.select(selectAllEffects);
      case 'adventures':
        return this.store.select(selectAllAdventures);
      case 'characters':
        return this.store.select(selectAllCharacters);
      case 'items':
        return this.store.select(selectAllItems);
      case 'skills':
        return this.store.select(selectAllSkills);
      case 'moments':
        return this.store.select(selectAllMoments);
      case 'locations':
        return this.store.select(selectAllLocations);
      default:
        return null;
    }
  }

  private exportToSeedJson(entity: unknown): string {
    if (!entity || typeof entity !== 'object') {
      return JSON.stringify(entity, null, 2);
    }
    const seed: Record<string, unknown> = {
      ...(entity as Record<string, unknown>),
    };

    delete seed['adventureId'];
    delete seed['accountId'];
    delete seed['appliedAt'];
    delete seed['appliedBy'];

    if (typeof seed['entityId'] === 'string') {
      seed['id'] = buildDimensionEntityTemplateId(seed['entityId']);
    }

    return JSON.stringify(seed, null, 2);
  }

  openJsonDialog() {
    // Regenerate JSON with latest form edits before popping modal
    const updatedJson = this.exportToSeedJson(this.editableEntity);
    this.dialog.open(SeedJsonDialogComponent, {
      data: { json: updatedJson },
      width: '600px',
      panelClass: 'dark-seed-dialog', // Ensure consistent theming
      autoFocus: false, // Prevent from auto-selecting textarea
    });
  }

  // --- Tag Management ---
  addTag(event: MatSelectChange) {
    const tagId = event.value as string;
    if (!tagId || !this.editableEntity) return;

    let currentTags = this.editableEntity['tags'] as string[] | undefined;
    if (!Array.isArray(currentTags)) {
      currentTags = [];
    }

    if (!currentTags.includes(tagId)) {
      currentTags.push(tagId);
      this.editableEntity['tags'] = currentTags;
    }

    // Reset the select element
    this.selectedTagToAdd = null;
  }

  removeTag(tagId: string) {
    if (!this.editableEntity || !Array.isArray(this.editableEntity['tags']))
      return;
    const currentTags = this.editableEntity['tags'] as string[];
    this.editableEntity['tags'] = currentTags.filter((t) => t !== tagId);
  }

  // --- Deletion ---
  async deleteEntity() {
    if (!this.editableEntity || !this.editableEntity['id']) return;

    const message: string =
      "Are you sure you want to delete this asset? (It will be restored upon refresh if it's a seeded template).";

    // 🔸 Typecast the generic return signature of the dialog
    const dialogRef = this.dialog.open<
      AdminConfirmDialogComponent,
      { message: string },
      boolean
    >(AdminConfirmDialogComponent, {
      data: { message },
      width: '400px',
      panelClass: 'dark-seed-dialog',
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) return;

    const feature = await firstValueFrom(this.feature$);
    const id = this.editableEntity['id'] as string;

    switch (feature) {
      case 'tags':
        this.store.dispatch(TagActions.removeTag({ id }));
        break;
      case 'attributes':
        this.store.dispatch(AttributeActions.removeAttribute({ id }));
        break;
      case 'effects':
        this.store.dispatch(EffectActions.removeEffect({ id }));
        break;
      case 'adventures':
        this.store.dispatch(AdventureActions.removeAdventure({ id }));
        break;
      case 'characters':
        this.store.dispatch(CharacterActions.removeCharacter({ id }));
        break;
      case 'items':
        this.store.dispatch(ItemActions.removeItem({ id }));
        break;
      case 'skills':
        this.store.dispatch(SkillActions.removeSkill({ id }));
        break;
      case 'moments':
        this.store.dispatch(MomentActions.removeMoment({ id }));
        break;
      case 'locations':
        this.store.dispatch(LocationActions.removeLocation({ id }));
        break;
      default:
        console.warn(`[Admin Editor] Unhandled feature delete: ${feature}`);
        break;
    }

    // Navigate back to the admin table
    await this.router.navigate(['/demo/rpg/admin']);
  }

  async saveChanges() {
    console.log('[Admin Editor] Save clicked. Entity:', this.editableEntity);
    if (!this.editableEntity || !this.editableEntity['id']) return;

    const feature = await firstValueFrom(this.feature$);
    const id = this.editableEntity['id'] as string;
    // console.log('[Admin Editor] saveChanges() id=', id);
    const changes = this.editableEntity;

    switch (feature) {
      case 'tags':
        this.store.dispatch(
          TagActions.saveTag({ id, changes: changes as TagInstance }),
        );
        break;
      case 'attributes':
        this.store.dispatch(
          AttributeActions.saveAttribute({
            id,
            changes: changes as AttributeInstance,
          }),
        );
        break;
      case 'effects':
        this.store.dispatch(
          EffectActions.saveEffect({ id, changes: changes as EffectInstance }),
        );
        break;
      case 'adventures':
        this.store.dispatch(
          AdventureActions.saveAdventure({
            id,
            changes: changes as AdventureInstance,
          }),
        );
        break;
      case 'characters':
        this.store.dispatch(
          CharacterActions.saveCharacter({
            id,
            changes: changes as CharacterInstance,
          }),
        );
        break;
      case 'items':
        this.store.dispatch(
          ItemActions.saveItem({ id, changes: changes as ItemInstance }),
        );
        break;
      case 'skills':
        this.store.dispatch(
          SkillActions.saveSkill({ id, changes: changes as SkillInstance }),
        );
        break;
      case 'moments':
        this.store.dispatch(
          MomentActions.saveMoment({ id, changes: changes as MomentInstance }),
        );
        break;
      case 'locations':
        this.store.dispatch(
          LocationActions.saveLocation({
            id,
            changes: changes as LocationInstance,
          }),
        );
        break;
      default:
        console.warn(`[Admin Editor] Unhandled feature save: ${feature}`);
        break;
    }

    // Update snapshot after successful save to disable the button again
    this.originalEntityStr = JSON.stringify(this.editableEntity);
  }
}
