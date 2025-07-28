import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-btn',
  standalone: true,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css'],
  imports: [MatIconModule],
})
export class IconBtnComponent {
  @Input() icon!: string;
  @Input() title = '';
  @Output() onClick = new EventEmitter<void>();
}
