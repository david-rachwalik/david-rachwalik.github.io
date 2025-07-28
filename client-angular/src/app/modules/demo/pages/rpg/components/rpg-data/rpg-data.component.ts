import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

import { AdventureIndex } from '../../models/adventure';
import { GameFacade } from '../../services/game-facade';
import { selectAllAdventureIndexes } from '../../store/adventure/adventure-index.selectors';
import { AppActions } from '../../store/app.actions';
import { selectCurrentSlotId } from '../../store/app.selectors';
import { IconBtnComponent } from '../icon-button/icon-button.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'app-rpg-data',
  imports: [CommonModule, IconBtnComponent],
  templateUrl: './rpg-data.component.html',
  // styleUrls: ['./rpg-data.component.css'],
  styles: `
    .save-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5em;
      gap: 1em;
    }
  `,
})
export class RpgDataComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private store = inject(Store);
  private game = inject(GameFacade);

  currentSlotId$ = this.store.select(selectCurrentSlotId);

  allSaves$ = this.store.select(selectAllAdventureIndexes);
  // adventureEntities$ = this.store.select(selectAdventureEntities);

  currentSave$: Observable<AdventureIndex | undefined> = combineLatest([
    this.allSaves$,
    this.currentSlotId$,
  ]).pipe(
    map(([allSaves, currentSlotId]) =>
      allSaves.find((s) => s.id === currentSlotId),
    ),
  );

  otherSaves$: Observable<AdventureIndex[]> = combineLatest([
    this.allSaves$,
    this.currentSlotId$,
  ]).pipe(
    map(
      ([allSaves, currentSlotId]) =>
        allSaves
          .filter((s) => s.id !== currentSlotId)
          // .sort((a, b) => a.label.localeCompare(b.label)),
          .sort((a, b) => b.savedAt.localeCompare(a.savedAt)), // Sort by most recent
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

  async continueGame() {
    await this.router.navigate(['/demo/rpg/play']);
  }

  async newGame() {
    await this.router.navigate(['/demo/rpg/new-game']);
  }

  activateSave(slotId: string) {
    this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));
  }

  onUploadFile(event: Event) {
    console.log('[Upload] File input changed');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('[Upload] File selected:', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('[Upload] FileReader loaded:', e);
        try {
          const text = e.target?.result as string;
          console.log('[Upload] File contents:', text.slice(0, 200)); // log first 200 chars
          // Dispatch NgRx action or call service
          this.store.dispatch(AppActions.uploadSave({ file }));
          console.log('[Upload] Dispatched uploadSave action');
        } catch (err) {
          console.error('[Upload] Error reading file:', err);
        }
      };
      reader.onerror = (e) => {
        console.error('[Upload] FileReader error:', e);
      };
      reader.readAsText(file);
    } else {
      console.warn('[Upload] No file selected');
    }
  }

  downloadSave(slotId: string) {
    this.store.dispatch(AppActions.downloadSave({ slotId }));
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
    await this.game.deleteGame(id);
  }
}
