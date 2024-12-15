import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { Employee } from './models/exployee.model';
import { Product } from './models/product.model';
import { Service } from './models/service.model';

@Component({
  selector: 'app-javazon',
  templateUrl: './javazon.component.html',
  styleUrls: ['./javazon.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    FormsModule,
    MatButton,
    RouterLink,
  ],
})
export class JavazonComponent implements OnInit {
  ngOnInit(): void {
    // Initialize classes
    const product1 = new Product(
      9781118008188,
      'HTML and CSS: Design and Build Websites',
      22.26,
      10,
    );
    const product2 = new Product(
      9781491952023,
      'JavaScript - The Definitive Guide 7/E',
      41.33,
      7,
    );
    const product3 = new Product(
      9781449331818,
      'Learning JavaScript Design Patterns 1/E',
      25.99,
      3,
    );
    const product4 = new Product(
      9781617292422,
      'Express in Action: Writing, building, and testing Node.js applications 1/E',
      34.91,
      3,
    );
    const product5 = new Product(
      9781491954461,
      'MongoDB The Definitive Guide',
      33.7,
      8,
    );
    const service1 = new Service(100, 'Website Design', 150, 25);
    const service2 = new Service(101, 'DevOps Consulting', 125, 50);
    const service3 = new Service(102, 'Database Design', 125, 15);
    const employee1 = new Employee(1007, 'Beethoven', 'Ludwig', 13.99);
    const employee2 = new Employee(1008, 'Bach', 'Johann', 22.3);
    const employee3 = new Employee(1009, 'Mozart', 'Wolfgang', 19.5);
    const employee4 = new Employee(1010, 'Brahms', 'Johannes', 12);
    const employee5 = new Employee(1011, 'Haydn', 'Joseph', 32.5);

    // -------- Populate Table Values (Products) --------
    this.applyHTML('txtProduct1Id', product1.id.toString());
    this.applyHTML('txtProduct1Description', product1.description);
    this.applyHTML('txtProduct1Price', product1.price.toFixed(2));
    this.applyHTML('txtProduct1Quantity', product1.quantity.toString());
    this.applyHTML('txtProduct1TotalValue', product1.totalValue().toFixed(2));

    this.applyHTML('txtProduct2Id', product2.id.toString());
    this.applyHTML('txtProduct2Description', product2.description);
    this.applyHTML('txtProduct2Price', product2.price.toFixed(2));
    this.applyHTML('txtProduct2Quantity', product2.quantity.toString());
    this.applyHTML('txtProduct2TotalValue', product2.totalValue().toFixed(2));

    this.applyHTML('txtProduct3Id', product3.id.toString());
    this.applyHTML('txtProduct3Description', product3.description);
    this.applyHTML('txtProduct3Price', product3.price.toFixed(2));
    this.applyHTML('txtProduct3Quantity', product3.quantity.toString());
    this.applyHTML('txtProduct3TotalValue', product3.totalValue().toFixed(2));

    this.applyHTML('txtProduct4Id', product4.id.toString());
    this.applyHTML('txtProduct4Description', product4.description);
    this.applyHTML('txtProduct4Price', product4.price.toFixed(2));
    this.applyHTML('txtProduct4Quantity', product4.quantity.toString());
    this.applyHTML('txtProduct4TotalValue', product4.totalValue().toFixed(2));

    this.applyHTML('txtProduct5Id', product5.id.toString());
    this.applyHTML('txtProduct5Description', product5.description);
    this.applyHTML('txtProduct5Price', product5.price.toFixed(2));
    this.applyHTML('txtProduct5Quantity', product5.quantity.toString());
    this.applyHTML('txtProduct5TotalValue', product5.totalValue().toFixed(2));

    // -------- Populate Table Values (Services) --------
    this.applyHTML('txtService1Id', service1.id.toString());
    this.applyHTML('txtService1Description', service1.description);
    this.applyHTML('txtService1HourlyRate', service1.hourlyRate.toFixed(2));
    this.applyHTML('txtService1Min', service1.min.toString());

    this.applyHTML('txtService2Id', service2.id.toString());
    this.applyHTML('txtService2Description', service2.description);
    this.applyHTML('txtService2HourlyRate', service2.hourlyRate.toFixed(2));
    this.applyHTML('txtService2Min', service2.min.toString());

    this.applyHTML('txtService3Id', service3.id.toString());
    this.applyHTML('txtService3Description', service3.description);
    this.applyHTML('txtService3HourlyRate', service3.hourlyRate.toFixed(2));
    this.applyHTML('txtService3Min', service3.min.toString());

    this.applyHTML('txtEmployee1Id', employee1.id.toString());
    this.applyHTML('txtEmployee1FirstName', employee1.firstName);
    this.applyHTML('txtEmployee1LastName', employee1.lastName);
    this.applyHTML('txtEmployee1Salary', employee1.salary.toFixed(2));

    this.applyHTML('txtEmployee2Id', employee2.id.toString());
    this.applyHTML('txtEmployee2FirstName', employee2.firstName);
    this.applyHTML('txtEmployee2LastName', employee2.lastName);
    this.applyHTML('txtEmployee2Salary', employee2.salary.toFixed(2));

    this.applyHTML('txtEmployee3Id', employee3.id.toString());
    this.applyHTML('txtEmployee3FirstName', employee3.firstName);
    this.applyHTML('txtEmployee3LastName', employee3.lastName);
    this.applyHTML('txtEmployee3Salary', employee3.salary.toFixed(2));

    this.applyHTML('txtEmployee4Id', employee4.id.toString());
    this.applyHTML('txtEmployee4FirstName', employee4.firstName);
    this.applyHTML('txtEmployee4LastName', employee4.lastName);
    this.applyHTML('txtEmployee4Salary', employee4.salary.toFixed(2));

    this.applyHTML('txtEmployee5Id', employee5.id.toString());
    this.applyHTML('txtEmployee5FirstName', employee5.firstName);
    this.applyHTML('txtEmployee5LastName', employee5.lastName);
    this.applyHTML('txtEmployee5Salary', employee5.salary.toFixed(2));
  }

  applyHTML(elementId: string, value: string): void {
    const element = document.getElementById(elementId);
    if (element !== null) {
      element.innerHTML = value;
    }
  }

  // On click action
  toggleCard() {
    // Default display for tables
    const products = document.getElementById('products');
    if (products === null) {
      return;
    }
    const services = document.getElementById('services');
    if (services === null) {
      return;
    }
    const employees = document.getElementById('employees');
    if (employees === null) {
      return;
    }

    const listing = document.getElementById('listing') as HTMLInputElement;
    const choice = listing.value;
    // console.log("choice: " + choice);

    if (choice === 'products') {
      products.style.display = 'block';
      services.style.display = 'none';
      employees.style.display = 'none';
    } else if (choice === 'services') {
      products.style.display = 'none';
      services.style.display = 'block';
      employees.style.display = 'none';
    } else if (choice === 'employees') {
      products.style.display = 'none';
      services.style.display = 'none';
      employees.style.display = 'block';
    } else {
      products.style.display = 'none';
      services.style.display = 'none';
      employees.style.display = 'none';
    }
  }

  // const submitButton = document.getElementById('btnDisplayListing');
  // submitButton.onclick = toggleCard;
}
