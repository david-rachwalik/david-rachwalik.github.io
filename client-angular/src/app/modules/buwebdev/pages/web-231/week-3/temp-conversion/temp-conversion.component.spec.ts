import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempConversionComponent } from './temp-conversion.component';

describe('TempConversionComponent', () => {
  let component: TempConversionComponent;
  let fixture: ComponentFixture<TempConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempConversionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
