import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-portfolio-layout',
  templateUrl: './portfolio-layout.component.html',
  styleUrls: ['./portfolio-layout.component.scss'],
  // TODO: remove below line if styles no longer need to be global to work
  // ViewEncapsulation used for lazy loading module styles
  encapsulation: ViewEncapsulation.None,
})
export class PortfolioLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
