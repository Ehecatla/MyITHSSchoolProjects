//
//  EAEWalkMapViewController.m
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-17.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  EAEWalkMapViewController is used for map activity which allows users map interaction
//  and different walk functions enabled in application.

#import "EAEWalkMapViewController.h"
#import "EAEWalkItManager.h"
#import "EAEMessagePopUp.h"



@interface EAEWalkMapViewController ()

@property (weak, nonatomic) IBOutlet MKMapView * mapView;
@property (nonatomic,strong) CLLocationManager * locationManager;
@property (nonatomic,strong) EAEWalkItManager * walkManager;
@property (nonatomic) BOOL isAuthorized;

@property (weak, nonatomic) IBOutlet UIButton *pinButton;
@property (weak, nonatomic) IBOutlet UITextField *toTextField;
@property (weak, nonatomic) IBOutlet UIButton *startButton;

@property (nonatomic) BOOL isInfoTableVisible;
@property (weak, nonatomic) IBOutlet UIImageView *kmImageView;
@property (weak, nonatomic) IBOutlet UIImageView *timeImageView;
@property (weak, nonatomic) IBOutlet UILabel *kmLabel;
@property (weak, nonatomic) IBOutlet UILabel *timeLabel;

@property (weak, nonatomic) IBOutlet UIImageView *km2ImageView;
@property (weak, nonatomic) IBOutlet UIImageView *time2ImageView;
@property (weak, nonatomic) IBOutlet UILabel *km2Label;
@property (weak, nonatomic) IBOutlet UILabel *time2Label;

@property (weak, nonatomic) IBOutlet UILabel *expectedLabel;
@property (weak, nonatomic) IBOutlet UILabel *actualLabel;

@property (strong, nonatomic) NSTimer *timer; // timer used to count walk time when walking
@property (strong, nonatomic) NSDate *startDate; // stores date when walk was started

@property (strong,nonatomic) MKPointAnnotation * endPin; //add it when person clicks on map if not walking already
@property (strong, nonatomic) NSDictionary * endPinAdress; //adress needed to show as data on view
@property (strong,nonatomic) MKRoute *route;    //route to endPin place from actual place

@property (strong,nonatomic) MKUserLocation * previousUserLocation;
@property (nonatomic) int moveCounter;

-(BOOL)authorizeMapUsage;
-(void)clickedOnMap:(UIGestureRecognizer *)gestureRecognizer;
-(void)userInfo:(NSNotification*)address;
-(void)drawTheRouteWithEndAt:(MKPointAnnotation*)point andDictionaryAdress:(NSDictionary*)dictionaryAdress;
-(MKPointAnnotation *)createPinForLocation:(CLLocation *)location withName:(NSString*)name;
- (void)updateTimer;
- (void)setUpTimer;
- (void)removeTimer;
-(void)saveStatistic;
-(void)cleanUpMap;
-(void)recordWalk;
-(void)stopRecordingWalk;
-(void)showOrHideInfoTable:(BOOL)hide;
-(void)showOrHideInfoTableUserData:(BOOL)isToHide;
-(void)updateInfoTableWithTime:(NSString*)time andWithKm:(NSString*)km;
-(void)createEndResult;
-(void)displayResultMessage:(NSString*)walkDataToShow;
-(BOOL)checkIfNearGoal:(CLLocation*)goalPosition withActualPosAt:(CLLocation*)actualPos;

@end

@implementation EAEWalkMapViewController


-(EAEWalkItManager*)walkManager{
    if(!_walkManager){
        _walkManager = [EAEWalkItManager sharedManager];
    }
    
    return _walkManager;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    //authorize map use if possible
    self.isAuthorized = [self authorizeMapUsage];
    if (self.isAuthorized){
        NSLog(@"Map was authorized");
        UITapGestureRecognizer *tapRecognizer =
        [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickedOnMap:)];
        [self.mapView addGestureRecognizer:tapRecognizer];
        [self.walkManager createNewWalkWithName:@"Walk"]; //should be using date
        CLLocation * actualStartPosition = [self.locationManager location];
        [self.walkManager updateStartPosition:actualStartPosition];
        [self showOrHideInfoTable:YES];
        [self showOrHideInfoTableUserData:YES];
        
        MKCoordinateRegion region = MKCoordinateRegionMakeWithDistance([self.locationManager location].coordinate, 800, 800);
        [self.mapView setRegion:[self.mapView regionThatFits:region] animated:YES];
    } else {
        [EAEMessagePopUp showMessageInParentView:self.view andText:@"Map functions won't function - not authorized."];
    }
    
}

