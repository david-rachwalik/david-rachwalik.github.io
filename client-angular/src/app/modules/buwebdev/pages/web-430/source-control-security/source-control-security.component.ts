import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-source-control-security',
  templateUrl: './source-control-security.component.html',
  styleUrls: ['./source-control-security.component.css'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class SourceControlSecurityComponent implements OnInit {
  // constructor() { }

  ngOnInit(): void {}
}
