import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { SaveSlot } from '../../models/save-slot';
import { GameSaveService } from '../../services/game-save.service';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

interface SaveSlotDisplay {
  id: string;
  label: string;
  playerName: string;
  level: number;
  location?: string;
  size: number;
  lastPlayed: Date;
}

@Component({
  standalone: true,
  selector: 'app-rpg-data',
  imports: [CommonModule],
  templateUrl: './rpg-data.component.html',
  // styleUrls: ['./rpg-data.component.css'],
})
export class RpgDataComponent {
  private saveService = inject(GameSaveService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  currentSave: SaveSlotDisplay | undefined = undefined;
  otherSaves: SaveSlotDisplay[] = [];

  ngOnInit() {
    const allSaves = this.saveService.listSaves().map(this.mapSlotDisplay);
    allSaves.sort((a, b) => a.label.localeCompare(b.label));
    this.currentSave =
      allSaves.find((s) => s.id === this.saveService.currentSlotId) ??
      undefined;
    this.otherSaves = allSaves.filter((s) => s.id !== this.currentSave?.id);
  }

  // Use arrow function to bind `this`
  mapSlotDisplay = (slot: SaveSlot): SaveSlotDisplay => {
    const player = slot.state?.characters?.[0] ?? {};
    return {
      id: slot.id,
      label: slot.label || 'Unnamed Save',
      playerName: player.name || 'Unknown',
      // level: player.level || 1,
      // level: (player.attributes?.['level'] as number) || 1,
      level: Number(player.attributes?.['level']) || 1,
      location: player.location,
      size: Math.round(slot.sizeKB || JSON.stringify(slot).length / 1024),
      lastPlayed: new Date(slot.savedAt),
    };
  };

  async continueGame() {
    await this.router.navigate(['/demo/rpg/play']);
  }

  async newGame() {
    await this.router.navigate(['/demo/rpg/new-game']);
  }

  activateSave(id: string) {
    this.saveService.setCurrentSlotId(id);
    // Optionally, reload the saves to update the UI
    this.ngOnInit();
  }

  async confirmDelete(id: string) {
    console.log('[RpgData] Delete requested for slot:', id);

    const save = this.otherSaves.find((s) => s.id === id) || this.currentSave;
    if (!save) {
      console.warn('[RpgData] Save not found for id:', id);
      return;
    }

    console.log('[RpgData] Opening confirm dialog for:', save.label);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { label: save.label },
    });

    const result = (await firstValueFrom(dialogRef.afterClosed())) as boolean;
    console.log('[RpgData] Dialog closed. User confirmed delete:', result);

    if (result) {
      this.deleteSave(id);
    } else {
      console.log('[RpgData] Delete cancelled by user.');
    }
  }

  deleteSave(id: string) {
    console.log('[RpgData] Deleting save slot:', id);
    this.saveService.delete(id);
    this.ngOnInit(); // reload saves
    console.log('[RpgData] Save slot deleted and UI refreshed.');
  }
}