/*
 Method updateTimer is called every time a given interval is passed (configured in
 setUpTimer). It updates passed time when walking and displays updated information.
 */
- (void)updateTimer{
    // Create date from the elapsed time
    NSDate *currentDate = [NSDate date];
    NSTimeInterval timeInterval = [currentDate timeIntervalSinceDate:self.startDate];
    NSString * timeInt = [NSString stringWithFormat:@"%f", timeInterval ];
    NSString * actualTime = [self.walkManager countMinsAndSecsFromSeconds:timeInt];
    self.time2Label.text = actualTime;
    self.walkManager.actualWalkItem.walkTime = timeInt;
}

/*
 Method setUpTimer is used to create timer to count walk time. It sets up timer that
 ticks every second.
 */
- (void)setUpTimer {
    self.startDate = [NSDate date];
    NSLog(@"The start date is: %@", self.startDate);
    // Create the stop watch timer that fires every 100 ms
    self.timer = [NSTimer scheduledTimerWithTimeInterval:1
                                                           target:self
                                                         selector:@selector(updateTimer)
                                                         userInfo:nil
                                                          repeats:YES];
}

/*
 Method removeTimer is used to remove timer after walk has been finished.
 */
- (void)removeTimer {
    [self.timer invalidate];
    self.timer = nil;
    [self updateTimer];
}

/*
 Method saveStatistic is used to save time and distance of walk done by user. Only
 this data is saved and if more walks has been made on one day they all get summarized.
 */
-(void)saveStatistic{
    [self.walkManager saveWalkStatistic];
    NSLog(@"Statistics to save: %f,%@ ", self.walkManager.actualWalkItem.walkLength, self.walkManager.actualWalkItem.walkTime );
}


/*
 Method cleanUpMap is used to remove any traces of old walk from map view, this means
 that previously added route and end pin are removed from map view.
 */
-(void)cleanUpMap{
    //remove pin, route
    self.toTextField.text = @"";
    [self.mapView removeAnnotation:self.endPin];
    [self.mapView removeOverlay:self.route.polyline];
    self.endPin = nil;
    self.route = nil;
    self.endPinAdress = nil;
    
}

/*
 Method recordWalk starts recording and updating of walk made by user, his position
 changes on map. It sets up timer, shows table with user progress on activity view,
 changes start button to end button to give user better feedback on that walk is
 being recorded.
 */
-(void)recordWalk{
    [self showOrHideInfoTableUserData:NO];
    [self setUpTimer];
    self.walkManager.actualWalkItem.isWalking = YES;
    [self.startButton setTitle:@"Stop" forState:UIControlStateNormal];
}

/*
 Method stopRecordingWalk is invoked when user clicks stop button or if he reaches
 his goal pin on map. This method stops recording of user time and distance and
 launches method to show message with walk recorded information.
 */
-(void)stopRecordingWalk{
    //1. stop recording data, show message, change end to start button
    [self.startButton setTitle:@"Start" forState:UIControlStateNormal];
    self.walkManager.actualWalkItem.isWalking = NO;
    [self removeTimer];
    self.walkManager.actualWalkItem.endPosition = self.walkManager.actualWalkItem.actualPosition; //end position is where person stopped walking
    [self saveStatistic];
    [self createEndResult];
    
    [self showOrHideInfoTableUserData:YES];
    [self showOrHideInfoTable:YES];
    [self cleanUpMap];  //remove endPin, adress, route
    [self.walkManager createNewWalkWithName:@"Walk"];
    self.walkManager.actualWalkItem.startPosition = [self.locationManager location];
}

/*
 Method onStarButtonClicked is invoked when start button is clicked. It either acts
 as start or stop to recording of user planned walk depending on if user has active
 walk or not.
 */
- (IBAction)onStartButtonClicked:(UIButton *)sender {
    if(self.walkManager.actualWalkItem.isWalking){
        [self stopRecordingWalk];
        
    } else if(!self.walkManager.actualWalkItem.isWalking && self.walkManager.actualWalkItem.endPosition) {
        [self recordWalk];
        //if goal is chosen and is not walking yet then start recording walk!, change btn to end

    }
}



/*
 Method showOrHideInfoTable takes boolean argument that is fit against setHidden
 method to either hide (YES) or show information table for planned walk with end
 position marked on map.
 */
