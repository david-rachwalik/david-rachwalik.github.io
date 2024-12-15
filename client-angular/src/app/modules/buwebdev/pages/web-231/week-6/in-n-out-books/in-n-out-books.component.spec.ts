import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InNOutBooksComponent } from './in-n-out-books.component';

describe('InNOutBooksComponent', () => {
  let component: InNOutBooksComponent;
  let fixture: ComponentFixture<InNOutBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InNOutBooksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InNOutBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
