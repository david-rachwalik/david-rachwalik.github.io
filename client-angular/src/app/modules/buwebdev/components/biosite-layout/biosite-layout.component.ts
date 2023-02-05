import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-biosite-layout',
  templateUrl: './biosite-layout.component.html',
  styleUrls: ['./biosite-layout.component.scss'],
  // ViewEncapsulation used for lazy loading module styles
  encapsulation: ViewEncapsulation.None,
})
export class BiositeLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
