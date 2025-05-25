import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BackgroundStyleService } from '@shared/services/background-style.service';

@Component({
  selector: 'app-rpg-demo-layout',
  templateUrl: './rpg-demo-layout.component.html',
  // styleUrls: ['./rpg-demo-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class RpgDemoLayoutComponent implements OnInit, OnDestroy {
  constructor(private bgService: BackgroundStyleService) {}

  ngOnInit(): void {
    this.bgService.storeOriginalStyles();
    this.bgService.setBackgroundStyles(
      '#181420', // color: matches rgba(24,20,32,0.7) solid
      "linear-gradient(to top, #1a232a 0%, #2c3e50 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat",
      'fixed',
    );
  }

  ngOnDestroy(): void {
    this.bgService.restoreOriginalStyles();
  }
}
