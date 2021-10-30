/*
============================================
; Title:  payroll.js
; Author: David Rachwalik
; Date:   October 30, 2021
; Description: Exercise 2.3 for Bellevue University course WEB-231
;===========================================
*/

"use strict";
(function () {
    // variables
    const date = new Date();
    const now = date.toLocaleDateString('en-US');

    const firstNameRobinWilliams = "Robin";
    const lastNameRobinWilliams = "Williams";
    const addressRobinWilliams = "95 St. Thomas Way";
    let payRateRobinWilliams = 51.235;
    let hireDateRobinWilliams = "July 21, " + date.getFullYear();

    const firstNameDaveGrohl = "Dave";
    const lastNameDaveGrohl = "Grohl";
    const addressDaveGrohl = "722 Seward Street";
    let payRateDaveGrohl = 32.657;
    let hireDateDaveGrohl = "January 14, " + date.getFullYear();

    const firstNameKeanuReeves = "Keanu";
    const lastNameKeanuReeves = "Reeves";
    const addressKeanuReeves = "9601 Wilshire Blvd.";
    let payRateKeanuReeves = 47.624;
    let hireDateKeanuReeves = "September 2, " + date.getFullYear();


    // actions
    console.log("Hello on " + now + "!");

    // Employee record 1: Robin Williams
    document.getElementById("txtFirstNameRobinWilliams").innerHTML = firstNameRobinWilliams;
    document.getElementById("txtLastNameRobinWilliams").innerHTML = lastNameRobinWilliams;
    document.getElementById("txtAddressRobinWilliams").innerHTML = addressRobinWilliams;
    document.getElementById("txtHireDateRobinWilliams").innerHTML = payRateRobinWilliams.toFixed(1);
    document.getElementById("txtPayRateRobinWilliams").innerHTML = hireDateRobinWilliams;

    // Employee record 2: Dave Grohl
    document.getElementById("txtFirstNameDaveGrohl").innerHTML = firstNameDaveGrohl;
    document.getElementById("txtLastNameDaveGrohl").innerHTML = lastNameDaveGrohl;
    document.getElementById("txtAddressDaveGrohl").innerHTML = addressDaveGrohl;
    document.getElementById("txtHireDateDaveGrohl").innerHTML = payRateDaveGrohl.toFixed(1);
    document.getElementById("txtPayRateDaveGrohl").innerHTML = hireDateDaveGrohl;

    // Employee record 3: Keanu Reeves
    document.getElementById("txtFirstNameKeanuReeves").innerHTML = firstNameKeanuReeves;
    document.getElementById("txtLastNameKeanuReeves").innerHTML = lastNameKeanuReeves;
    document.getElementById("txtAddressKeanuReeves").innerHTML = addressKeanuReeves;
    document.getElementById("txtHireDateKeanuReeves").innerHTML = payRateKeanuReeves.toFixed(1);
    document.getElementById("txtPayRateKeanuReeves").innerHTML = hireDateKeanuReeves;

})();