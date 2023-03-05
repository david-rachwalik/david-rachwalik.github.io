import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceGameComponent } from './sequence-game.component';

describe('SequenceGameComponent', () => {
  let component: SequenceGameComponent;
  let fixture: ComponentFixture<SequenceGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SequenceGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SequenceGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
