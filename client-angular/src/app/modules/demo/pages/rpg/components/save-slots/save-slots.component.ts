import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { SaveSlot } from '../../models/save-slot';
import { GameSaveService } from '../../services/game-save.service';

// save-slots-page.component.ts
@Component({
  standalone: true,
  selector: 'app-save-slots',
  imports: [CommonModule],
  templateUrl: './save-slots.component.html',
})
export class SaveSlotsPageComponent implements OnInit {
  saveSlots: SaveSlot[] = [];

  constructor(private saveService: GameSaveService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  load(name: string) {
    const slot = this.saveService.load(name);
    if (slot) {
      // TODO: dispatch to GameFacade or navigate
      console.log('Loaded slot:', slot);
    }
  }

  delete(name: string) {
    this.saveService.delete(name);
    this.refreshList();
  }

  refreshList() {
    this.saveSlots = this.saveService.listSaves();
  }
}
