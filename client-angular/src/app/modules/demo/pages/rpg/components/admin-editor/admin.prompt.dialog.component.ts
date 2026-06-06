import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-prompt-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Create New Asset</h2>
    <mat-dialog-content class="dialog-content">
      <label style="color: #d1d5db; display: block; margin-bottom: 0.5rem">{{
        data.label
      }}</label>
      <input
        type="text"
        [(ngModel)]="value"
        style="width: 100%; padding: 0.5rem; background: #121212; border: 1px solid #4b5563; color: white;"
        autofocus />
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button class="action-btn outline-btn" mat-dialog-close>Cancel</button>
      <button
        class="action-btn solid-btn"
        [mat-dialog-close]="value"
        style="margin-left: 8px;">
        Create
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
      .solid-btn {
        background: #10b981;
        color: white;
        border: none;
      }
    `,
  ],
})
export class AdminPromptDialogComponent {
  value = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: { label: string }) {}
}
