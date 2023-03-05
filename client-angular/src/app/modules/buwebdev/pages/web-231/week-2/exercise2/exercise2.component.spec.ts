import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercise2Component } from './exercise2.component';

describe('Exercise2Component', () => {
  let component: Exercise2Component;
  let fixture: ComponentFixture<Exercise2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Exercise2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exercise2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
