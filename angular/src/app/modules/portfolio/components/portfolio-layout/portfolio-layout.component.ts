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
  // TODO: remove below line if styles no longer need to be global to work
  // ViewEncapsulation used for lazy loading module styles
  encapsulation: ViewEncapsulation.None,
})
// export class PortfolioLayoutComponent implements OnInit {
export class PortfolioLayoutComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  // ngOnInit(): void {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      '#ccffff';
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage =
      'linear-gradient(to bottom right, #ccffff, white)';
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      'white';
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage =
      'none';
  }
}
