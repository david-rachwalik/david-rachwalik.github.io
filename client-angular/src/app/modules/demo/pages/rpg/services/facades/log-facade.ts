import { Injectable } from '@angular/core';

import { RpgLogService } from '../rpg-log.service';

@Injectable({ providedIn: 'root' })
export class LogFacade {
  constructor(private logService: RpgLogService) {}

  entries$ = this.logService.entries$;

  async log(message: string) {
    await this.logService.add(message);
  }
}
