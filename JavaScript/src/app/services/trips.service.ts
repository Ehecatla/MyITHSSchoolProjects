import {Injectable, Inject} from '@angular/core';
import {FirebaseRef} from 'angularfire2';
import {AccountService} from './account.service';
import {Trip} from '../supporting-files/trip';
import {Destination} from '../supporting-files/destination';
import {Comment} from '../supporting-files/comment';

@Injectable()
export class TripsService {
  trips: Trip[];
  activeTrip: Trip;
  activeDestination: Destination;
  check:string = "";
  
  constructor(@Inject(FirebaseRef) private _ref: any, private accountService: AccountService) {
    accountService.loadUser().then(result => {
      if(result==='ok'){
        this.getTrips();
      }
    });
  }
  
  /**
   * getTrip fetches all trip data for specific user from firebase.
   */
  getTrips() {
    this._ref.child('/trips').orderByChild('userid').equalTo(this.accountService.userid).on('value', (userTrips) => {
      this.trips = [];
      userTrips.forEach((trip) => {
          let t: Trip = new Trip();
          t.name = trip.child("name").val();
          t.description = trip.child('description').val();
          t.id = trip.key();
          this.trips.push(t);
      });
      this.trips.reverse();
    });
  }

  getTrip(tripId: string): Promise<Trip> {
    return new Promise(resolve => {
      this._ref.child('/trips').child(tripId).once('value', (firebaseTrip) => {
        let trip: Trip = new Trip();
        trip.name = firebaseTrip.child("name").val();
        trip.description = firebaseTrip.child('description').val();
        trip.id = firebaseTrip.key();
        this.getDestinations(trip).then(destinations => {
          trip.destinations = destinations;
          resolve(trip);
        });
      });
    });
  }
  
  /**
   * Fetches destinations for given Trip object from firebase.
   */
  getDestinations(trip: Trip): Promise<Destination[]> {
    return new Promise(resolve => {
      let destinations: Destination[] = [];
      this._ref.child('/destinations').orderByChild('tripid').equalTo(trip.id).on('value', (tripDestinations) => {
        let commentsRetrieved = [];
        tripDestinations.forEach((destination) => {
            let d: Destination = new Destination();
            d.id = destination.key();
            d.address = destination.child('address').val();
            d.time = destination.child('time').val();
            destinations.push(d);
            commentsRetrieved.push(this.getComments(d).then(comments => {
              d.comments = comments;
            }));
        });
        Promise.all(commentsRetrieved).then(() => resolve(destinations));
      });
    });
  }
  
  /**
   * Fetches comments for given destination object from firebase database.
   */
  getComments(destination: Destination): Promise<Comment[]> {
    return new Promise(resolve => {
    let comments: Comment[] = [];
    this._ref.child('/comments').orderByChild('destinationid').equalTo(destination.id).on('value', (destinationComments) => {
      destinationComments.forEach((comment) => {
          let c: Comment = new Comment();
          c.id = comment.key();
          c.text = comment.child('text').val();
          c.timestamp = comment.child('createdat').val();
          comments.push(c);
      });
      return resolve(comments);
    });
    });
  }
  
  /** 
   * This method takes the values from the input fields, 
   * creates a trip object and a destination object and adds 
   * them to the database.
   */
  addTrip(trip: Trip): Promise<Boolean> {
    return new Promise(resolve => {
      let tripCreated = this._ref.child('/trips').push({
        name: trip.name,
        description: (trip.description) ? trip.description : null,
        userid: this.accountService.userid,
        destinations: trip.destinations.length,
        createdat: Firebase.ServerValue.TIMESTAMP
      });
      tripCreated.then(() => {
        let destinationsCreated = [];
        for (let destination of trip.destinations) {
          destinationsCreated.push(this.addDestination(tripCreated.key(), destination));
        }
        Promise.all(destinationsCreated).then(() => resolve(true));
      });
    });
  }

  addDestination(tripId: string, destination: Destination): Promise<boolean> {
    return new Promise(resolve => {
      let destinationCreated = this._ref.child('/destinations').push(
        { 
          address: destination.address, 
          time: (destination.time) ? destination.time : null, 
          tripid: tripId,
          createdat: Firebase.ServerValue.TIMESTAMP
        });
        destinationCreated.then(() => {
          let commentsCreated = [];
          for (let comment of destination.comments) {
            commentsCreated.push(this.addComment(destinationCreated.key(), comment));
          }
          Promise.all(commentsCreated).then(() => {
            resolve(true);
          })
        });
    });
  }

  addComment(destinationId: string, comment: Comment): Promise<boolean> {
    return new Promise(resolve => {
      let commentCreated = this._ref.child('/comments').push(
        {
          text: comment.text,
          destinationid: destinationId,
          createdat: Firebase.ServerValue.TIMESTAMP
        });
        commentCreated.then(() => resolve(true));
    });
  }
   
  /** deletes one trip from the firebase */
  deleteTheTrip(trip:Trip): Promise<Boolean>{
    return new Promise(resolve =>{
      if(trip.id){
        this._ref.child('/trips').child(trip.id).remove();
        for( let d of trip.destinations){
          if(d.id){
            this._ref.child('/destinations').child(d.id).remove();
            for( let c of d.comments){
              if(c.id){
                this._ref.child('/comments').child(c.id).remove();
              }   
            }
          } 
        }   
      } 
      return resolve(true); 
    });     
  }

  deleteTrip(tripid: string) {
    this.getTrip(tripid).then(trip => {
      for (let destination of trip.destinations) {
        for (let comment of destination.comments) {
          this._ref.child('/comments').child(comment.id).remove();
        }
        this._ref.child('/destinations').child(destination.id).remove();
      }
      this._ref.child('/trips').child(trip.id).remove();
    });
  }


}