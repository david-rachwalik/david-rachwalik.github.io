import { FoodModel } from './food-model.js';

class CalorieConverter {
  static data = [
    new FoodModel(1007, 'Egg', 78),
    new FoodModel(1008, 'Apple', 95),
    new FoodModel(1009, 'Hamburger', 354),
    new FoodModel(1010, 'Fries', 400),
    new FoodModel(1011, 'Banana', 105),
    new FoodModel(1012, 'Soda', 150),
  ];

  // static find(name) {
  //   return this.data.filter((f) => String(f.name).toLowerCase() === String(name).toLowerCase());
  // }

  static find(name) {
    const results = [];
    const names = name.split(',');
    for (const n of names) {
      const match = this.data.filter((f) => String(f.name).toLowerCase() === String(n).trim().toLowerCase());
      if (n && match) results.push(match[0]);
    }
    return results;
  }
}

export { CalorieConverter };
