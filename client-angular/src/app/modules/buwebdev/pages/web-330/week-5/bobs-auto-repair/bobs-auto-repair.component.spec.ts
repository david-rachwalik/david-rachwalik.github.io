import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BobsAutoRepairComponent } from './bobs-auto-repair.component';

describe('BobsAutoRepairComponent', () => {
  let component: BobsAutoRepairComponent;
  let fixture: ComponentFixture<BobsAutoRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BobsAutoRepairComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BobsAutoRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
