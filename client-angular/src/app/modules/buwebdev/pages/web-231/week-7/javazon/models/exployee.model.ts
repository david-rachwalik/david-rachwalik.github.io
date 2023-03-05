export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  salary: number;

  constructor(id: number, firstName: string, lastName: string, salary: number) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.salary = salary;
  }
}
