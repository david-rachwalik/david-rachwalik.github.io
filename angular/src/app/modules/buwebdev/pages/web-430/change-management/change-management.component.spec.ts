import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeManagementComponent } from './change-management.component';

describe('ChangeManagementComponent', () => {
  let component: ChangeManagementComponent;
  let fixture: ComponentFixture<ChangeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
