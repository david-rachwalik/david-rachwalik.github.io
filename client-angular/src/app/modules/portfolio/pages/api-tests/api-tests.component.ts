import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-api-tests',
  templateUrl: './api-tests.component.html',
  styleUrls: ['./api-tests.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatTabGroup,
    MatTab,
  ],
})
export class ApiTestsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
