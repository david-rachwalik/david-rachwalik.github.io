import { Component, OnInit } from '@angular/core';
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
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class AboutComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
