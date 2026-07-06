import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';

import { selectAllAdventures } from '../../store/adventure/adventure.selectors';
import { selectAllAttributes } from '../../store/attribute/attribute.selectors';
import { selectAllCharacters } from '../../store/character/character.selectors';
import { selectAllEffects } from '../../store/effect/effect.selectors';
import { selectAllItems } from '../../store/item/item.selectors';
import { selectAllLocations } from '../../store/location/location.selectors';
import { selectAllMoments } from '../../store/moment/moment.selectors';
import { selectAllSkills } from '../../store/skill/skill.selectors';
import { selectAllTags } from '../../store/tag/tag.selectors';
import {
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';

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

interface InfoRow {
  id: string;
  entityId?: string;
  name?: string;
  type?: string;
  valueType?: string;
  description?: string;
  raw: unknown;
}

interface ColumnMeta {
  key: 'name' | 'type' | 'description';
  header: string;
  value: (r: InfoRow) => string;
  tooltip?: (r: InfoRow) => string;
}

@Component({
  selector: 'app-info-page',
  imports: [
    CommonModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class RpgInfoComponent implements OnInit {
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

  // Table data
  // data$: Observable<unknown[]> = of([]);
  // displayedColumns: string[] = [];

  // Unified columns (Name / Type / Description) with tooltip rules
  columnMeta: ColumnMeta[] = [
    {
      key: 'name',
      header: 'Name',
      tooltip: (r) => (r.entityId ? `${r.entityId}\n` : '') + r.id,
      value: (r) => r.name ?? r.id,
    },
    {
      key: 'type',
      header: 'Type',
      tooltip: (r) => r.valueType || '',
      value: (r) => r.type || '—',
    },
    {
      key: 'description',
      header: 'Description',
      // tooltip: (r) => r.description || '',
      value: (r) => r.description || '—',
    },
  ];
  displayedColumns: string[] = this.columnMeta.map((c) => c.key);

  data$: Observable<InfoRow[]> = of([]);

  constructor(private store: Store) {}

  ngOnInit(): void {
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

  // --- Explicit mappers per feature (fully hardcoded) ---

  private mapAttributes(rows: AttributeRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      type: r.type,
      valueType: r.valueType,
      description: r.description,
      raw: r,
    }));
  }

  private mapEffects(rows: EffectRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name ?? r.id,
      type: r.type ?? r.kind,
      valueType: r.operation,
      description: r.description,
      raw: r,
    }));
  }

  private mapTags(rows: TagRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name ?? r.id,
      type: r.category,
      valueType: undefined,
      description: r.description,
      raw: r,
    }));
  }

  private summarizeTags(tags?: string[]): string | undefined {
    if (!tags?.length) return undefined;
    return tags.length > 4
      ? `${tags.slice(0, 4).join(', ')}…`
      : tags.join(', ');
  }

  private mapCharacters(rows: CharacterRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      type: this.summarizeTags(r.tags),
      valueType: undefined,
      description: r.description,
      raw: r,
    }));
  }

  private mapItems(rows: ItemRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      type: this.summarizeTags(r.tags),
      valueType: undefined,
      description: r.description,
      raw: r,
    }));
  }

  private mapSkills(rows: SkillRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      type: this.summarizeTags(r.tags),
      valueType: undefined,
      description: r.description,
      raw: r,
    }));
  }

  private mapMoments(rows: MomentRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.title,
      type: this.summarizeTags(r.tags),
      valueType: undefined,
      description: r.description,
      raw: r,
    }));
  }

  private mapLocations(rows: LocationRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.name,
      type: this.summarizeTags(r.tags),
      valueType: undefined,
      description: r.description,
      raw: r,
    }));
  }

  private mapAdventures(rows: AdventureRow[]): InfoRow[] {
    return rows.map((r) => ({
      id: r.id,
      entityId: r.entityId,
      name: r.label,
      type: [r.dimensionId, r.planeId].filter(Boolean).join(' / '),
      valueType: undefined,
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
      case 'adventures':
        base$ = this.adventures$;
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
          case 'adventures':
            return this.mapAdventures(rows as AdventureRow[]);
          default:
            return [];
        }
      }),
    );

    // Columns remain unified; adjust per feature only if needed in future
    this.displayedColumns = this.columnMeta.map((c) => c.key);
  }
}
