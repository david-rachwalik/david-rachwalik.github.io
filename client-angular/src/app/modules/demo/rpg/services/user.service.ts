import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { toId } from '../utils';
import { GUEST_ACCOUNT_ID } from '../utils-composite-id';

@Injectable({ providedIn: 'root' })
export class UserService {
  private accountIdSubject = new BehaviorSubject<string>(GUEST_ACCOUNT_ID);
  accountId$ = this.accountIdSubject.asObservable();

  get accountId(): string {
    // If logged in, return userAccountId
    // If guest with username, return `guest-<username>`
    // Otherwise, return 'guest'
    return this.accountIdSubject.value;
  }

  init(accountId?: string) {
    this.accountIdSubject.next(accountId ?? GUEST_ACCOUNT_ID);
  }

  setGuestUsername(username: string) {
    this.accountIdSubject.next(`guest-${toId(username)}`);
  }

  setLoggedInAccountId(id: string) {
    this.accountIdSubject.next(toId(id));
  }
}
