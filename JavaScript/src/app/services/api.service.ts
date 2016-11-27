import {Http, Response,} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/**
 * A service to easily connect to and get data from a web api
 */
@Injectable()
export class ApiService {
  
  constructor (private http: Http) { }
  
  /**
   * getting data from a web api
   * retrun a promise
   */
  getFromApi (address: string) : Promise<any> {
    
    return new Promise((resolve) => {
      this.http.get(address)
          .map(this.extractData)
          .catch(this.handleError)
          .subscribe((res) => { return resolve(res); });
    });
  }
  
  /**
   * extracting data and returning it as json
   */
  private extractData(res: Response) {
    return res.json();
  }
  
  /**
   * handling errors
   */
  private handleError(error: any) {
    return Observable.throw(error.message);
  }
  
}