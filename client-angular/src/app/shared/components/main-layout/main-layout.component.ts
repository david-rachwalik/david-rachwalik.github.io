import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { BackgroundStyleService } from '@shared/services/background-style.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIcon, MatSlideToggle],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private backgroundStyleSubscription!: Subscription;
  currentYear = 0;

  constructor(private backgroundStyleService: BackgroundStyleService) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.backgroundStyleService.storeOriginalStyles();
    this.backgroundStyleService.setBackgroundStyles(
      '#ccffff',
      'linear-gradient(to bottom right, #ccffff, white)',
      'fixed',
    );
    // this.backgroundService.setBackgroundStyles(
    //   '#800020',
    //   'linear-gradient(to bottom right, #800020, #66001a)',
    //   'fixed',
    // );

    // Subscribe to background style updates
    this.backgroundStyleSubscription =
      this.backgroundStyleService.backgroundStyle$.subscribe((styles) => {
        console.log('Background styles updated:', styles);
      });
  }

  ngOnDestroy(): void {
    this.backgroundStyleService.restoreOriginalStyles();

    // Unsubscribe to avoid memory leaks
    if (this.backgroundStyleSubscription) {
      this.backgroundStyleSubscription.unsubscribe();
    }
  }
}
