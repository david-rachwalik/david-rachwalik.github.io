import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class SubheaderComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
