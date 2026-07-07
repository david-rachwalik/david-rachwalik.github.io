import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-biosite-layout',
  templateUrl: './biosite-layout.component.html',
  styleUrls: ['./biosite-layout.component.css'],
  // ViewEncapsulation used for lazy loading module styles
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, RouterLink],
})
export class BiositeLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
