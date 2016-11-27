import { Destination } from './destination';


/**
 * Class Trip represents trip that user has planned along with its description,
 * destination (parking) adresses with comments and time for every destination.
 */
export class Trip {
    id:string;
    name:string;
    description: string;
    destinations: Destination[];
    constructor(){
        this.destinations  = [];
    }

    deepClone(trip: Trip) {
        this.id = (trip.id) ? trip.id : undefined;
        this.name = (trip.name) ? trip.name : undefined;
        this.description = (trip.description) ? trip.description : undefined;
        if (trip.destinations) {
            for (let destination of trip.destinations) {
                let d = new Destination();
                d.deepClone(destination);
                this.destinations.push(d);
            }
        }
    }
    
}
