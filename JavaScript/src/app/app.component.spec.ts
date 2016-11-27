import {describe, it, expect, beforeEachProviders, inject} from '@angular/core/testing';
import {AppComponent} from '../app/components/script-routes/app.component';

beforeEachProviders(() => [AppComponent]);

describe('App: AngularCliTest', () => {
  it('should have the `defaultMeaning` as 42', inject([AppComponent], (app: AppComponent) => {
    
  }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life', inject([AppComponent], (app: AppComponent) => {
      
    }));
  });
});

