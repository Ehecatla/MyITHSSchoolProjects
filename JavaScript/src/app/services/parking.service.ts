import {Inject, Injectable} from '@angular/core';
import {FirebaseRef} from 'angularfire2';
import {Destination} from '../supporting-files/destination';
import {Parking} from '../supporting-files/parking';
import {CoordinateDistances} from '../supporting-files/coordinate-distances';
import {ApiService} from './api.service';
import {GoogleMapsService} from './google-maps.service'

/**
 * A service for retrieving valid parkings
 */

@Injectable()
export class ParkingService {
  
  minNumberOfParkings: number = 3;
  
  
  constructor(@Inject(FirebaseRef) private _ref: any, private apiService:ApiService, private googleMapsService: GoogleMapsService) { }
  
  /**
   * Retrieves all free time parkings within a give radius
   * return a promise 
   */
  publicTimeParkings(position, destination:Destination, radius:number) : Promise<Parking[]> {
      return new Promise((resolve) => {
        let freeParking: Parking[] = [];
        let bigBox = CoordinateDistances.square(position.lat, position.lng, radius);
        this._ref.child('/PublicTimeParkings').once("value", (snapshot) => {
          snapshot.forEach((obj) => {
            
            if (obj.val().Lat >= bigBox.latitude.min && obj.val().Lat <= bigBox.latitude.max && 
                obj.val().Long >= bigBox.longitude.min && obj.val().Long <= bigBox.longitude.max) {
              let distance = CoordinateDistances.distanceBetweenPoints(position.lat, position.lng, obj.val().Lat, obj.val().Long);
              if (distance <= radius) {
                let time: number  = parseInt(destination.time);
                if (isNaN(time)) {
                  time = 0;
                }
                let maxTime: number = this.returnTimeInMins(obj.val().MaxParkingTime);
                if (maxTime >= time) {
                  freeParking.push(new Parking(obj.val().Id, obj.val().Name, Math.round(distance), 'Gratis', obj.val().MaxParkingTime,obj.val().Lat,obj.val().Long));

                }
              }
            }
          });
          resolve(freeParking);
        });
      });
    }
    
    /**
     * Retrieves all toll time parkings within a give radius
     * return a promise
     */
    publicTollParkings(position, destination:Destination, radius:number) : Promise<Parking[]> {
      return new Promise((resolve) => {
        let tollParking: Parking[] = [];
        let bigBox = CoordinateDistances.square(position.lat, position.lng, radius);
        this._ref.child('/PublicTollParkings').once("value", (snapshot) => {
          snapshot.forEach((obj) => {
            if (obj.val().Lat >= bigBox.latitude.min && obj.val().Lat <= bigBox.latitude.max && 
                  obj.val().Long >= bigBox.longitude.min && obj.val().Long <= bigBox.longitude.max) {
              let distance = CoordinateDistances.distanceBetweenPoints(position.lat, position.lng, obj.val().Lat, obj.val().Long);
              if (distance <= radius) {
                let time: number  = parseInt(destination.time);
                if (isNaN(time)) {
                  time = 0;
                }
                let maxTime: number = this.returnTimeInMins(obj.val().MaxParkingTime);
                if (maxTime >= time) {
                  tollParking.push(new Parking(obj.val().Id, obj.val().Name, Math.round(distance), obj.val().ParkingCost, obj.val().MaxParkingTime,obj.val().Lat,obj.val().Long));
                }
              }
            }
          });
          resolve(tollParking);
        });
      });
    }
    
    /**
     * Function returnTimeInMins takes string in format XX min and returns it as
     * number. If parameter given is invalid returns -1. 
     */
    returnTimeInMins(time: string): number{
      let timeNr;
      let splitted = time.split(' ');
      timeNr = parseInt(splitted[0]);
      if(typeof timeNr === 'number'){
        if (splitted.length > 1 && splitted[1] === 'tim') {
          timeNr *= 60;
        }
        return timeNr;
      } else {
        return -1;
      }  
    }

    findParking(destination:Destination):Promise<Parking[]> {
      return new Promise(resolve => {
        if(destination.address){
          var beforeAdress = 'https://maps.googleapis.com/maps/api/geocode/json?address='
          var afterAdress = '&key=AIzaSyCoO_vczIXw8qrrNgaLzZNqNus5YFU9GnQ'
          var address = destination.address;
          
          if(destination.address.length > 7){
            if(destination.address.slice(-8)!="Göteborg"){
                address += '+Göteborg';
            }
          }else if(destination.address.length <= 7){
            address += '+Göteborg';
          } 
           
          this.apiService.getFromApi(beforeAdress + address + afterAdress).then((result) => {
            let geocoding = result.results[0].geometry.location;
            this.getAllParking(geocoding, destination, 100).then(parkings => resolve(parkings));
          });
        }
      });
    }
    
    getAllParking(position, destination: Destination, radius:number):Promise<Parking[]> {
      this.googleMapsService.setRadius(radius);
      return new Promise(resolve => {
        this.publicTimeParkings(position, destination, radius).then((freeList) => {       
          this.publicTollParkings(position, destination, radius).then((tollList) => {

            let parkings: Parking[] = [].concat(freeList, tollList);
            if (parkings.length < this.minNumberOfParkings) {
              this.getAllParking(position, destination, radius+50).then(result => {
                resolve(result);
              });
            } else {
              parkings.sort((a, b) => {
                return a.distance - b.distance;
              });
              resolve(parkings); 
            }
          });
        });
      });
      
    }
    
}
