import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class AboutComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
