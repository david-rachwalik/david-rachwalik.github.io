import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'portfolio-inner-card',
  templateUrl: './inner-card.component.html',
  styleUrls: ['./inner-card.component.scss'],
})
export class InnerCardComponent implements OnInit {
  @Input() flex = '';
  @Input() header = '';
  @Input() path = '';
  @Input() content = '';

  constructor() {}

  ngOnInit(): void {}

  // https://stackoverflow.com/questions/4643142/regex-to-test-if-string-begins-with-http-or-https
  isHref(path: string): boolean {
    const regex: RegExp = /^(http|https):/;
    return regex.test(path);
  }
}
