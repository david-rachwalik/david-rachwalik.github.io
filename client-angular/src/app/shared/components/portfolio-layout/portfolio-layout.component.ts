import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-portfolio-layout',
  templateUrl: './portfolio-layout.component.html',
  styleUrls: ['./portfolio-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
// export class PortfolioLayoutComponent implements OnInit {
export class PortfolioLayoutComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  // ngOnInit(): void {}

  // https://stackoverflow.com/questions/46670795/how-to-change-whole-page-background-color-in-angular
  // https://angular.io/guide/lifecycle-hooks#lifecycle-event-sequence
  ngAfterViewInit() {
    try {
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
        '#ccffff';
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage =
        'linear-gradient(to bottom right, #ccffff, white)';
    } catch (e) {
      if (e instanceof Error /* CustomError */) {
        console.log(e.message);
      }
    }
  }

  ngOnDestroy() {
    try {
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
        'white';
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage =
        'none';
    } catch (e) {
      if (e instanceof Error /* CustomError */) {
        console.log(e.message);
      }
    }
  }
}
