import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceControlSecurityComponent } from './source-control-security.component';

describe('SourceControlSecurityComponent', () => {
  let component: SourceControlSecurityComponent;
  let fixture: ComponentFixture<SourceControlSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceControlSecurityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceControlSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