-(void)showOrHideInfoTable:(BOOL)hide{
    [self.expectedLabel setHidden:hide];
    [self.kmImageView setHidden:hide];
    [self.kmLabel setHidden:hide];
    [self.timeImageView setHidden:hide];
    [self.timeLabel setHidden:hide];
}

/*
 Metho showOrHideInfoTableUserData is used with boolean argument that is fit against
 setHidden method to decide if user active walk data should be shown in view or not.
 */
-(void)showOrHideInfoTableUserData:(BOOL)isToHide{
    [self.actualLabel setHidden:isToHide];
    [self.km2ImageView setHidden:isToHide];
    [self.km2Label setHidden:isToHide];
    [self.time2ImageView setHidden:isToHide];
    [self.time2Label setHidden:isToHide];
    
}


/*
 Method updateInfoTableWithTIme andWithKm updates planned walk information table
 on view with given time and km data represented with string variables.
 */
-(void)updateInfoTableWithTime:(NSString*)time andWithKm:(NSString*)km{
    self.kmLabel.text = km;
    self.timeLabel.text = time;
}


/*
 Method clickedOnMap is called when user clicks anywhere on map, if no walk is active
 then clicking on map will result in new goal position being marked on map if
 it fullfills some requirements. Requirements are made to ensure that location
 can be routed which means that clicked place on map must have at least gate and
 city information. If new position on map doesnt fullfill requirements no new goal
 is made.
 */
-(void)clickedOnMap:(UIGestureRecognizer *)gestureRecognizer{
    if (gestureRecognizer.state != UIGestureRecognizerStateBegan){
    }
    
    CGPoint touchPoint = [gestureRecognizer locationInView:self.mapView];
    CLLocationCoordinate2D location =
    [self.mapView convertPoint:touchPoint toCoordinateFromView:self.mapView];
    
    //NSLog(@"Location clicked on Map: %f %f",location.latitude,location.longitude);
    CLLocation * goalLocation = [[CLLocation alloc]initWithLatitude:location.latitude
                                                          longitude:location.longitude];

    //if no walk is in progress then can try to change goal position
    if (![self.walkManager checkIfWalkInProgress]){
        [self decodeAdressForLocation:goalLocation];
    }
    
}


/*
 Creates MKPointAnnotation object from given CLLocation object and string name, 
 returns it.
 */
-(MKPointAnnotation *)createPinForLocation:(CLLocation *)location withName:(NSString*)name{
   
    MKPointAnnotation * pin;
    pin = [[MKPointAnnotation alloc]init];
    pin.coordinate = self.walkManager.actualWalkItem.endPosition.coordinate;
    self.endPin.title = name;
    self.endPin.subtitle =@"";
    return pin;
}

/*
 Draws route from users position to given point on map represented by MKPointAnnotation
 object given in parameter and its dictionary adress.
 */
-(void)drawTheRouteWithEndAt:(MKPointAnnotation*)point andDictionaryAdress:(NSDictionary*)dictionaryAdress{
    
    MKDirectionsRequest *request = [[MKDirectionsRequest alloc] init];
    request.source = [MKMapItem mapItemForCurrentLocation];
    MKPlacemark * goalPlacemark = [[MKPlacemark alloc]initWithCoordinate:point.coordinate
                                                       addressDictionary:dictionaryAdress];
    MKMapItem * goalMapItem = [[MKMapItem alloc]initWithPlacemark:goalPlacemark];
    request.destination = goalMapItem;
    request.requestsAlternateRoutes = YES;
    [request setTransportType:MKDirectionsTransportTypeWalking];
    MKDirections *directions =
    [[MKDirections alloc] initWithRequest:request];
    
    [directions calculateDirectionsWithCompletionHandler:
     ^(MKDirectionsResponse *response, NSError *error) {
         if (error) {
            //failed to retrieve locations, happen very often, cannot spam user about it
             NSLog(@"Directions ERROR - couldnt retrieve directions");
         } else {
             [self showRoute:response];
         }
     }];

}

/*
 Method showRoute is called from drawTheRouteWithEndAt method when directions data has
 been received. This method completes previous one with placing visual route on
 map.
 */
