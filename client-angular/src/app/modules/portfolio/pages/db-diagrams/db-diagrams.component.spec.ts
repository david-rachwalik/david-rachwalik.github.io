import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbDiagramsComponent } from './db-diagrams.component';

describe('DbDiagramsComponent', () => {
  let component: DbDiagramsComponent;
  let fixture: ComponentFixture<DbDiagramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbDiagramsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DbDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
