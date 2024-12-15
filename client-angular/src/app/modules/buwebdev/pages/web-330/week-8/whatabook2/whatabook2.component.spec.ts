import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Whatabook2Component } from './whatabook2.component';

describe('Whatabook2Component', () => {
  let component: Whatabook2Component;
  let fixture: ComponentFixture<Whatabook2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Whatabook2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Whatabook2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
