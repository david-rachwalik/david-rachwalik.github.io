import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-rpg-demo',
  templateUrl: './rpg-demo.component.html',
  styleUrls: ['./rpg-demo.component.css'],
})
export class RpgDemoComponent {
  private router = inject(Router);

  async newGame() {
    // Pass a flag to the play page to trigger new game flow
    await this.router.navigate(['/demo/rpg/play'], {
      queryParams: { new: '1' },
    });
  }

  async continueGame() {
    await this.router.navigate(['/demo/rpg/data']);
  }

  async openSettings() {
    await this.router.navigate(['/demo/rpg/profile']);
  }
}
