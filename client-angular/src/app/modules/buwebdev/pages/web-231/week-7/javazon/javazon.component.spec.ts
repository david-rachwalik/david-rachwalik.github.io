import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JavazonComponent } from './javazon.component';

describe('JavazonComponent', () => {
  let component: JavazonComponent;
  let fixture: ComponentFixture<JavazonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavazonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JavazonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
