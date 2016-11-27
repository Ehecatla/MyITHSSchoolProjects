import {bootstrap} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {environment} from './app/environment';
import {AppComponent} from './app/components/script-routes/app.component';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire} from 'angularfire2/angularfire2'; 
import 'rxjs/Rx';
import {AccountService} from './app/services/account.service';
import {TripsService} from './app/services/trips.service';
import {ApiService} from './app/services/api.service';
import {GoogleMapsService} from './app/services/google-maps.service';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';

declare var window: {cordova: any};

if (environment.production) {
  enableProdMode();
}

var bootstrapApp = function () {
  bootstrap(AppComponent, [
      FIREBASE_PROVIDERS, 
      ROUTER_PROVIDERS,
      defaultFirebase('https://findparking.firebaseio.com/'),
      HTTP_PROVIDERS,
      AccountService,
      TripsService,
      ApiService,
      GoogleMapsService
    ]);
}

if (window.cordova !== undefined) {
  document.addEventListener('deviceready', () => {
    bootstrapApp();
  }, false);
} else {
  bootstrapApp();
}
