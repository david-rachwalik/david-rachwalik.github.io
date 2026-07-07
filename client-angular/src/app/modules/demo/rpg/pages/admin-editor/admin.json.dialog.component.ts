import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface SeedDialogData {
  json: string;
}

@Component({
  selector: 'app-seed-json-dialog',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Seed JSON Export</h2>
    <mat-dialog-content class="dialog-content">
      <textarea
        [value]="data.json"
        readonly
        class="json-textarea"
        spellcheck="false"></textarea>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button class="action-btn copy-btn" (click)="copyToClipboard()">
        📋 Copy
      </button>
      <button class="action-btn close-btn" mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
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
      .json-textarea {
        width: 100%;
        height: 400px;
        background: #121212;
        color: #a6e22e;
        font-family: ui-monospace, monospace;
        font-size: 11px;
        padding: 1rem;
        border: 1px solid #333;
        border-radius: 4px;
        resize: vertical;
        box-sizing: border-box;
      }
      .action-btn {
        background: transparent;
        padding: 0.4rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        transition: background 0.2s;
      }
      .copy-btn {
        color: #60a5fa;
        border: 1px solid #3b82f6;
        margin-right: 8px;
      }
      .copy-btn:hover {
        background: rgba(59, 130, 246, 0.15);
      }
      .close-btn {
        color: #9ca3af;
        border: 1px solid #6b7280;
      }
      .close-btn:hover {
        background: rgba(107, 114, 128, 0.15);
      }
    `,
  ],
})
export class SeedJsonDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SeedDialogData,
    private dialogRef: MatDialogRef<SeedJsonDialogComponent>,
  ) {}

  copyToClipboard(): void {
    navigator.clipboard
      .writeText(this.data.json)
      .then(() => console.log('[Dialog] Copied JSON'))
      .catch((err: unknown) => console.error('[Dialog] Copy failed: ', err));
  }
}
