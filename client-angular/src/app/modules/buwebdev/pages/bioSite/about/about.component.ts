import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
