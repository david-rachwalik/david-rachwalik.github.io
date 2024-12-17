import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-inner-card',
  templateUrl: './inner-card.component.html',
  styleUrls: ['./inner-card.component.css'],
  standalone: true,
  imports: [MatCard, MatCardTitle, NgIf, RouterLink, MatCardContent],
})
export class InnerCardComponent implements OnInit {
  @Input() flex = '';
  @Input() header = '';
  @Input() path = '';
  @Input() content = '';

  // constructor() {}

  ngOnInit(): void {}

  // https://stackoverflow.com/questions/4643142/regex-to-test-if-string-begins-with-http-or-https
  isHref(path: string): boolean {
    const regex: RegExp = /^(http|https):/;
    return regex.test(path);
  }
}
