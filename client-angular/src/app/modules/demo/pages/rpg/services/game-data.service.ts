import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Adventure } from '../models/adventure';
import { Attribute } from '../models/attribute';
import { Character } from '../models/character';
import { Item } from '../models/item';
import { Location } from '../models/location';
import { Moment } from '../models/moment';
import { Tag } from '../models/tag';

import { ADVENTURES_SEED } from '../data/adventures-seed';
import { ATTRIBUTES_SEED } from '../data/attributes-seed';
import { CHARACTERS_SEED } from '../data/characters-seed';
import { ITEMS_SEED } from '../data/items-seed';
import { LOCATIONS_SEED } from '../data/locations-seed';
import { MOMENTS_SEED } from '../data/moments-seed';
import { TAGS_SEED } from '../data/tags-seed';

// :: Responsible for where game assets are stored (API, local storage, etc.) ::
// and for their low-level data storage/retrieval (CRUD)
// (think of it as your in-memory "database" or API layer)

// Manages static/reference data (the "catalog" of items, moments, locations, etc.),
// which is usually not directly mutated by gameplay

// #region 🔸 GAME ASSETS 🔸
export function updateEntity<T extends { id: string }>(
  entities: Record<string, T>,
  id: string,
  changes: Partial<T>,
): Record<string, T> {
  return {
    ...entities,
    [id]: { ...entities[id], ...changes },
  };
}

export function addEntity<T extends { id: string }>(
  entities: Record<string, T>,
  entity: T,
): Record<string, T> {
  return {
    ...entities,
    [entity.id]: entity,
  };
}

export function removeEntity<T extends { id: string }>(
  entities: Record<string, T>,
  id: string,
): Record<string, T> {
  const { [id]: removed, ...rest } = entities;
  return rest;
}
// #endregion

@Injectable({ providedIn: 'root' })
export class GameDataService {
  // #region 🔸 ADVENTURES 🔸
  private adventuresSubject = new BehaviorSubject<Record<string, Adventure>>(
    Object.fromEntries(
      ADVENTURES_SEED.map((adventure) => [adventure.id, adventure]),
    ),
  );
  adventures$ = this.adventuresSubject.asObservable();

  getAdventure(id: string): Adventure | undefined {
    return this.adventuresSubject.value[id];
  }
  getAllAdventures(): Adventure[] {
    return Object.values(this.adventuresSubject.value);
  }
  addAdventure(adventure: Adventure): void {
    this.adventuresSubject.next(
      addEntity(this.adventuresSubject.value, adventure),
    );
  }
  updateAdventure(id: string, changes: Partial<Adventure>): void {
    this.adventuresSubject.next(
      updateEntity(this.adventuresSubject.value, id, changes),
    );
  }
  removeAdventure(id: string): void {
    this.adventuresSubject.next(removeEntity(this.adventuresSubject.value, id));
  }
  // #endregion

  // #region 🔸 ATTRIBUTES 🔸
  private attributesSubject = new BehaviorSubject<Record<string, Attribute>>(
    Object.fromEntries(ATTRIBUTES_SEED.map((attr) => [attr.id, attr])),
  );
  attributes$ = this.attributesSubject.asObservable();

  getAttribute(id: string): Attribute | undefined {
    return this.attributesSubject.value[id];
  }
  getAllAttributes(): Attribute[] {
    return Object.values(this.attributesSubject.value);
  }
  // addAttribute(attr: Attribute): void {
  //   this.attributesSubject.next({
  //     ...this.attributesSubject.value,
  //     [attr.id]: attr,
  //   });
  // }
  // updateAttribute(id: string, changes: Partial<Attribute>): void {
  //   const updated = { ...this.attributesSubject.value[id], ...changes };
  //   this.attributesSubject.next({
  //     ...this.attributesSubject.value,
  //     [id]: updated,
  //   });
  // }
  // removeAttribute(id: string): void {
  //   const { [id]: removed, ...rest } = this.attributesSubject.value;
  //   this.attributesSubject.next(rest);
  // }
  addAttribute(attr: Attribute): void {
    this.attributesSubject.next(addEntity(this.attributesSubject.value, attr));
  }
  updateAttribute(id: string, changes: Partial<Attribute>): void {
    this.attributesSubject.next(
      updateEntity(this.attributesSubject.value, id, changes),
    );
  }
  removeAttribute(id: string): void {
    this.attributesSubject.next(removeEntity(this.attributesSubject.value, id));
  }
  // #endregion

