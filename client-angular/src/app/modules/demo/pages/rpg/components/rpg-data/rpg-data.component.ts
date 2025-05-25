import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { SaveSlot } from '../../models/save-slot';
import { GameSaveService } from '../../services/game-save.service';

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
  styleUrls: ['./rpg-data.component.css'],
})
export class RpgDataComponent {
  private saveService = inject(GameSaveService);
  private router = inject(Router);

  currentSave: SaveSlotDisplay | undefined = undefined;
  otherSaves: SaveSlotDisplay[] = [];
  confirmDeleteId: string | undefined = undefined;

  ngOnInit() {
    const allSaves = this.saveService.listSaves().map(this.mapSaveSlot);
    allSaves.sort((a, b) => a.label.localeCompare(b.label));
    this.currentSave =
      allSaves.find((s) => s.id === this.saveService.getCurrentSaveId()) ??
      undefined;
    this.otherSaves = allSaves.filter((s) => s.id !== this.currentSave?.id);
  }

  // Use arrow function to bind `this`
  mapSaveSlot = (slot: SaveSlot): SaveSlotDisplay => {
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

  async loadSave(id: string) {
    this.saveService.load(id);
    await this.router.navigate(['/demo/rpg/play']);
  }

  confirmDelete(id: string) {
    this.confirmDeleteId = id;
    // show modal or use Angular Material Dialog
  }

  deleteSave(id: string) {
    this.saveService.deleteSlot(id);
    this.confirmDeleteId = undefined;
    this.closeModal();
    this.ngOnInit(); // reload saves
  }

  closeModal() {
    this.confirmDeleteId = undefined;
  }
}