-(void)showRoute:(MKDirectionsResponse *)response
{
    //remove previous route
    if(self.route){
        [self.mapView removeOverlay:self.route.polyline];
    }

    if(response.routes.count > 1){
        //check optimal route? choose one with shortest time?
        int shortestRouteTime = -1 ;
        int actualRouteTime = -1;
        for (MKRoute *route in response.routes)
        {
            if(shortestRouteTime == -1){ //im on first route then
                actualRouteTime =  (route.expectedTravelTime / 60);
                shortestRouteTime = actualRouteTime;
                self.route = route;
            } else {
                actualRouteTime = (route.expectedTravelTime / 60);
                if(actualRouteTime <= shortestRouteTime){
                    self.route = route;
                    shortestRouteTime = actualRouteTime;
                }
            }
        }
    } else {
        self.route = response.routes[0];
        
    }
    [self.mapView addOverlay:self.route.polyline
                       level:MKOverlayLevelAboveRoads];
    [self showOrHideInfoTable:NO];
    
    if([self.walkManager.actualWalkItem isWalking]){
        //then update actual meter instead!
        NSString * expectedTime = [NSString stringWithFormat:@"%f", (self.route.expectedTravelTime)];
        expectedTime= [self.walkManager countMinsAndSecsFromSeconds:expectedTime];
        NSString * expectedKm = [NSString stringWithFormat:@"%f", (self.route.distance/1000)];
        expectedKm = [NSString stringWithFormat:@"%@ km", [self.walkManager stringToDoubleWith2Decimal:expectedKm]];
        
        [self updateInfoTableWithTime:expectedTime andWithKm:expectedKm];
    
    }else {
        NSString * expectedTime = [NSString stringWithFormat:@"%f", (self.route.expectedTravelTime)];
        expectedTime= [self.walkManager countMinsAndSecsFromSeconds:expectedTime];
        NSString * expectedKm = [NSString stringWithFormat:@"%f", (self.route.distance/1000)];
        expectedKm = [NSString stringWithFormat:@"%@ km", [self.walkManager stringToDoubleWith2Decimal:expectedKm]];
        
         [self updateInfoTableWithTime:expectedTime andWithKm:expectedKm];
    }
}



- (MKOverlayRenderer *)mapView:(MKMapView *)mapView rendererForOverlay:(id < MKOverlay >)overlay
{
    MKPolylineRenderer *renderer =
    [[MKPolylineRenderer alloc] initWithOverlay:overlay];
    renderer.strokeColor = [UIColor blueColor];
    renderer.lineWidth = 5.0;
    return renderer;
}


/*
 Method authorizeMapUsage requests position data for map usage and connects map
 view with location afrerwards. If user allowed localisation and location can be
 shown this method returns true singalizing that map functions can be used.
 */
-(BOOL)authorizeMapUsage{
    self.mapView.delegate = self;
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
        [self.locationManager requestWhenInUseAuthorization];
    }
    [self.locationManager setDesiredAccuracy:kCLLocationAccuracyBestForNavigation];
    
    [self.locationManager startUpdatingLocation];
    self.mapView.showsUserLocation = YES;
    [self.mapView setMapType:MKMapTypeStandard];
    [self.mapView setZoomEnabled:YES];
    [self.mapView setScrollEnabled:YES];
   
    //sometimes retrieving location fails,
    if(self.mapView.userLocation){
        MKCoordinateRegion region = MKCoordinateRegionMakeWithDistance(self.mapView.userLocation.coordinate, 800, 800);
        [self.mapView setRegion:[self.mapView regionThatFits:region] animated:YES];
        return YES;
    } else if ([self.locationManager location]){
        MKCoordinateRegion region = MKCoordinateRegionMakeWithDistance([self.locationManager location].coordinate, 800, 800);
        [self.mapView setRegion:[self.mapView regionThatFits:region] animated:YES];
        return YES;
    }else {
        return [self checkIfCanReachUserLocation]; //one more try to get user location
    }
}

/*
 Method checkIFCanReachUserLocation returns boolean value depending on if users location
 on map can be accessed or not.
 */
-(BOOL)checkIfCanReachUserLocation{
    if(self.mapView.userLocation ||  [self.locationManager location]){
        return YES;
    } else {
        return NO;
    }
}


/*
 Method onGoalButtonClicked is currently not used as that button is disabled. This
 method could be used for future upgrade implementation like view zooming to goal on map
 etc.
 */
- (IBAction)onGoalButtonClicked:(UIButton *)sender {
}


- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation
           fromLocation:(CLLocation *)oldLocation
{
    CLLocation *currentLocation = newLocation;
    if (currentLocation != nil && ![self.walkManager checkIfWalkInProgress]) {
        [self.walkManager updateStartPosition:currentLocation];
        
    } else if (currentLocation != nil && [self.walkManager checkIfWalkInProgress]){
        [self.walkManager updateActualPosition:currentLocation];
    }
}



- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    [EAEMessagePopUp showMessageInParentView:self.view andText:@"Location manager failed. Try going back to menu and map again."];
}



- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    CLLocation * currentLocation = [locations lastObject];
    if(currentLocation ){

    } else {
        //couldnt retrieve location for some reason
        NSLog(@"No location retrieved");
    }
}


//when user location changed, follow him on map
- (void)mapView:(MKMapView *)mapView didUpdateUserLocation:(MKUserLocation *)userLocation
{
   //need to update routing every time person changes its position substantially, not spam update every step
    if(self.endPin && self.walkManager.actualWalkItem.endPosition){
        if(self.moveCounter > 2){
            [self drawTheRouteWithEndAt:self.endPin andDictionaryAdress:self.endPinAdress];
            self.moveCounter = 0;
        } else {
            self.moveCounter = self.moveCounter + 1;
        }
    }
    //if is walking then I need to update km walked every time user moves
    if(self.walkManager.actualWalkItem.isWalking){
        double distance = [userLocation.location distanceFromLocation:self.walkManager.actualWalkItem.actualPosition] / 1000; //km
        self.walkManager.actualWalkItem.actualPosition = userLocation.location;
        self.walkManager.actualWalkItem.walkLength = self.walkManager.actualWalkItem.walkLength + distance;
        if(!self.km2Label.isHidden){
            NSString * distanceString = [NSString stringWithFormat:@"%f", self.walkManager.actualWalkItem.walkLength ];
            distanceString = [self.walkManager stringToDoubleWith2Decimal:distanceString];
            distanceString = [NSString stringWithFormat:@"%@ km", distanceString];
            self.km2Label.text = distanceString;
        }
        
        //check if actual position is within 20 meter of goal position then finish walk
        if([self checkIfNearGoal:self.walkManager.actualWalkItem.endPosition withActualPosAt:userLocation.location]){
            [self stopRecordingWalk];
        }
    }
}



/*
 Method userInfo with adress as argument is called when adress has been decoded and
 notification sent about that. This method as in name uses userInfo to fetch saved
 adress data to show route to that adress.
 */
-(void)userInfo:(NSNotification *)adress{
    if(adress){

        NSMutableString * adressText = [adress.userInfo valueForKey:@"address"];
        CLLocation * proposedEndLocation = [adress.userInfo valueForKey:@"endLocation"];
        NSDictionary * adressEndDictionary = [adress.userInfo valueForKey:@"addressDictionary"];
        
        if(![self.walkManager checkIfWalkInProgress] && adressText && adressEndDictionary && proposedEndLocation){
            
            //1. accept location as new end adress, 2. update info text, 3. create and add pin, 4. create and add route
            self.walkManager.actualWalkItem.endPosition = proposedEndLocation;
            self.toTextField.text = adressText;
            self.endPinAdress = adressEndDictionary;
            //remove any old pin
            if(self.endPin){
                [self.mapView removeAnnotation:self.endPin];
            }
            
            self.endPin = [self createPinForLocation:self.walkManager.actualWalkItem.endPosition withName:@"Goal"];
            [self.mapView addAnnotation:self.endPin];
            [self drawTheRouteWithEndAt:self.endPin andDictionaryAdress:self.endPinAdress];
            
            
        }
    }
}


/*
 Method decodeAdressForLocation uses geocoder to retrieve location data for given
 location with latitude and longtitude coordinations. When data has been retrieved
 method checks if its detailed enough to show route to that location. If yes then
 method sends notification to set up this location as new goal location.
 */
