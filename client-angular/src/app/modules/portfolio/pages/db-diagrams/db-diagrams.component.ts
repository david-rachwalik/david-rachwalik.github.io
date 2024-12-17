import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-db-diagrams',
  templateUrl: './db-diagrams.component.html',
  styleUrls: ['./db-diagrams.component.css'],
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
export class DbDiagramsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
