import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioLayoutComponent } from './portfolio-layout.component';

describe('PortfolioLayoutComponent', () => {
  let component: PortfolioLayoutComponent;
  let fixture: ComponentFixture<PortfolioLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
