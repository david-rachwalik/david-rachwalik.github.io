import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItVsBusinessComponent } from './it-vs-business.component';

describe('ItVsBusinessComponent', () => {
  let component: ItVsBusinessComponent;
  let fixture: ComponentFixture<ItVsBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItVsBusinessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItVsBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
