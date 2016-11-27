import {Injectable} from '@angular/core';
import {Parking} from '../supporting-files/parking';

declare var google: any;

@Injectable()
export class GoogleMapsService {
  image;
  currentRadius;
  
  /**
   * Gets the actually distance between two locations (coordinates or address) for a given travelmode
   * param origins an array with either objects (lat, lng) or a string address
   * param destinations an array with either objects (lat, lng) or a string address
   * param travelType (Optional, defaults to driving) parameter for specifying travel type
   * return an object with all information about distances and time
   */
  getActuallyDistance(origins: Array<any>, destinations: Array<any>, travelType?: string): Promise<any> {
    let travelMode = google.maps.TravelMode.DRIVING;
    if (travelType === 'walking') 
      travelMode = google.maps.TravelMode.WALKING;
    
    let dist = new google.maps.DistanceMatrixService();
    return new Promise((resolve) => {
      dist.getDistanceMatrix({
        origins: origins,
        destinations: destinations,
        travelMode: travelMode,
        unitSystem: google.maps.UnitSystem.METRIC
      }, (response, status) => {
        resolve(response);
      });
    });
  }
  
  /**
   * Adds a google search box to all the elements with a given classname
   */
  addGoogleSearchBox(className: string) {
    var input = document.getElementsByClassName(className);
    for (let i = 0, len = input.length; i < len; i++) {
      new google.maps.places.SearchBox(input[i]); 
    }
  }
  
  getAdressName(latitude:number,longitude:number){
    let geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    
    geocoder.geocode({'latLng': latlng}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var add = results[0].formatted_address;
          document.getElementById('map').setAttribute('src', "https://www.google.com/maps/embed/v1/place?key=AIzaSyCoO_vczIXw8qrrNgaLzZNqNus5YFU9GnQ&q="+add);
        } 
      } 
    });                  
  }

  /**
   * converts current latlng to adress(string) 
   * */
  convertLatlng(latitude:number,longitude:number):Promise<string>{
    return new Promise(resolve => {
      var geocoder = new google.maps.Geocoder();
      var latlng = {lat: latitude, lng: longitude};
      var address = "";
      
      geocoder.geocode({'location': latlng}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            address = results[1].formatted_address;
            return resolve(address);
          } else 
              window.alert('No results found');
        } else 
            window.alert('Geocoder failed due to: ' + status);
      });
    }); 
  }
   
  /**
  * sets pins for every parking to the map 
  */ 
  setPins(latitude:number,longitude:number,parkings:Array<Parking>){
    let map = new google.maps.Map(document.getElementById('parkingMap'), {
        zoom: 15,
        center: {lat: latitude, lng: longitude}
    });
    
    this.whereAmI(map, latitude, longitude, this.currentRadius + 50); 

    for(let i =0; i < parkings.length ; i++) {
      if(parkings[i].cost === 'Gratis') {
        if(parkings[i].maxTime === '10 min') 
          this.image = 'time-parking-10-min.png';
        else if(parkings[i].maxTime === '30 min') 
          this.image = 'time-parking-30-min.png';
        else if(parkings[i].maxTime === '1 tim') 
          this.image = 'time-parking-1-tim.png';
        else if(parkings[i].maxTime === '2 tim') 
          this.image = 'time-parking-2-tim.png';
        else if(parkings[i].maxTime === '4 tim') 
          this.image = 'time-parking-4-tim.png';
        else if(parkings[i].maxTime === '24 tim') 
          this.image = 'time-parking-24-tim.png';
      }
      else {
       this.image = 'toll-parking.png';
      }
      
      let contentString = '<div>Street: ' + parkings[i].name + '</div>' +
                          '<div>Distance: ' + parkings[i].distance+ 'm' + '</div>' +
                          '<div>Cost: ' + parkings[i].cost + '</div>' +
                          '<div>Max Time: ' + parkings[i].maxTime + '</div>';
      
      let infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
      
      let marker = new google.maps.Marker({
        position: {lat: parkings[i].latitude, lng: parkings[i].longitude},
          map: map,
          icon: this.image
        });
      
      marker.addListener('click', () => infoWindow.open(map, marker));
      marker.setMap(map);
    }
  }
  
  /**
   * shows where the user is and a circle area
   */
  whereAmI(map, latitude, longitude, radius:number) {
    this.image = 'you-are-here.png';
    
    let circle = new google.maps.Circle ({
      map: map,
      center: new google.maps.LatLng(latitude, longitude),
      radius: radius,
      fillColor: '#6CA0DC',
      strokeColor: 'white'
    });
    
    let marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
        map: map,
        icon: this.image
      });
      
      marker.setMap(map);
  }
  
  setRadius(radius:number) {
    this.currentRadius = radius;
  }
}
