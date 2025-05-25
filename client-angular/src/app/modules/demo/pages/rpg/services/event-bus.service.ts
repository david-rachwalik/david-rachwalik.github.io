// src/app/services/event-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventLog$ = new Subject<string>();

  log(message: string): void {
    this.eventLog$.next(message);
  }

  onEvent() {
    return this.eventLog$.asObservable();
  }
}
