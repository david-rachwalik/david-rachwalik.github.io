import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiositeLayoutComponent } from './biosite-layout.component';

describe('BiositeLayoutComponent', () => {
  let component: BiositeLayoutComponent;
  let fixture: ComponentFixture<BiositeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiositeLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiositeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
