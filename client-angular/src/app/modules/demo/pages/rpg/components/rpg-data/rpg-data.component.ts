import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

import { AdventureIndex } from '../../models/adventure';
import { GameFacade } from '../../services/game-facade';
import { selectAllAdventureIndexes } from '../../store/adventure/adventure-index.reducer';
import { AppActions } from '../../store/app.actions';
import { selectCurrentSlotId } from '../../store/app.selectors';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

// interface SaveSlotDisplay {
//   id: string;
//   label: string;
//   playerName: string;
//   level: number;
//   location?: string;
//   size: number;
//   lastPlayed: Date;
// }

@Component({
  standalone: true,
  selector: 'app-rpg-data',
  imports: [CommonModule],
  templateUrl: './rpg-data.component.html',
  // styleUrls: ['./rpg-data.component.css'],
})
export class RpgDataComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private store = inject(Store);
  private game = inject(GameFacade);

  currentSlotId$ = this.store.select(selectCurrentSlotId);

  // allSaves$: Observable<AdventureIndex[]> = new Observable((subscriber) => {
  //   subscriber.next(this.saveService.listSaves());
  //   subscriber.complete();
  // });
  // allSaves$ = this.store
  //   .select(selectAllAdventureIndexes)
  //   .subscribe((slots) => subscriber.next(slots));
  allSaves$ = this.store.select(selectAllAdventureIndexes);
  // adventureEntities$ = this.store.select(selectAdventureEntities);

  // currentSave$: Observable<SaveSlotDisplay | undefined> = combineLatest([
  //   this.allSaves$,
  //   this.currentSlotId$,
  //   this.adventureEntities$,
  // ]).pipe(
  //   map(([allSaves, currentSlotId, adventures]) => {
  //     const slot = allSaves.find((s) => s.id === currentSlotId);
  //     const adventure = slot ? adventures[slot.id] : undefined;
  //     return slot && adventure
  //       ? this.mapSlotDisplay(slot, adventure)
  //       : undefined;
  //   }),
  // );
  currentSave$: Observable<AdventureIndex | undefined> = combineLatest([
    this.allSaves$,
    this.currentSlotId$,
  ]).pipe(
    map(([allSaves, currentSlotId]) =>
      allSaves.find((s) => s.id === currentSlotId),
    ),
  );

  // otherSaves$: Observable<SaveSlotDisplay[]> = combineLatest([
  //   this.allSaves$,
  //   this.currentSlotId$,
  //   this.adventureEntities$,
  // ]).pipe(
  //   map(([allSaves, currentSlotId, adventures]) =>
  //     allSaves
  //       .filter((s) => s.id !== currentSlotId)
  //       .map((slot) => {
  //         const adventure = adventures[slot.id];
  //         return adventure ? this.mapSlotDisplay(slot, adventure) : undefined;
  //       })
  //       .filter((v): v is SaveSlotDisplay => !!v)
  //       .sort((a, b) => a.label.localeCompare(b.label)),
  //   ),
  // );
  otherSaves$: Observable<AdventureIndex[]> = combineLatest([
    this.allSaves$,
    this.currentSlotId$,
  ]).pipe(
    map(([allSaves, currentSlotId]) =>
      allSaves
        .filter((s) => s.id !== currentSlotId)
        .sort((a, b) => a.label.localeCompare(b.label)),
    ),
  );

  // --- Methods ---

  ngOnInit() {
    this.currentSlotId$.subscribe((val) =>
      console.log('[RpgData] Loaded currentSlotId:', val),
    );
    // const val = await firstValueFrom(this.currentSlotId$);
    // console.log('[RpgData] Loaded currentSlotId:', val);
  }

  // // Uses arrow function to bind `this`
  // mapSlotDisplay = (
  //   index: AdventureIndex,
  //   adventure: Adventure,
  // ): SaveSlotDisplay => {
  //   const player = adventure.characters?.[0] ?? {};
  //   return {
  //     id: index.id,
  //     label: index.label || 'Unnamed Save',
  //     playerName: player.name || 'Unknown',
  //     level: Number(player.attributes?.['level']) || 1,
  //     location: player.location,
  //     size: Math.round(index.sizeKB || JSON.stringify(adventure).length / 1024),
  //     lastPlayed: new Date(index.savedAt),
  //   };
  // };

  async continueGame() {
    await this.router.navigate(['/demo/rpg/play']);
  }

  async newGame() {
    await this.router.navigate(['/demo/rpg/new-game']);
  }

  activateSave(slotId: string) {
    // this.saveService.saveCurrentSlotId(id);
    this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));
  }

  async confirmDelete(id: string) {
    console.log('[RpgData] Delete requested for slot:', id);
    const allSaves = await firstValueFrom(this.allSaves$);
    const slot = allSaves.find((s) => s.id === id);
    if (!slot) {
      console.warn('[RpgData] Save not found for id:', id);
      return;
    }

    console.log('[RpgData] Opening confirm dialog for:', slot.label);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { label: slot.label },
    });

    const result = (await firstValueFrom(dialogRef.afterClosed())) as boolean;
    console.log('[RpgData] Dialog closed. User confirmed delete:', result);
    if (result) {
      await this.deleteSave(id);
    } else {
      console.log('[RpgData] Delete cancelled by user.');
    }
  }

  async deleteSave(id: string) {
    console.log('[RpgData] Deleting save slot:', id);
    // this.saveService.delete(id);
    await this.game.deleteGame(id);
    // Optionally, trigger reload or dispatch action if needed
  }
}
