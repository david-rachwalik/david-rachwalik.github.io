import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SubheaderComponent } from './subheader/subheader.component';

@Component({
  selector: 'app-portfolio-layout',
  templateUrl: './portfolio-layout.component.html',
  styleUrls: ['./portfolio-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [HeaderComponent, SubheaderComponent, RouterOutlet, FooterComponent],
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
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundAttachment =
        'fixed';
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
