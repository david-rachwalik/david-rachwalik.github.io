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
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class PortfolioHomeComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
