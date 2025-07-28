import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BackgroundStyleService } from '@shared/services/background-style.service';
import { GameFacade } from '../../services/game-facade';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-rpg-demo-layout',
  templateUrl: './rpg-demo-layout.component.html',
  // styleUrls: ['./rpg-demo-layout.component.css'],
  // encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class RpgDemoLayoutComponent implements OnInit, OnDestroy {
  private readonly className = 'rpg-demo-bg';

  constructor(
    private bgService: BackgroundStyleService,
    private userService: UserService,
    private game: GameFacade,
  ) {}

  // ngOnInit(): void {
  //   console.log('RpgDemoLayoutComponent -- ngOnInit');
  //   this.bgService.storeOriginalStyles();
  //   this.bgService.setBackgroundStyles(
  //     '#181420', // color: matches rgba(24,20,32,0.7) solid
  //     "linear-gradient(to top, #1a232a 0%, #2c3e50 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat",
  //     'fixed',
  //   );
  // }

  // ngOnDestroy(): void {
  //   this.bgService.restoreOriginalStyles();
  // }

  ngOnInit(): void {
    this.bgService.addBodyClass(this.className);
    this.userService.init();
    this.game.init(); // ready the RPG Demo app
  }

  ngOnDestroy(): void {
    this.bgService.removeBodyClass(this.className);
  }
}
