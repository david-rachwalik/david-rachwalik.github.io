/*
============================================
; Title:        main-course.js
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

import { Product } from "./product.js";

export class MainCourse extends Product {
    constructor(name, price) {
        super(name, price);
    }
}
