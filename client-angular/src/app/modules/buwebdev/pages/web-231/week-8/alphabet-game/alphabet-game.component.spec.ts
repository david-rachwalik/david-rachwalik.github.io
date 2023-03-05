import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetGameComponent } from './alphabet-game.component';

describe('AlphabetGameComponent', () => {
  let component: AlphabetGameComponent;
  let fixture: ComponentFixture<AlphabetGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphabetGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
