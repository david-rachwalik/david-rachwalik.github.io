import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, MatButton, RouterLink],
})
export class NotFoundComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {}
}
