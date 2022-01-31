/*
============================================
; Title:  rachwalik-javazon.js
; Author: David Rachwalik
; Date:   2021/12/05
; Description: Exercise 7.2 for Bellevue University course WEB-231
;===========================================
*/

(function () {
  // -------- Define Classes --------
  class Product {
    constructor(id, description, price, quantity) {
      this.id = id;
      this.description = description;
      this.price = price;
      this.quantity = quantity;
    }

    // Getter
    get totalValue() {
      return this._totalValue();
    }

    // Method
    _totalValue() {
      return this.price * this.quantity;
    }
  }

  class Service {
    constructor(id, description, hourlyRate, min) {
      this.id = id;
      this.description = description;
      this.hourlyRate = Number(hourlyRate).toFixed(2);
      this.min = min;
    }
  }

  class Employee {
    constructor(id, firstName, lastName, salary) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.salary = salary;
    }
  }

  // Initialize classes
  const product1 = new Product(9781118008188, 'HTML and CSS: Design and Build Websites', 22.26, 10);
  const product2 = new Product(9781491952023, 'JavaScript: The Definitive Guide 7/E', 41.33, 7);
  const product3 = new Product(9781449331818, 'Learning JavaScript Design Patterns 1/E', 25.99, 3);
  const product4 = new Product(9781617292422, 'Express in Action: Writing, building, and testing Node.js applications 1/E', 34.91, 3);
  const product5 = new Product(9781491954461, 'MongoDB The Definitive Guide', 33.7, 8);
  const service1 = new Service(100, 'Website Design', 150, 25);
  const service2 = new Service(101, 'DevOps Consulting', 125, 50);
  const service3 = new Service(102, 'Database Design', 125, 15);
  const employee1 = new Employee(1007, 'Beethoven', 'Ludwig', 13.99);
  const employee2 = new Employee(1008, 'Bach', 'Johann', 22.3);
  const employee3 = new Employee(1009, 'Mozart', 'Wolfgang', 19.5);
  const employee4 = new Employee(1010, 'Brahms', 'Johannes', 12);
  const employee5 = new Employee(1011, 'Haydn', 'Joseph', 32.5);

  // -------- Populate Table Values (Product) --------
  document.getElementById('txtProduct1Id').innerHTML = product1.id;
  document.getElementById('txtProduct1Description').innerHTML = product1.description;
  document.getElementById('txtProduct1Price').innerHTML = Number(product1.price).toFixed(2);
  document.getElementById('txtProduct1Quantity').innerHTML = product1.quantity;
  document.getElementById('txtProduct1TotalValue').innerHTML = Number(product1.totalValue).toFixed(2);
  document.getElementById('txtProduct2Id').innerHTML = product2.id;
  document.getElementById('txtProduct2Description').innerHTML = product2.description;
  document.getElementById('txtProduct2Price').innerHTML = Number(product2.price).toFixed(2);
  document.getElementById('txtProduct2Quantity').innerHTML = product2.quantity;
  document.getElementById('txtProduct2TotalValue').innerHTML = Number(product2.totalValue).toFixed(2);
  document.getElementById('txtProduct3Id').innerHTML = product3.id;
  document.getElementById('txtProduct3Description').innerHTML = product3.description;
  document.getElementById('txtProduct3Price').innerHTML = Number(product3.price).toFixed(2);
  document.getElementById('txtProduct3Quantity').innerHTML = product3.quantity;
  document.getElementById('txtProduct3TotalValue').innerHTML = Number(product3.totalValue).toFixed(2);
  document.getElementById('txtProduct4Id').innerHTML = product4.id;
  document.getElementById('txtProduct4Description').innerHTML = product4.description;
  document.getElementById('txtProduct4Price').innerHTML = Number(product4.price).toFixed(2);
  document.getElementById('txtProduct4Quantity').innerHTML = product4.quantity;
  document.getElementById('txtProduct4TotalValue').innerHTML = Number(product4.totalValue).toFixed(2);
  document.getElementById('txtProduct5Id').innerHTML = product5.id;
  document.getElementById('txtProduct5Description').innerHTML = product5.description;
  document.getElementById('txtProduct5Price').innerHTML = Number(product5.price).toFixed(2);
  document.getElementById('txtProduct5Quantity').innerHTML = product5.quantity;
  document.getElementById('txtProduct5TotalValue').innerHTML = Number(product5.totalValue).toFixed(2);

  document.getElementById('txtService1Id').innerHTML = service1.id;
  document.getElementById('txtService1Description').innerHTML = service1.description;
  document.getElementById('txtService1HourlyRate').innerHTML = Number(service1.hourlyRate).toFixed(2);
  document.getElementById('txtService1Min').innerHTML = service1.min;
  document.getElementById('txtService2Id').innerHTML = service2.id;
  document.getElementById('txtService2Description').innerHTML = service2.description;
  document.getElementById('txtService2HourlyRate').innerHTML = Number(service2.hourlyRate).toFixed(2);
  document.getElementById('txtService2Min').innerHTML = service2.min;
  document.getElementById('txtService3Id').innerHTML = service3.id;
  document.getElementById('txtService3Description').innerHTML = service3.description;
  document.getElementById('txtService3HourlyRate').innerHTML = Number(service3.hourlyRate).toFixed(2);
  document.getElementById('txtService3Min').innerHTML = service3.min;

  document.getElementById('txtEmployee1Id').innerHTML = employee1.id;
  document.getElementById('txtEmployee1FirstName').innerHTML = employee1.firstName;
  document.getElementById('txtEmployee1LastName').innerHTML = employee1.lastName;
  document.getElementById('txtEmployee1Salary').innerHTML = Number(employee1.salary).toFixed(2);
  document.getElementById('txtEmployee2Id').innerHTML = employee2.id;
  document.getElementById('txtEmployee2FirstName').innerHTML = employee2.firstName;
  document.getElementById('txtEmployee2LastName').innerHTML = employee2.lastName;
  document.getElementById('txtEmployee2Salary').innerHTML = Number(employee2.salary).toFixed(2);
  document.getElementById('txtEmployee3Id').innerHTML = employee3.id;
  document.getElementById('txtEmployee3FirstName').innerHTML = employee3.firstName;
  document.getElementById('txtEmployee3LastName').innerHTML = employee3.lastName;
  document.getElementById('txtEmployee3Salary').innerHTML = Number(employee3.salary).toFixed(2);
  document.getElementById('txtEmployee4Id').innerHTML = employee4.id;
  document.getElementById('txtEmployee4FirstName').innerHTML = employee4.firstName;
  document.getElementById('txtEmployee4LastName').innerHTML = employee4.lastName;
  document.getElementById('txtEmployee4Salary').innerHTML = Number(employee4.salary).toFixed(2);
  document.getElementById('txtEmployee5Id').innerHTML = employee5.id;
  document.getElementById('txtEmployee5FirstName').innerHTML = employee5.firstName;
  document.getElementById('txtEmployee5LastName').innerHTML = employee5.lastName;
  document.getElementById('txtEmployee5Salary').innerHTML = Number(employee5.salary).toFixed(2);

  // Default display for tables
  const products = document.getElementById('products');
  const services = document.getElementById('services');
  const employees = document.getElementById('employees');

  // On click action
  function toggleCard() {
    const listing = document.getElementById('listing');
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

  const submitButton = document.getElementById('btnDisplayListing');
  submitButton.onclick = toggleCard;
})();
