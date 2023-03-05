import { Component } from '@angular/core';

@Component({
  selector: 'app-exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.css'],
})
export class Exercise2Component {
  // Exercise 2.2
  courseAlert() {
    alert('WEB 231 - Enterprise JavaScript I');
  }
  // document.getElementById('btnMyCourse').addEventListener('click', courseAlert);
}
