import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './api-tests.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  // constructor() {}

  ngOnInit(): void {}
}
