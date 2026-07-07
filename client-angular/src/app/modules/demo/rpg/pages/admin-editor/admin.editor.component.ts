import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable, switchMap, take } from 'rxjs';

// --- Selectors ---
import { selectAllAdventures } from '../../store/adventure/adventure.selectors';
import { selectAllAttributes } from '../../store/attribute/attribute.selectors';
import { selectAllCharacters } from '../../store/character/character.selectors';
import { selectAllEffects } from '../../store/effect/effect.selectors';
import { selectAllItems } from '../../store/item/item.selectors';
import { selectAllLocations } from '../../store/location/location.selectors';
import { selectAllMoments } from '../../store/moment/moment.selectors';
import { selectAllSkills } from '../../store/skill/skill.selectors';
import { selectAllTags } from '../../store/tag/tag.selectors';

import { GameFacade } from '../../services/game-facade';
import { buildDimensionEntityTemplateId } from '../../utils-composite-id';
import { AdminConfirmDialogComponent } from './admin.confirm.dialog.component';
import { SeedJsonDialogComponent } from './admin.json.dialog.component';

@Component({
  selector: 'app-admin-editor',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    TitleCasePipe,
  ],
  templateUrl: './admin.editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin.editor.component.scss',
})
export class AdminEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private game = inject(GameFacade);
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
        this.game.utils.tag.remove(id);
        break;
      case 'attributes':
        this.game.utils.attribute.remove(id);
        break;
      case 'effects':
        this.game.utils.effect.remove(id);
        break;
      case 'adventures':
        // Use GameFacade's built-in orchestration for adventures
        await this.game.deleteGame(id);
        break;
      case 'characters':
        this.game.utils.character.remove(id);
        break;
      case 'items':
        this.game.utils.item.remove(id);
        break;
      case 'skills':
        this.game.utils.skill.remove(id);
        break;
      case 'moments':
        this.game.utils.moment.remove(id);
        break;
      case 'locations':
        this.game.utils.location.remove(id);
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
    // const id = this.editableEntity['id'] as string;
    // console.log('[Admin Editor] saveChanges() id=', id);
    const changes = this.editableEntity;

    switch (feature) {
      case 'tags':
        this.game.utils.tag.save(changes);
        break;
      case 'attributes':
        this.game.utils.attribute.save(changes);
        break;
      case 'effects':
        this.game.utils.effect.save(changes);
        break;
      case 'adventures':
        // Use GameFacade's built-in orchestration for adventures
        this.game.saveGame(changes);
        break;
      case 'characters':
        this.game.utils.character.save(changes);
        break;
      case 'items':
        this.game.utils.item.save(changes);
        break;
      case 'skills':
        this.game.utils.skill.save(changes);
        break;
      case 'moments':
        this.game.utils.moment.save(changes);
        break;
      case 'locations':
        this.game.utils.location.save(changes);
        break;
      default:
        console.warn(`[Admin Editor] Unhandled feature save: ${feature}`);
        break;
    }

    // Update snapshot after successful save to disable the button again
    this.originalEntityStr = JSON.stringify(this.editableEntity);
  }
}
