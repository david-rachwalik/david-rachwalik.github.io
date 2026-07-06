import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink],
})
export class HeaderComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
