import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureValueComponent } from './future-value.component';

describe('FutureValueComponent', () => {
  let component: FutureValueComponent;
  let fixture: ComponentFixture<FutureValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
