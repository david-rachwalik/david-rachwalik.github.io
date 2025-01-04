import { TestBed } from '@angular/core/testing';

import { BackgroundStyleService } from './background.service';

describe('BackgroundService', () => {
  let service: BackgroundStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
