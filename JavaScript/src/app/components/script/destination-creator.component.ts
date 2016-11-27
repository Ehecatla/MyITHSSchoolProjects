import {Component, EventEmitter, Output} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {TripsService} from '../../services/trips.service';
import {ValidateService} from '../../services/validate.service';
import {Destination} from '../../supporting-files/destination';
import {Comment} from '../../supporting-files/comment';

@Component({
  moduleId: module.id,
  selector: 'destination-creator',
  providers: [ValidateService],
  templateUrl: '../html/destination-creator.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [],
  pipes: []
})
export class DestinationCreatorComponent {
  destination: Destination = new Destination();
  destinationCreatorTitle: string = 'Create Destination';
  destinationCreatorButtonText: string = 'Add Destination';
  isEditing: boolean = false;
  index: number;
  count:number;

  constructor(private router: Router, private routeParams: RouteParams, private tripsService: TripsService, private validateService: ValidateService) {
    this.index = parseInt(routeParams.get('index'));
    if (this.index >= 0) {
      this.destination.deepClone(tripsService.activeTrip.destinations[this.index]);
      this.destinationCreatorTitle = 'Edit Destination';
      this.destinationCreatorButtonText = 'Update Destination';
      this.isEditing = true;
    }
   }

  newComment() {
    this.destination.comments.push(new Comment());
  }

  deleteComment() {
    this.destination.comments.splice(this.count, 1);
  }

  addDestination() {
    if (!this.validateFormFields()) {
      return;
    }
    if (!this.isEditing) {
      this.tripsService.activeTrip.destinations.push(this.destination);
    } else {
      this.tripsService.activeTrip.destinations[this.index] = this.destination;
    }
    this.router.navigate(['../Trip']);
  }

  validateFormFields(): boolean{
    let addressElements: HTMLInputElement[] = Array.prototype.slice.call(<HTMLCollection>document.getElementsByClassName('address'));
    let isValidAddress = this.validateService.validateInputFields(addressElements);
    let commentElements: HTMLInputElement[] = Array.prototype.slice.call(<HTMLCollection>document.getElementsByClassName('comment'));
    let isValidComment = this.validateService.validateInputFields(commentElements);
    if (isValidAddress && isValidComment) {
      return true;
    }
    return false;
  }

   setCount(index:number){
    this.count= index;
  }
}