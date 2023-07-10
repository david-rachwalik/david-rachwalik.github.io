class FoodModel {
  id: number;
  name: string;
  calories: number;

  constructor(id: number, name: string, calories: number) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
}

export { FoodModel };
