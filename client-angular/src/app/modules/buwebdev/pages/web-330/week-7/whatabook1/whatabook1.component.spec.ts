import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Whatabook1Component } from './whatabook1.component';

describe('Whatabook1Component', () => {
  let component: Whatabook1Component;
  let fixture: ComponentFixture<Whatabook1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Whatabook1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Whatabook1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
