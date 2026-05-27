import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, take } from 'rxjs';

import { selectAllAdventures } from '../../store/adventure/adventure.selectors';
import { selectAllAttributes } from '../../store/attribute/attribute.selectors';
import { selectAllCharacters } from '../../store/character/character.selectors';
import { selectAllEffects } from '../../store/effect/effect.selectors';
import { selectAllItems } from '../../store/item/item.selectors';
import { selectAllLocations } from '../../store/location/location.selectors';
import { selectAllMoments } from '../../store/moment/moment.selectors';
import { selectAllSkills } from '../../store/skill/skill.selectors';
import { selectAllTags } from '../../store/tag/tag.selectors';
import { buildDimensionEntityTemplateId } from '../../utils-composite-id';
import { SeedJsonDialogComponent } from './admin.json.dialog.component';

@Component({
  selector: 'app-admin-editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatDialogModule,
    TitleCasePipe,
  ],
  templateUrl: './admin.editor.component.html',
  styleUrls: ['./admin.editor.component.css'],
})
export class AdminEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private dialog = inject(MatDialog);

  feature$!: Observable<string>;
  id$!: Observable<string>;

  // Writable local copy of the entity for the UI form.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editableEntity: Record<string, any> | null = null;
  private latestJson: string = '';
  private originalEntityStr: string = ''; // Snapshot for dirty checking

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
          this.latestJson = this.exportToSeedJson(this.editableEntity);
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

  saveChanges() {
    console.log('[Admin Editor] Save clicked. Entity:', this.editableEntity);
    // TODO: Dispatch specific strict-typed update action based on this.feature$

    // Update snapshot after successful save to disable the button again
    this.originalEntityStr = JSON.stringify(this.editableEntity);
  }
}
