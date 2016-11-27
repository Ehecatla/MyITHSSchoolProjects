import { Comment } from './comment';
import { Parking } from './parking';

/**
 * Class Destination represents one stop, adress where user plans to spend
 * given time. One Destination has adress, none or many comments, parkings
 * nearby and time information.
 */
export class Destination{
    id: string;
    tripid: string;
    address: string;
    time: string;
    comments: Comment[];
    parking: Parking[] = new Array();
    constructor(){
        this.comments = [];
    }

    deepClone(destination: Destination) {
        this.id = (destination.id) ? destination.id : undefined;
        this.address = (destination.address) ? destination.address : undefined;
        this.time = (destination.time) ? destination.time : undefined;
        if (destination.comments) {
            for (let comment of destination.comments) {
                let c = new Comment();
                c.deepClone(comment);
                this.comments.push(c);
            }   
        }
    }
}
