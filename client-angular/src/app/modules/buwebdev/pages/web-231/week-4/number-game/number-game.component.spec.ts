import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberGameComponent } from './number-game.component';

describe('NumberGameComponent', () => {
  let component: NumberGameComponent;
  let fixture: ComponentFixture<NumberGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
