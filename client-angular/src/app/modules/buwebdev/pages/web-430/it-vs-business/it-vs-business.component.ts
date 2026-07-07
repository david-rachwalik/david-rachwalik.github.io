import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-it-vs-business',
  templateUrl: './it-vs-business.component.html',
  styleUrls: ['./it-vs-business.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class ItVsBusinessComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
