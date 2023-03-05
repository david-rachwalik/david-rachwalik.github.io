export class Service {
  id: number;
  description: string;
  hourlyRate: number;
  min: number;

  constructor(
    id: number,
    description: string,
    hourlyRate: number,
    min: number,
  ) {
    this.id = id;
    this.description = description;
    this.hourlyRate = hourlyRate;
    this.min = min;
  }
}
