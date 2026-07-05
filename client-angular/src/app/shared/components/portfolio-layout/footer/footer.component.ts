import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'portfolio-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
})
export class FooterComponent implements OnInit {
  currentYear = 0;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {}
}
