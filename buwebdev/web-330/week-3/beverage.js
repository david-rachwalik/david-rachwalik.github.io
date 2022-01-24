/*
============================================
; Title:        beverage.js
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

import { Product } from "./product.js";

export class Beverage extends Product {
    constructor(name, price) {
        super(name, price);
    }
}
