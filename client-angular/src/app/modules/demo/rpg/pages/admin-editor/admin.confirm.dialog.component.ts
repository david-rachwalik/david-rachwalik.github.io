import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Confirm Deletion</h2>
    <mat-dialog-content class="dialog-content">
      <p style="color: #d1d5db; margin: 0;">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button class="action-btn outline-btn" [mat-dialog-close]="false">
        Cancel
      </button>
      <button
        class="action-btn danger-btn"
        [mat-dialog-close]="true"
        style="margin-left: 8px;">
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-title {
        color: #f3f4f6;
        margin: 0;
        background: #1e1e1e;
        padding: 1rem 1.5rem;
      }
      .dialog-content {
        padding: 1rem 1.5rem;
        background: #1e1e1e;
      }
      .dialog-actions {
        padding: 0.5rem 1.5rem 1rem;
        background: #1e1e1e;
        margin: 0;
      }
      .action-btn {
        background: transparent;
        padding: 0.4rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
      }
      .outline-btn {
        color: #9ca3af;
        border: 1px solid #6b7280;
      }
      .danger-btn {
        background: #ef4444;
        color: white;
        border: none;
      }
    `,
  ],
})
export class AdminConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
