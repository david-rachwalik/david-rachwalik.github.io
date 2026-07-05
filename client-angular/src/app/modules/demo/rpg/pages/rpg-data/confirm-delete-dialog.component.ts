import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Delete Save?</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to delete the save "<b>{{ data.label }}</b
        >"?
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { label: string },
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
  ) {}
}
