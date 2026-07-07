import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-change-management',
  templateUrl: './change-management.component.html',
  styleUrls: ['./change-management.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class ChangeManagementComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
