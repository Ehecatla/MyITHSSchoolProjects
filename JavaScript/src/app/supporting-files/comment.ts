/**
 * Class Comment is used to save information about comment made for a specific
 * destination and timestamp when that comment was created.
 */
export class Comment {
  id:string;
  text: string;
  timestamp: any;

  deepClone(comment: Comment) {
    this.id = (comment.id) ? comment.id : undefined;
    this.text = (comment.text) ? comment.text : undefined;
    this.timestamp = (comment.timestamp) ? comment.timestamp : undefined;
  }
}
