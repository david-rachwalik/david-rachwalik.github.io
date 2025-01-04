import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuwebdevLayoutComponent } from './buwebdev-layout.component';

describe('BuwebdevLayoutComponent', () => {
  let component: BuwebdevLayoutComponent;
  let fixture: ComponentFixture<BuwebdevLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuwebdevLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuwebdevLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
