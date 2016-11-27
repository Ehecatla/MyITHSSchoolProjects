/**
 * Class Parking represents one parking with associated information about its
 * cost, time allowed to park, name and distance.
 * 
 */
export class Parking {
  id: string;
  name: string;
  distance: number;
  cost: string;
  maxTime: string;
  latitude:number;
  longitude:number;
  
  constructor(id: string, name: string, distance: number, cost: string, maxTime: string, latitude:number, longitude:number) {
    this.id = id;
    this.name = name;
    this.distance = distance;
    this.cost = cost;
    this.maxTime = maxTime;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}