import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-btn',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule],
})
export class IconBtnComponent {
  @Input() icon!: string;
  @Input() title = '';
  @Output() onClick = new EventEmitter<void>();
}
