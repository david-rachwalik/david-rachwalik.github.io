import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable, of } from 'rxjs';

// --- Explicit Model Imports for strict typing ---

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
import { CharacterActions } from '../../store/character/character.actions';

import { GameFacade } from '../../services/game-facade';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';
import { AdminPromptDialogComponent } from '../admin-editor/admin.prompt.dialog.component';

interface BaseRow {
  id: string;
  entityId?: string;
  name?: string;
  label?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

interface AttributeRow extends BaseRow {
  type?: string;
  valueType?: string;
}
interface EffectRow extends BaseRow {
  type?: string;
  kind?: string;
  operation?: string;
}
interface TagRow extends BaseRow {
  category?: string;
}
interface CharacterRow extends BaseRow {}
interface ItemRow extends BaseRow {}
interface SkillRow extends BaseRow {}
interface MomentRow extends BaseRow {}
interface LocationRow extends BaseRow {}
interface AdventureRow extends BaseRow {
  dimensionId?: string;
  planeId?: string;
}

interface AdminRow {
  id: string;
  entityId?: string;
  name?: string;
  displayType?: string; // For non-array structural types
  tagList?: string[]; // For array-based tags
  description?: string;
  raw: unknown;
}

interface ColumnMeta {
  key: 'name' | 'tags' | 'description';
  header: string;
  value: (r: AdminRow) => string | undefined;
  tooltip?: (r: AdminRow) => string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class RpgAdminComponent implements OnInit {
  private game = inject(GameFacade);

  // Store data streams
  tags$ = this.store.select(selectAllTags);
  attributes$ = this.store.select(selectAllAttributes);
  effects$ = this.store.select(selectAllEffects);
  characters$ = this.store.select(selectAllCharacters);
  items$ = this.store.select(selectAllItems);
  skills$ = this.store.select(selectAllSkills);
  moments$ = this.store.select(selectAllMoments);
  locations$ = this.store.select(selectAllLocations);
  adventures$ = this.store.select(selectAllAdventures);

  dimensions$: Observable<string[]> = of([DEFAULT_DIMENSION_ID]);
  planes$: Observable<string[]> = of([DEFAULT_PLANE_ID]);

  features = [
    { key: 'tags', label: 'Tags' },
    { key: 'attributes', label: 'Attributes' },
    { key: 'effects', label: 'Effects' },
    { key: 'characters', label: 'Characters' },
    { key: 'items', label: 'Items' },
    { key: 'skills', label: 'Skills' },
    { key: 'moments', label: 'Moments' },
    { key: 'locations', label: 'Locations' },
    { key: 'adventures', label: 'Adventures' },
  ];

  selectedDimension: string | null = null;
  selectedPlane: string | null = null;
  selectedFeature: string = 'attributes';

  // Unified columns (Name / Tags / Description) with tooltip rules
  columnMeta: ColumnMeta[] = [
    {
      key: 'name',
      header: 'Name',
      tooltip: (r) => r.id, // Only show ID here now
      value: (r) => r.name ?? r.id,
    },
    {
      key: 'tags',
      header: 'Tags / Type',
      value: (r) => r.displayType, // Fallback string getter
    },
    {
      key: 'description',
      header: 'Description',
      value: (r) => r.description,
    },
  ];
  displayedColumns: string[] = this.columnMeta.map((c) => c.key);

  data$: Observable<AdminRow[]> = of([]);

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Lazy-Load Playthrough Data only when Admin is opened
    this.store.dispatch(AdventureActions.loadAllAdventures());
    this.store.dispatch(CharacterActions.loadAllCharacters({ fetchAll: true }));

    // TODO: If eventually add an Admin table for Events/Indexes, dispatch them here too
    // this.store.dispatch(AdventureEventActions.loadAllAdventureEvents({ fetchAll: true }));

    this.updateTable();
  }

  onFeatureChange() {
    this.updateTable();
  }
  onDimensionChange() {
    this.updateTable();
  }
  onPlaneChange() {
    this.updateTable();
  }

  async selectItem(row: AdminRow) {
    // Navigate straight to the dedicated editor page
    await this.router.navigate([
      '/demo/rpg/admin',
      this.selectedFeature,
      row.id,
    ]);
  }

