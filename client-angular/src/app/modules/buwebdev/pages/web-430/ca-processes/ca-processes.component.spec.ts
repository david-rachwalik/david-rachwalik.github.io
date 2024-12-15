import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaProcessesComponent } from './ca-processes.component';

describe('CaProcessesComponent', () => {
  let component: CaProcessesComponent;
  let fixture: ComponentFixture<CaProcessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaProcessesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
