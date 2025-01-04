import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: PortfolioHomeComponent;
  let fixture: ComponentFixture<PortfolioHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
