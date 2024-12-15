import { Component, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatDivider, RouterLink],
})
export class Web330HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