  // Generate a new blank asset
  async createNew() {
    const dialogRef = this.dialog.open(AdminPromptDialogComponent, {
      data: {
        label: `Enter new Entity ID for ${this.selectedFeature} (e.g. 'fireball', 'rusty-sword'):`,
      },
      width: '400px',
      panelClass: 'dark-seed-dialog',
    });

    const rawEntityId = (await firstValueFrom(dialogRef.afterClosed())) as
      | string
      | undefined;
    if (!rawEntityId) return;

    const entityId = rawEntityId.trim().toLowerCase().replace(/\s+/g, '-');
    const id = buildDimensionEntityCompositeId(
      entityId,
      this.selectedDimension ?? DEFAULT_DIMENSION_ID,
      this.selectedPlane ?? DEFAULT_PLANE_ID,
    );
    if (!id) return;

    const baseName = `New ${entityId}`;
    const dim = this.selectedDimension ?? DEFAULT_DIMENSION_ID;
    const plane = this.selectedPlane ?? DEFAULT_PLANE_ID;

    switch (this.selectedFeature) {
      case 'tags':
        this.game.utils.tag.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'attributes':
        this.game.utils.attribute.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'effects':
        this.game.utils.effect.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'adventures':
        await this.game.utils.adventure.addBlank(
          id,
          entityId,
          baseName,
          dim,
          plane,
        );
        break;
      case 'characters':
        this.game.utils.character.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'items':
        this.game.utils.item.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'skills':
        this.game.utils.skill.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'moments':
        this.game.utils.moment.addBlank(id, entityId, baseName, dim, plane);
        break;
      case 'locations':
        this.game.utils.location.addBlank(id, entityId, baseName, dim, plane);
        break;
      default:
        console.warn(
          `[Admin] Unhandled creation fallback: ${this.selectedFeature}`,
        );
        return; // Break execution so it does not navigate!
    }

    // Instantly navigate to the newly created asset
    await this.router.navigate(['/demo/rpg/admin', this.selectedFeature, id]);
  }

  // --- Explicit mappers per feature (fully hardcoded) ---

  private mapAttributes(rows: AttributeRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      displayType: r.type,
      description: r.description,
      tagList: r.tags,
      raw: r,
    }));
  }

  private mapEffects(rows: EffectRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name ?? r.id,
      displayType: r.type ?? r.kind,
      description: r.description,
      tagList: r.tags,
      raw: r,
    }));
  }

  private mapTags(rows: TagRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name ?? r.id,
      displayType: r.category,
      description: r.description,
      tagList: r.tags,
      raw: r,
    }));
  }

  private mapCharacters(rows: CharacterRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      tagList: r.tags,
      description: r.description,
      raw: r,
    }));
  }

  private mapItems(rows: ItemRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      tagList: r.tags,
      description: r.description,
      raw: r,
    }));
  }

  private mapSkills(rows: SkillRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      tagList: r.tags,
      description: r.description,
      raw: r,
    }));
  }

  private mapMoments(rows: MomentRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.title,
      tagList: r.tags,
      description: r.description,
      raw: r,
    }));
  }

  private mapLocations(rows: LocationRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      tagList: r.tags,
      description: r.description,
      raw: r,
    }));
  }

  private mapAdventures(rows: AdventureRow[]): AdminRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.label,
      displayType: [r.dimensionId, r.planeId].filter(Boolean).join(' / '),
      tagList: r.tags,
      description: r.description,
      raw: r,
    }));
  }

  updateTable() {
    let base$: Observable<unknown[]> = of([]);

    switch (this.selectedFeature) {
      case 'tags':
        base$ = this.tags$;
        break;
      case 'attributes':
        base$ = this.attributes$;
        break;
      case 'effects':
        base$ = this.effects$;
        break;
      case 'adventures':
        base$ = this.adventures$;
        break;
      case 'characters':
        base$ = this.characters$;
        break;
      case 'items':
        base$ = this.items$;
        break;
      case 'skills':
        base$ = this.skills$;
        break;
      case 'moments':
        base$ = this.moments$;
        break;
      case 'locations':
        base$ = this.locations$;
        break;
      default:
        base$ = of([]);
        break;
    }

    this.data$ = base$.pipe(
      map((rows) => {
        if (!Array.isArray(rows)) return [];
        switch (this.selectedFeature) {
          case 'tags':
            return this.mapTags(rows as TagRow[]);
          case 'attributes':
            return this.mapAttributes(rows as AttributeRow[]);
          case 'effects':
            return this.mapEffects(rows as EffectRow[]);
          case 'adventures':
            return this.mapAdventures(rows as AdventureRow[]);
          case 'characters':
            return this.mapCharacters(rows as CharacterRow[]);
          case 'items':
            return this.mapItems(rows as ItemRow[]);
          case 'skills':
            return this.mapSkills(rows as SkillRow[]);
          case 'moments':
            return this.mapMoments(rows as MomentRow[]);
          case 'locations':
            return this.mapLocations(rows as LocationRow[]);
          default:
            return [];
        }
      }),
    );

    // Columns remain unified; adjust per feature only if needed in future
    this.displayedColumns = this.columnMeta.map((c) => c.key);
  }
}
