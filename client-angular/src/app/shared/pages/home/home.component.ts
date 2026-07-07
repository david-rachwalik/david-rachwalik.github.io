import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { MatDivider } from '@angular/material/divider';
// import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss',
  // imports: [MatDivider, RouterLink],
})
export class HomeComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
