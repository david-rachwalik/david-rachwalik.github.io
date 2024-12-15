import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-biosite-layout',
  templateUrl: './biosite-layout.component.html',
  styleUrls: ['./biosite-layout.component.css'],
  // ViewEncapsulation used for lazy loading module styles
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet, RouterLink],
})
export class BiositeLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
