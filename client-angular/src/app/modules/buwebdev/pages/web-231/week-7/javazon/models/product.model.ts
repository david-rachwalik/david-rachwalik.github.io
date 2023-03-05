export class Product {
  id: number;
  description: string;
  price: number;
  quantity: number;

  constructor(
    id: number,
    description: string,
    price: number,
    quantity: number,
  ) {
    this.id = id;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
  }

  totalValue(): number {
    return this.price * this.quantity;
  }
}
