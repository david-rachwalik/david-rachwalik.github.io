import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-subheader',
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
})
export class SubheaderComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
