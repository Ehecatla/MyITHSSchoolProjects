import {Injectable} from '@angular/core';

@Injectable()
export class PositionService {
  
  /**
   * Gets the current position of the user (requires localhost or https)
   * return a promise containing the position object
   */
  getCurrentLocation(): Promise<any> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position);
        });
      }
    });
  }
}
