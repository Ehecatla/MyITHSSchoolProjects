import {Component, OnInit, Inject, Input, EventEmitter} from '@angular/core';
import { FirebaseRef} from 'angularfire2';
import { ParkingService } from '../../services/parking.service';
import { GoogleMapsService } from '../../services/google-maps.service';
import { PositionService } from '../../services/position.service';
import {AccountService} from '../../services/account.service';
import {TripsService} from '../../services/trips.service';
import { Destination } from '../../supporting-files/destination';
import { Trip } from '../../supporting-files/trip';
import { Comment } from '../../supporting-files/comment';
import { Parking } from '../../supporting-files/parking';
import { ApiService } from '../../services/api.service';
import { User } from '../../supporting-files/user';
import {HistoryComponent} from './history.component';
import {ParkingListComponent} from './parking-list.component';
import {GoogleMapsComponent} from './google-maps.component';

@Component({
  moduleId: module.id,
  selector: 'new-trip',
  providers: [ParkingService, GoogleMapsService, PositionService],
  templateUrl: '../html/new-trip.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [HistoryComponent, ParkingListComponent, GoogleMapsComponent],
  pipes: []
})
export class NewTripComponent {
  _newTrip: Trip = new Trip();
  
  constructor(private apiService: ApiService,
              private parkingService: ParkingService,
              private googleMapsService: GoogleMapsService,
              private positionService: PositionService,
              private accountService: AccountService,
              private tripsService: TripsService) {}
              
  get newTrip(): Trip {
    return this._newTrip;
  }
  
  @Input() set newTrip(trip: Trip) {
    this._newTrip = trip;
    setTimeout(() => {
      this.googleMapsService.addGoogleSearchBox('adress-field');
    }, 500);
  }
    
  /**
   * Creates new destination if previously added one has filled adress field.
   */
  newDestination () {
    let length = this.newTrip.destinations.length;
    
    if(this.newTrip.destinations){
       if(this.newTrip.destinations.length==0){
           this.newTrip.destinations.push(new Destination());
       }else {
           if(this.newTrip.destinations[length-1].address){
               this.newTrip.destinations.push(new Destination());
           }
       }
       this.validateFormFields();
    }
    setTimeout(() => {
      this.googleMapsService.addGoogleSearchBox('adress-field');
    }, 500);
  }
  
  tripEvent(trip: Trip) {
    this.newTrip = trip;
  }
  
  /**
   * Creates new comment for given destination object.
   */
  newComment(destination: Destination) {
    let length = destination.comments.length;
    
    if(destination.comments){
       if(destination.comments.length==0){
           destination.comments.push(new Comment());
       }else {
           if(destination.comments[length-1].text){
               destination.comments.push(new Comment());
           }
       }
        this.validateFormFields(); 
    }
  }
  
  /**
   * Function removeLastDestination removes last destination from list of destinations
   * to newly created trip object. If trip has no destinations, none are removed.
   */
  removeLastDestination(){
    if(this.newTrip.destinations.length > 0){
      this.newTrip.destinations.pop();
    }      
  }
  
  startNewTrip(){
    this.newTrip = new Trip();
  }
  
  
  
  add() {
    let validated = this.validateFormFields();
    let trip:Trip;
    if(validated === false){
      return;
    }
    
    if(this.newTrip.id){
      trip = new Trip();
      trip.name = this.newTrip.name;
      trip.description = this.newTrip.description;
      
      for(let i = 0; i< this.newTrip.destinations.length; i++ ){
        
        let d = new Destination();
        d.address = this.newTrip.destinations[i].address;
        d.time = this.newTrip.destinations[i].time;
        for(let j = 0; j< this.newTrip.destinations[i].comments.length;j++){
          let c = new Comment();
          c.text = this.newTrip.destinations[i].comments[j].text;
          d.comments.push(c);
        }
        trip.destinations.push(d);
      }
      this.tripsService.addTrip(trip).then((result) =>{
        this.deleteTrip();
      });
    } 
    else {    
        this.tripsService.addTrip(this.newTrip).then(done => {
            if (done) {        
                this.startNewTrip();
            }
        }); 
    } 
  }
  
  
  /** deletes one trip from the firebase */
  deleteTrip(){
    this.tripsService.deleteTheTrip(this.newTrip).then((result)=>{
      if(result){
        this.startNewTrip();
      }
    });
  }
  
  /**
   * Function removeLastComment takes destination as argument and removes last Comment
   * object that is assigned to its variable of comments if any.
   */
  removeLastComment(destination: Destination){
    if(destination && destination.comments.length >0){
      destination.comments.pop();  
    }
  }

  findParking(destination:Destination){
    this.parkingService.findParking(destination).then(parkings => destination.parking = parkings);
  }
  
  
  /**
   * Function goes through object of Destination class and checks if it has any valid values
   * on some of its variables. Some get default value if they have none for the moment.
   */
  validateDestination(destination: Destination){  
      if(!destination.address){
          destination.address = 'none';
      }
      if(!destination.comments){
      }
      if(!destination.time){
        destination.time = '0';  
      }  
  }
  
  /**
   * Checks if trip object has name assigned to it, if not then it assigns name to it.
   */
  validateTripName(trip: Trip){
    if(!trip.name){
      trip.name = 'No name';
    }
  }

  /**
   * Function validateFormFields goes through form fields with id 'name' or class 'adress-field'
   * and checks if they have input value. If any of these fields is empty then this function returns
   * false aswell as it marks fields with class representing that they have invalid input. If field
   * became valid and has invalid class then its removed.
   */
  validateFormFields(): boolean{
    let isValid = true;
    let tripElement = (<HTMLInputElement>document.getElementById('name'));
    let tripName = tripElement.value; 
    let adressElements = <HTMLCollection>document.getElementsByClassName('adress-field');
    let commentElements = <HTMLCollection>document.getElementsByClassName('comment-field');
    
    //check if name is valid
    if(!tripName || tripName.length >30){
      tripElement.className += ' field-input-invalid'; //mark element as invalid
      isValid = false;
    } else {  //remove red class if any 
        tripElement.classList.remove('field-input-invalid');
    }
    
    //check if destination adresses are valid
    if(adressElements){
      for(let i = 0; i < adressElements.length; i++){
        if(!(<HTMLInputElement>adressElements[i]).value){
          //mark element with invalid class ng-invalid
          (<HTMLInputElement>adressElements[i]).classList.add('field-input-invalid'); 
          isValid = false;
        } else {
          (<HTMLInputElement>adressElements[i]).classList.remove('field-input-invalid'); 
          //check if class is ng-invalid, remove it then
        }
      }   
    }
    
    //check if destination comments are valid
    if(commentElements){
      for(let i = 0; i < commentElements.length; i++){
        if(!(<HTMLInputElement>commentElements[i]).value){
          //mark element with invalid class ng-invalid
          (<HTMLInputElement>commentElements[i]).classList.add('field-input-invalid'); 
          isValid = false;
        } else {
          (<HTMLInputElement>commentElements[i]).classList.remove('field-input-invalid'); 
          //check if class is ng-invalid, remove it then
        }
      }   
    }   
        
    return isValid;
  }
}
