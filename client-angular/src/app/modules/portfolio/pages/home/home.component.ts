import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'portfolio-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class PortfolioHomeComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
