import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-rpg-simple-demo',
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './rpg-simple-demo.component.html',
  styleUrls: ['./rpg-simple-demo.component.css'],
})
export class RpgSimpleDemoComponent {
  log: string[] = [];
  health = 100;
  targetDummyHealth = 100;
  inventory = ['Health Potion'];
  isAlive = true;

  addLog(message: string) {
    this.log.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  attack() {
    const dmg = Math.floor(Math.random() * 10) + 5;
    this.targetDummyHealth = Math.max(0, this.targetDummyHealth - dmg);
    this.addLog(`You attack the target dummy for ${dmg} damage.`);
  }

  takeDamage() {
    const dmg = Math.floor(Math.random() * 10) + 1;
    this.health = Math.max(0, this.health - dmg);
    this.addLog(`You take ${dmg} damage.`);
    if (this.health === 0) {
      this.isAlive = false;
      this.addLog('You have died.');
    }
  }

  useItem(item: string) {
    if (item === 'Health Potion') {
      this.health = Math.min(100, this.health + 30);
      this.inventory = this.inventory.filter((i) => i !== item);
      this.addLog('You used a Health Potion and restored 30 health.');
    }
  }

  reset() {
    this.health = 100;
    this.targetDummyHealth = 100;
    this.inventory = ['Health Potion'];
    this.isAlive = true;
    this.log = [];
    this.addLog('Game reset.');
  }
}