  // #region 🔸 TAGS 🔸
  private tagsSubject = new BehaviorSubject<Record<string, Tag>>(
    Object.fromEntries(TAGS_SEED.map((tag) => [tag.id, tag])),
  );
  tags$ = this.tagsSubject.asObservable();

  getTag(id: string): Tag | undefined {
    return this.tagsSubject.value[id];
  }
  getAllTags(): Tag[] {
    return Object.values(this.tagsSubject.value);
  }
  addTag(tag: Tag): void {
    this.tagsSubject.next(addEntity(this.tagsSubject.value, tag));
  }
  updateTag(id: string, changes: Partial<Tag>): void {
    this.tagsSubject.next(updateEntity(this.tagsSubject.value, id, changes));
  }
  removeTag(id: string): void {
    this.tagsSubject.next(removeEntity(this.tagsSubject.value, id));
  }
  // #endregion

  // #region 🔸 MOMENTS 🔸
  // private readonly moments: Record<string, Moment> = MOMENTS_SEED;
  private momentsSubject = new BehaviorSubject<Record<string, Moment>>(
    Object.fromEntries(MOMENTS_SEED.map((mo) => [mo.id, mo])),
  );
  moments$ = this.momentsSubject.asObservable();

  getMoment(id: string): Moment | undefined {
    return this.momentsSubject.value[id];
  }
  getAllMoments(): Moment[] {
    return Object.values(this.momentsSubject.value);
  }
  addMoment(moment: Moment): void {
    this.momentsSubject.next(addEntity(this.momentsSubject.value, moment));
  }
  updateMoment(id: string, changes: Partial<Moment>): void {
    this.momentsSubject.next(
      updateEntity(this.momentsSubject.value, id, changes),
    );
  }
  removeMoment(id: string): void {
    this.momentsSubject.next(removeEntity(this.momentsSubject.value, id));
  }
  // #endregion

  // #region 🔸 ITEMS 🔸
  private itemsSubject = new BehaviorSubject<Record<string, Item>>(
    Object.fromEntries(ITEMS_SEED.map((item) => [item.id, item])),
  );
  items$ = this.itemsSubject.asObservable();

  getItem(id: string): Item | undefined {
    return this.itemsSubject.value[id];
  }
  getAllItems(): Item[] {
    return Object.values(this.itemsSubject.value);
  }
  addItem(item: Item): void {
    this.itemsSubject.next(addEntity(this.itemsSubject.value, item));
  }
  updateItem(id: string, changes: Partial<Item>): void {
    this.itemsSubject.next(updateEntity(this.itemsSubject.value, id, changes));
  }
  removeItem(id: string): void {
    this.itemsSubject.next(removeEntity(this.itemsSubject.value, id));
  }
  // #endregion

  // #region 🔸 LOCATIONS 🔸
  private locationsSubject = new BehaviorSubject<Record<string, Location>>(
    Object.fromEntries(LOCATIONS_SEED.map((loc) => [loc.id, loc])),
  );
  locations$ = this.locationsSubject.asObservable();

  getLocation(id: string): Location | undefined {
    return this.locationsSubject.value[id];
  }
  getAllLocations(): Location[] {
    return Object.values(this.locationsSubject.value);
  }
  addLocation(location: Location): void {
    this.locationsSubject.next(
      addEntity(this.locationsSubject.value, location),
    );
  }
  updateLocation(id: string, changes: Partial<Location>): void {
    this.locationsSubject.next(
      updateEntity(this.locationsSubject.value, id, changes),
    );
  }
  removeLocation(id: string): void {
    this.locationsSubject.next(removeEntity(this.locationsSubject.value, id));
  }
  // #endregion

  // #region 🔸 CHARACTERS 🔸
  private charactersSubject = new BehaviorSubject<Record<string, Character>>(
    Object.fromEntries(CHARACTERS_SEED.map((char) => [char.id, char])),
  );
  characters$ = this.charactersSubject.asObservable();

  getCharacter(id: string): Character | undefined {
    return this.charactersSubject.value[id];
  }
  getAllCharacters(): Character[] {
    return Object.values(this.charactersSubject.value);
  }
  addCharacter(character: Character): void {
    this.charactersSubject.next(
      addEntity(this.charactersSubject.value, character),
    );
  }
  updateCharacter(id: string, changes: Partial<Character>): void {
    this.charactersSubject.next(
      updateEntity(this.charactersSubject.value, id, changes),
    );
  }
  removeCharacter(id: string): void {
    this.charactersSubject.next(removeEntity(this.charactersSubject.value, id));
  }
  // #endregion
}
