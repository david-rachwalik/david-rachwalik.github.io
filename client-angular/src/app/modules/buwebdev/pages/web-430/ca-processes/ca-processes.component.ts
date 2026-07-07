import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-ca-processes',
  templateUrl: './ca-processes.component.html',
  styleUrls: ['./ca-processes.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class CaProcessesComponent implements OnInit {
  // constructor() { }

  ngOnInit(): void {}
}
