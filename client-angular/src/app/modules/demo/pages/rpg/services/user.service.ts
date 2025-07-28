import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { toId } from '../utils';

@Injectable({ providedIn: 'root' })
export class UserService {
  private accountIdSubject = new BehaviorSubject<string>('guest');
  accountId$ = this.accountIdSubject.asObservable();

  get accountId(): string {
    // If logged in, return userAccountId
    // If guest with username, return `guest-<username>`
    // Otherwise, return 'guest'
    return this.accountIdSubject.value;
  }

  init(accountId?: string) {
    this.accountIdSubject.next(accountId ?? 'guest');
  }

  setGuestUsername(username: string) {
    this.accountIdSubject.next(`guest-${toId(username)}`);
  }

  setLoggedInAccountId(id: string) {
    this.accountIdSubject.next(toId(id));
  }
}
