import { Component, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'buwebdev-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [MatDivider, RouterLink],
})
export class BuwebdevHomeComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