-(void)decodeAdressForLocation:(CLLocation*)location{
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(userInfo:)
                                                 name:@"AddressReceivedNotification"
                                               object:nil];
    CLGeocoder * __block geocoder;
    CLPlacemark * __block placemark;
    geocoder = [[CLGeocoder alloc] init];
    
    [geocoder reverseGeocodeLocation:location completionHandler:^(NSArray *placemarks, NSError *error) {
      //  NSLog(@"Found placemarks: %@, error: %@", placemarks, error);
       
        if (error == nil && [placemarks count] > 0) {
            placemark = [placemarks lastObject];
            NSString * adress;
            NSString * gateNr = placemark.subThoroughfare;
            NSString * gate = placemark.thoroughfare;
            NSString * city = placemark.locality;
            NSLog(@"GNR %@,G %@,CITY %@", gateNr,gate, city);
            NSDictionary * dictionaryForLocation = placemark.addressDictionary;
            
            if(gateNr && ![gateNr containsString:@"(null)"]){
                adress = gateNr;
            } else {
                adress = @"";
            }
            if(gate && ![gate containsString:@"(null)"]){
                if([adress  isEqual: @""]){
                    adress = gate;
                } else {
                    adress = [NSString stringWithFormat:@"%@,%@",adress, gate ];
                }
                
            }
            if(city && ![city containsString:@"(null)"]){
                if(![adress  isEqual: @""]){
                    adress = [NSString stringWithFormat:@"%@,%@",adress, city];
                }
                
            }
            
            //only city is not enough to show route on map, it suffices for Pin of location but app goal is to show route
            if(adress.length > city.length ){
                [[NSNotificationCenter defaultCenter] postNotificationName:@"AddressReceivedNotification"
                                                                    object:self
                                                                  userInfo:@{ @"address" : adress, @"addressDictionary": dictionaryForLocation, @"endLocation": location }];
            } else {
                [EAEMessagePopUp showMessageInParentView:self.view andText:@"Couldn't retrieve adress, try again in a moment and touch road on map."];
            }

        } else {
            NSLog(@"It didn't work to retrieve adress for location.\n%@", error.debugDescription);
        }
    } ];
}

/*
 Method createEndResult is called when a walk has been finished and user is to be
 informed about walk result and given opportunity to save that walk in favorites.
 */
-(void)createEndResult{
  
    NSString * result;
    EAEWalkItem * walkObj= self.walkManager.actualWalkItem;
    
    //could just rip off from label?
    NSString * length = [NSString stringWithFormat:@"%f", walkObj.walkLength ];
    length = [self.walkManager stringToDoubleWith2Decimal:length];
    NSString * time = [self.walkManager countMinsAndSecsFromSeconds:walkObj.walkTime];
    [walkObj countWalkPace];
    NSString * pace =[self.walkManager stringToDoubleWith2Decimal: [walkObj.pace stringValue]];
    
    pace = [NSString stringWithFormat:@"%@ km/h", pace];
    result = [NSString stringWithFormat:@"Date: %@\n\nTime:%@\nLength:%@\nPace:%@", walkObj.walkDate, time, length, pace];
    [self displayResultMessage:result];

}


/*
 Method displayResultMessage creates message with argument being string message to
 be shown. It is used to show walk information when that walk ends. User is given
 choice to save or not save walk and short information about walk length and time.
 */
-(void)displayResultMessage:(NSString*)walkDataToShow{
    NSString * completeMessage = [NSString stringWithFormat:@"%@\n\nDo you want to save that walk to favorites?", walkDataToShow];
    
    EAEWalkItem * copiedItemToSave = [[EAEWalkItem alloc]initWith:self.walkManager.actualWalkItem.startPosition andWith:self.walkManager.actualWalkItem.endPosition andName:self.walkManager.actualWalkItem.walkName];
    copiedItemToSave.pace = self.walkManager.actualWalkItem.pace;
    copiedItemToSave.walkLength = self.walkManager.actualWalkItem.walkLength;
    copiedItemToSave.walkDate = self.walkManager.actualWalkItem.walkDate;
    copiedItemToSave.walkTime = self.walkManager.actualWalkItem.walkTime;
    
    NSLog(@"Obj to save info: %@, %@", copiedItemToSave.startPosition, copiedItemToSave.endPosition);
    UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"Walk result"
                                                                   message:completeMessage
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"Save" style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * action) {
                                                              //run the save method
                                                              [self.walkManager saveToFavorites:copiedItemToSave];
                                                          }];
    UIAlertAction * cancelAction = [UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:^(UIAlertAction * action){
        
    }];
    
    [alert addAction:defaultAction];
    [alert addAction:cancelAction];
    [self presentViewController:alert animated:YES completion:nil];

}

/*
 This method checks if two locations are withing short distance (20m) from each other
 and returns YES if its true, otherwise it returns NO;
 */
-(BOOL)checkIfNearGoal:(CLLocation*)goalPosition withActualPosAt:(CLLocation*)actualPos{
    BOOL isNear = NO;
    CLLocationDistance distance = [goalPosition distanceFromLocation:actualPos];
    if(distance <= 20){
        isNear = YES;
    }
    return isNear;
}


/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
