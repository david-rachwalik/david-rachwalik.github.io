import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface NewGameDialogDetails {
  label: string;
  characterName: string;
}

@Component({
  standalone: true,
  selector: 'app-new-game-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './new-game-dialog.component.html',
  // styleUrls: ['./new-game-dialog.component.css'],
})
export class NewGameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: NewGameDialogDetails,
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onStart() {
    this.dialogRef.close(this.data);
  }
}
