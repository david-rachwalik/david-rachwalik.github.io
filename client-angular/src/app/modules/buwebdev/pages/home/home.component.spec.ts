import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuwebdevHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: BuwebdevHomeComponent;
  let fixture: ComponentFixture<BuwebdevHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuwebdevHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuwebdevHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
