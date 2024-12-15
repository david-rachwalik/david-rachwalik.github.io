import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class PayrollComponent implements OnInit {
  // variables
  date = new Date();
  now = this.date.toLocaleDateString('en-US');
  year = this.date.getFullYear();

  firstNameRobinWilliams = 'Robin';
  lastNameRobinWilliams = 'Williams';
  addressRobinWilliams = '95 St. Thomas Way';
  payRateRobinWilliams = 51.235;
  hireDateRobinWilliams = `July 21, ${this.year}`;

  firstNameDaveGrohl = 'Dave';
  lastNameDaveGrohl = 'Grohl';
  addressDaveGrohl = '722 Seward Street';
  payRateDaveGrohl = 32.657;
  hireDateDaveGrohl = `January 14, ${this.year}`;

  firstNameKeanuReeves = 'Keanu';
  lastNameKeanuReeves = 'Reeves';
  addressKeanuReeves = '9601 Wilshire Blvd.';
  payRateKeanuReeves = 47.624;
  hireDateKeanuReeves = `September 2, ${this.year}`;

  ngOnInit() {
    // actions
    console.log(`Hello on ${this.now}!`);

    // Employee record 1: Robin Williams
    this.applyHTML('txtFirstNameRobinWilliams', this.firstNameRobinWilliams);
    this.applyHTML('txtLastNameRobinWilliams', this.lastNameRobinWilliams);
    this.applyHTML('txtAddressRobinWilliams', this.addressRobinWilliams);
    this.applyHTML(
      'txtHireDateRobinWilliams',
      this.payRateRobinWilliams.toFixed(1),
    );
    this.applyHTML('txtPayRateRobinWilliams', this.hireDateRobinWilliams);

    // Employee record 2: Dave Grohl
    this.applyHTML('txtFirstNameDaveGrohl', this.firstNameDaveGrohl);
    this.applyHTML('txtLastNameDaveGrohl', this.lastNameDaveGrohl);
    this.applyHTML('txtAddressDaveGrohl', this.addressDaveGrohl);
    this.applyHTML('txtHireDateDaveGrohl', this.payRateDaveGrohl.toFixed(1));
    this.applyHTML('txtPayRateDaveGrohl', this.hireDateDaveGrohl);

    // Employee record 3: Keanu Reeves
    this.applyHTML('txtFirstNameKeanuReeves', this.firstNameKeanuReeves);
    this.applyHTML('txtLastNameKeanuReeves', this.lastNameKeanuReeves);
    this.applyHTML('txtAddressKeanuReeves', this.addressKeanuReeves);
    this.applyHTML(
      'txtHireDateKeanuReeves',
      this.payRateKeanuReeves.toFixed(1),
    );
    this.applyHTML('txtPayRateKeanuReeves', this.hireDateKeanuReeves);
  }

  applyHTML(elementId: string, value: string) {
    // document.getElementById('txtFirstNameRobinWilliams').innerHTML =
    //   firstNameRobinWilliams;

    const element = document.getElementById(elementId);
    if (element !== null) {
      element.innerHTML = value;
    }
  }
}
