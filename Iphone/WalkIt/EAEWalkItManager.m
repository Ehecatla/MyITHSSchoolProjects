//
//  EAEWalkItManager.m
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-17.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  Class WalkItManager is used to manage data for whole application.

#import "EAEWalkItManager.h"



@interface EAEWalkItManager ()

@property (nonatomic, strong, readwrite) NSMutableArray * favoriteWalkList; //favorite walks
@property (nonatomic, strong, readwrite) NSMutableArray * archivedFavoriteWalkList;
@property (nonatomic, strong, readwrite) EAEWalkItem * actualWalkItem;
@property (nonatomic, strong, readwrite) NSMutableDictionary * walksStatistic;

-(void)updateAdressOnReady:(NSNotification*)result;
-(void)decodeStartEndAdressFor:(EAEWalkItem*)walkObject andPositionIsStart:(BOOL)isStart;
-(void)saveFavoriteOnReady:(NSNotification*)ready;
-(NSMutableDictionary*)formatAndReturnTime:(double)time andDistance:(double)distance;
-(NSMutableDictionary*)giveDefaultStatisticDictionary;

@end

@implementation EAEWalkItManager


/*
 Use this public method to get instance of EAEWalkItManager.
 */
+(id) sharedManager{
    static EAEWalkItManager * sharedManager = nil;
    @synchronized(self) {
        if(sharedManager ==nil){
            sharedManager = [[self alloc]init];
        }
    }
    return sharedManager;
}


/*
 This initializer is used to create new object of EAEWalkItManager and load both
 favorite and walk statistic data.
 */
-(instancetype)init{
    self = [super init];
    if(self){
        self.favoriteWalkList = [[NSMutableArray alloc]init];
        [self loadFavorites];
        [self loadWalkStatistic];
    }
    return self;
}


/*
 Method createNewWalkWithName can be used to create new actualWalk item object.
 */
-(void)createNewWalkWithName:(NSString*)name{
    self.actualWalkItem = [[EAEWalkItem alloc]initWithName:name];
}


/*
 Method updateStartPosition can be used to set new start position for EAEWalkItem
 object referenced by actualWalkItem property in EAEWalkItManager. Takes new CLLocation
 object as argument.
 */
-(void)updateStartPosition:(CLLocation*)newStartPosition{
    self.actualWalkItem.startPosition = newStartPosition;
}


/*
 Method updateEndPosition can be used to set new end position for EAEWalkItem
 object referenced by actualWalkItem property in EAEWalkItManager.
 */
-(void)updateEndPosition:(CLLocation*)newEndPosition{
    self.actualWalkItem.endPosition = newEndPosition;
}


/*
 Method updateActualPosition can be used to set new actual position for EAEWalkItem
 object referenced by actualWalkItem property in EAEWalkItManager.
 */
-(void)updateActualPosition:(CLLocation*)newPosition{
    self.actualWalkItem.actualPosition = newPosition;
}


/*
 Method addWalkStartPosition andEndPosition can be used to update both start and
 end position of property actualWalk which is reference to EAEWalkItem object.
 */
-(void)addWalkStartPosition:(CLLocation*)start andEndPosition:(CLLocation*)end{
    self.actualWalkItem.startPosition = start;
    self.actualWalkItem.endPosition = end;
}


/*
 Method checkIfWalkInProgess is fast shortuct method to check if EAEWalkitem object
 linked in property actualWalk of EAEWalkItManager is in progress/active stance 
 (returns YES then) or not.
 */
-(BOOL)checkIfWalkInProgress{
    return self.actualWalkItem.isWalking;
}


/*
 Method loadFavorites loads favorite walks that have been saved in defaults. This
 method recreates archivized EAEWalkItem objects that represent already made walks.
 */
-(void)loadFavorites{
    NSUserDefaults * settings = [NSUserDefaults standardUserDefaults];
    if([settings valueForKey:@"ARCHIVED_FAVORITES"]){
        NSArray * archivedWalks =[settings objectForKey:@"ARCHIVED_FAVORITES"];
        self.archivedFavoriteWalkList = [archivedWalks mutableCopy];
        
        self.favoriteWalkList = [[NSMutableArray alloc]init];
        for (NSData * codedObject in self.archivedFavoriteWalkList){
            EAEWalkItem * walkObject = [NSKeyedUnarchiver unarchiveObjectWithData:codedObject];
            [self.favoriteWalkList addObject:walkObject];
        }
        NSLog(@"Favorite list loaded, number of items: %lul", (unsigned long)self.favoriteWalkList.count);
        
    } else {
        self.archivedFavoriteWalkList = [[NSMutableArray alloc]init];
        self.favoriteWalkList = [[NSMutableArray alloc]init];
    }
    [settings synchronize];
}


/*
 Method saveToFavorites takes EAEWalkItem object as argument and saves it to favorites
 in few steps. First both start and end adresses are fetched for that walk object,
 then its added to favorite list property and archivized and saved in default data.
 */
-(void)saveToFavorites:(EAEWalkItem*)walkToSave{
    //get start and end adress
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(saveFavoriteOnReady:)
                                                 name:@"StartAndEndAdressFetched"
                                               object:nil];
    [self decodeStartEndAdressFor:walkToSave andPositionIsStart:YES];
}

/*
 Method saveeFavoriteOnReady is last and final method used to save favorite item data
 after all necessary information for that object has been completed. This method
 archivizes object of EAEWalkItem. This method is called when notification about
 completed data for object has been launched.
 */
-(void)saveFavoriteOnReady:(NSNotification*)ready{
    EAEWalkItem * readyObject = [ready.userInfo valueForKey:@"walkObject"];
    NSUserDefaults * settings = [NSUserDefaults standardUserDefaults];
    
    NSData * data = [NSKeyedArchiver archivedDataWithRootObject:readyObject];
    [self.archivedFavoriteWalkList addObject:data];
    if(![self.favoriteWalkList containsObject:readyObject]){
        [self.favoriteWalkList addObject:readyObject];
    }
    [settings setObject:self.archivedFavoriteWalkList forKey:@"ARCHIVED_FAVORITES"];
    [settings synchronize];
}


/*
 Method saveWalkStatistic saves EAEWalkItManagers EAEWalkItem objects time and km
 information, data is fetched from actualWalk property which represents latest 
 walk.
 */
-(void)saveWalkStatistic{
    NSString * dateToSave = [self formatNSDateToString:self.actualWalkItem.walkDate ];
    NSString * distance = [NSString stringWithFormat:@"%f",self.actualWalkItem.walkLength];
    NSString * time = self.actualWalkItem.walkTime;
    NSDictionary * walkInfoToSave =  @{@"time": time, @"distance": distance};
    
    if([self.walksStatistic objectForKey:dateToSave]){  //sum up day stat if any exists
       
        NSDictionary * actualStat = [self.walksStatistic objectForKey:dateToSave];
        double sumOfTime = [[actualStat objectForKey:@"time"] doubleValue] + [[walkInfoToSave objectForKey:@"time"] doubleValue];
        double sumOfDistance =  [[actualStat objectForKey:@"distance"] doubleValue] + [[walkInfoToSave objectForKey:@"distance"] doubleValue];
        
        time = [NSString stringWithFormat:@"%f",sumOfTime];
        distance = [NSString stringWithFormat:@"%f",sumOfDistance];
        walkInfoToSave = @{@"time": time, @"distance": distance};
       
    }
     NSLog(@"Saving statistic");
    [self.walksStatistic setObject:walkInfoToSave forKey:dateToSave];
    NSUserDefaults * settings = [NSUserDefaults standardUserDefaults];
    [settings setObject:self.walksStatistic forKey:@"EAEWALKIT_STATS"];
    [settings synchronize];

}


/*
 Method loadWalkStatistic runs when instance of EAEWalkItManager is created. It loads
 walk statistic saved for every day person made walk from defaults.
 */
-(void)loadWalkStatistic{
    NSUserDefaults * settings = [NSUserDefaults standardUserDefaults];
    if([settings valueForKey:@"EAEWALKIT_STATS"]){
        NSMutableDictionary * statistic =[[settings objectForKey:@"EAEWALKIT_STATS"] mutableCopy];
        self.walksStatistic = statistic; //contains dictionaries sorted on date
         NSLog(@"Loaded stats!!! %@", statistic);
    } else {
        self.walksStatistic = [[NSMutableDictionary alloc]init];
    }
    [settings synchronize];
}


/*
 Method formatNSDateToString takes NSDate object as argument and return it as string
 representation of date in format yyyy-MM-dd.
 */
-(NSString*)formatNSDateToString:(NSDate*)theDate{
    NSDateFormatter *dateFormatter=[[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
    NSString * formatedDate = [dateFormatter stringFromDate:theDate];
    return formatedDate;
}

/*
 Method formatNSDateAndReturnParts takes NSDate as argument and returns an array
 of string objects that are parts of this date with item at position 0 is month
 name, item at position 1 is day as number.
 */
-(NSArray*)formatNSDateAndReturnParts:(NSDate*)theDate{
    NSDateFormatter *dateFormatter=[[NSDateFormatter alloc] init];
    dateFormatter.dateStyle = NSDateFormatterLongStyle;
    dateFormatter.timeStyle = NSDateFormatterNoStyle;
    NSString * formatedDate = [dateFormatter stringFromDate:theDate];
    // Month DD, yyyy
    NSString * datePart = @"";
    NSMutableArray * items = [[NSMutableArray alloc]init];
    for(int i=0;i< formatedDate.length; i++){
        if([formatedDate characterAtIndex:i] == ' ' && [formatedDate characterAtIndex:i-1] != ','){
            datePart = [formatedDate substringToIndex:i];
            [items addObject:datePart];
        } else if ([formatedDate characterAtIndex:i] == ' '){
            NSString * dayPart = [formatedDate substringToIndex:i-1];
             dayPart = [dayPart substringFromIndex:datePart.length];
            [items addObject:dayPart];
        }
    }
    NSLog(@"test month %@, and day %@", items[0], items[1]);
    return items;
}

/*
 Method formatNSDateToString takes NSDate object as argument and return it as string
 representation of date in format yyyy-MM-dd HH:mm:ss.
 */
-(NSString*)formatNSDateToStringWithHours:(NSDate*)theDate{
    NSDateFormatter *dateFormatter=[[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd hh:mm"];
    NSString * formatedDate = [dateFormatter stringFromDate:theDate];
    return formatedDate;
}


/*
 Method decodeStartEndAdressFor is used to fetch both start and end adress for a walk
 of given EAEWalkItem object. This method decodes start adress if argument sent is YES
 and if its sent with value NO then it decodes end adress instead.
 */
-(void)decodeStartEndAdressFor:(EAEWalkItem*)walkObject andPositionIsStart:(BOOL)isStart{

    CLGeocoder * __block geocoder;
    CLPlacemark * __block placemark;
    geocoder = [[CLGeocoder alloc] init];
    CLLocation * locationToCheck;
    NSString * notificationName;
    
    NSLog(@"Favorite object to save: %@ start distance, %@ end location", walkObject.startPosition, walkObject);
    
    if(isStart){
        locationToCheck = [[CLLocation alloc]initWithLatitude:walkObject.startPosition.coordinate.latitude longitude:walkObject.startPosition.coordinate.longitude];
        notificationName = @"FinishedGettingStartAdressData";
   
    } else {
        locationToCheck =[[CLLocation alloc]initWithLatitude:walkObject.endPosition.coordinate.latitude longitude:walkObject.endPosition.coordinate.longitude];
        notificationName = @"FinishedGettingEndAdressData";

    }
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(updateAdressOnReady:)
                                                name:notificationName
                                                object:nil];

    [geocoder reverseGeocodeLocation:locationToCheck completionHandler:^(NSArray *placemarks, NSError *error) {
            if (error == nil && [placemarks count] > 0) {
                placemark = [placemarks lastObject];
                NSString * adress;
                NSString * gateNr = placemark.subThoroughfare;
                NSString * gate = placemark.thoroughfare;
                NSString * city = placemark.locality;
                
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
                if([adress isEqualToString:@""]){ //means didnt manage to get any data
                    adress = @"Error: couldn't retrieve adress.";
                }
              
                [[NSNotificationCenter defaultCenter] postNotificationName:notificationName
                                                                        object:self
                                                                      userInfo:@{ @"address" : adress, @"walkObject": walkObject }];

            } else {
                NSLog(@"WalkItManager: It didn't work to retrieve adress for location.\n%@", error.debugDescription);
            }
    } ];
}


/*
 Method updateAdressOnReady is called when notification "FinishedGettingStartAdressData"
 is sent. This method ensures that both start and end position adresses of an EAEWalkItem
 object are decoded. A check is made, if one of adresses is missing then this method
 starts decodeStartAndEndAdress method which fetches it and launches earlier named
 notification. When both adresses are decoded (they cannot be decoded at same time)
 this method launches notification StartAndEndAdressFetched.
 */
-(void)updateAdressOnReady:(NSNotification*)result{
     EAEWalkItem * walkObject =  [result.userInfo valueForKey:@"walkObject"];
    if([result.name isEqualToString:@"FinishedGettingStartAdressData"]){
        walkObject.startAdress = [result.userInfo valueForKey:@"address"];
        if(walkObject.endAdress == NULL){
            [self decodeStartEndAdressFor:walkObject andPositionIsStart:NO];
        }
        
    } else if ([result.name isEqualToString:@"FinishedGettingEndAdressData"]){
        walkObject.endAdress = [result.userInfo valueForKey:@"address"];
        if(walkObject.startAdress == NULL){
            [self decodeStartEndAdressFor:walkObject andPositionIsStart:YES];
        }
    }
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:result.name
                                                  object:nil];
    if(walkObject.startAdress && walkObject.endAdress){
        [[NSNotificationCenter defaultCenter] postNotificationName:@"StartAndEndAdressFetched"
                                                            object:self
                                                          userInfo:@{  @"walkObject": walkObject }];
    }
}



/*
 Method countMinsAndSecsFromSeconds takes string with number of seconds as argument
 and then it returns another string with neatly formated time information in format
 X min Y sec.
 */
-(NSString*)countMinsAndSecsFromSeconds:(NSString*)seconds{
    NSString * minutesAndSeconds;
    int minutes = [seconds doubleValue]/60;
    int secondsRest = [seconds integerValue] % 60;
    if(secondsRest > 0){
        // [self stringToDoubleWith2Decimal:[NSString stringWithFormat:@"%f", secondsRest]];
        minutesAndSeconds = [NSString stringWithFormat:@"%d min %d sec",minutes,secondsRest];
    } else {
        minutesAndSeconds = [NSString stringWithFormat:@"%d min",minutes];
    }
    
    return minutesAndSeconds;
}

/*
 Method stringToDoubleWith2Decimal changes string argument representation of number
 with plenty decimals to string representation of double number with just two decimal.
 Then it returns it.
 */
-(NSString*)stringToDoubleWith2Decimal:(NSString*)numberAsString{
    double number;
    number = [numberAsString doubleValue];
    NSNumberFormatter *stringFormatter = [[NSNumberFormatter alloc] init];
    [stringFormatter setNumberStyle:NSNumberFormatterDecimalStyle];
    [stringFormatter setMaximumFractionDigits:2];
    [stringFormatter setRoundingMode: NSNumberFormatterRoundUp];
    NSString *numberWith2Decimal = [stringFormatter stringFromNumber:[NSNumber numberWithFloat:number]];
    return numberWith2Decimal;
}


/*
 Metho returnFavoritePrintDataForWalk takes an EAEWalkItem object as argument and
 returns a dictionary with formatted properties of that object, ready to show on
 favorite table. Formatted values are name (to include date), time, pace and distance.
 */
-(NSDictionary*)returnFavoritePrintDataForWalk:(EAEWalkItem*)walkItem{
    NSMutableDictionary * favoritePrintData = [[NSMutableDictionary alloc]init];
    
    // Walk Name
    NSString * betterDate = [self formatNSDateToStringWithHours:walkItem.walkDate];
   NSString * name = [NSString stringWithFormat:@"%@, %@", walkItem.walkName, betterDate];
    [favoritePrintData setObject:name forKey:@"name"];
    NSString * distance = [NSString stringWithFormat:@"%@ km", [self stringToDoubleWith2Decimal:[@(walkItem.walkLength) stringValue]]];
    [favoritePrintData setObject:distance forKey:@"distance"];
    NSString * time = [self countMinsAndSecsFromSeconds:walkItem.walkTime];
    [favoritePrintData setObject:time forKey:@"time"];
    NSString * pace = [NSString stringWithFormat:@"%@ km/h", [self stringToDoubleWith2Decimal:[walkItem.pace stringValue]]];
    [favoritePrintData setObject:pace forKey:@"pace"];
    [favoritePrintData setObject:walkItem.startAdress forKey:@"startAdress"];
    [favoritePrintData setObject:walkItem.endAdress forKey:@"endAdress"];
    
    return [favoritePrintData copy];
}

/*
 Method countAndReturnDayStatistic checks what day it is and then fetches that day
 data if any exists. If no data exists for that day then default dictionary is
 returned with short info of no data for the day.
 */
-(NSDictionary*)countAndReturnDayStatistic{
    NSMutableDictionary * dayStatistic = [[NSMutableDictionary alloc]init];
    NSDate * today = [NSDate date];
    NSString * todayString = [self formatNSDateToString:today];
    dayStatistic = [[self.walksStatistic objectForKey:todayString] mutableCopy];
    
    if(![dayStatistic objectForKey:@"time"]){
        dayStatistic = [self giveDefaultStatisticDictionary];
    } else {
       dayStatistic = [self formatAndReturnTime:[[dayStatistic objectForKey:@"time"] doubleValue] andDistance:[[dayStatistic objectForKey:@"distance"] doubleValue]];
    }
    
    return [dayStatistic copy];
}

-(NSDictionary*)countAndReturnWeekStatistic2{
    NSMutableDictionary * weekStatistic = [[NSMutableDictionary alloc]init];

    return weekStatistic;
}


/*
 Method countAndReturnWeekStatistic is used to count statistic of all time and
 distance walks made during actual week with help of this application where user
 has actively started and ended walk by reaching goal or stopping walk.
 */
-(NSDictionary*)countAndReturnWeekStatistic{
 
    NSMutableDictionary * weekStatistic = [[NSMutableDictionary alloc]init];
    NSDate * today = [NSDate date];
    NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    NSDateComponents *dateParts = [calendar components:NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitWeekOfYear | NSCalendarUnitWeekday fromDate:today];
    [calendar setFirstWeekday:2];
    NSUInteger todaysNr = [dateParts weekday];
    
    if(todaysNr == 2){ //if monday, just 1 day of actual week statistic
        weekStatistic = [self countAndReturnDayStatistic].mutableCopy;
    } else {
        double time =0;
        double distance = 0;
        //get monday of the week
        NSDate *beginningOfWeek = nil;
        [calendar rangeOfUnit:NSCalendarUnitWeekOfYear startDate:&beginningOfWeek
                               interval:NULL forDate: today];
        
        int dayCounter = 0;
        int compareNr;
        if(todaysNr == 1){ //sunday has nr 1 in calendar but need to loop through 6 days then
            compareNr = 6;
        } else {
            compareNr = todaysNr;
        }
        
        while(dayCounter <= compareNr){
            int hourToAdd = 86400 * dayCounter;
            NSDate *weekDay = [beginningOfWeek dateByAddingTimeInterval: hourToAdd];
            NSString * weekDayString = [self formatNSDateToString:weekDay];
            if([self.walksStatistic objectForKey:weekDayString]){
                NSDictionary * dayDictionary = [self.walksStatistic objectForKey:weekDayString];
                time = time + [[dayDictionary objectForKey:@"time"] doubleValue];
                distance = distance + [[dayDictionary objectForKey:@"distance"] doubleValue];
            }
            dayCounter = dayCounter + 1;
        }
        
        if(time > 0 && distance >0){
            weekStatistic = [self formatAndReturnTime:time andDistance:distance];
        } else {
            weekStatistic = [self giveDefaultStatisticDictionary];
        }
    }
    
    return weekStatistic.copy;
}



/*
 Method countAndReturnMonthStatistic is used to count statistic of all time and
 distance walks made during actual month with help of this application where user 
 has actively started and ended walk by reaching goal or stopping walk.
 */
-(NSDictionary*)countAndReturnMonthStatistic{
    NSMutableDictionary * monthStatistic = [[NSMutableDictionary alloc]init];
    NSDate * today = [NSDate date];
    NSString * todayString = [self formatNSDateToString:today];
    NSString * relevantDate = [todayString substringToIndex:7];
    double time = 0.0;
    double distance= 0.0;
    NSArray *keys = [self.walksStatistic allKeys];
    for(NSString * dateKey in keys){
        if(dateKey && [dateKey containsString:relevantDate]){
            NSDictionary * keyDictionary = [self.walksStatistic objectForKey:dateKey];
            time = time + [[keyDictionary objectForKey:@"time"] doubleValue];
            distance = distance + [[keyDictionary objectForKey:@"distance"] doubleValue];
        }
    }
    if(time > 0 && distance > 0){
        monthStatistic = [self formatAndReturnTime:time andDistance:distance];
    } else {
        monthStatistic = [self giveDefaultStatisticDictionary];
    }
    
    return monthStatistic.copy;
}



/*
 Method giveDefaultStatisticDictionary is help method used to fill default time and
 distance information (which is then returned in dictionary form) when there is
 no statistic data to show saved in application.
 */
-(NSMutableDictionary*)giveDefaultStatisticDictionary{
    NSMutableDictionary * statistic = [[NSMutableDictionary alloc]init];
    [statistic setObject:@"none" forKey:@"time"];
    [statistic setObject:@"none" forKey:@"distance"];
    return statistic;
}


/*
 Method formatAndReturnTime andDistance takes time and distance in double value, 
 returns them as neat statistic ready to show.
*/
-(NSMutableDictionary*)formatAndReturnTime:(double)time andDistance:(double)distance{
    NSMutableDictionary * dataToReturn = [[NSMutableDictionary alloc]init];
    NSString * formatedTime = [self countMinsAndSecsFromSeconds:[NSString stringWithFormat:@"%f",time]];
    NSString * formatedDistance = [self stringToDoubleWith2Decimal:[NSString stringWithFormat:@"%f",distance]];
    formatedDistance = [NSString stringWithFormat:@"%@ km", formatedDistance ];
    [dataToReturn setObject:formatedTime forKey:@"time"];
    [dataToReturn setObject:formatedDistance forKey:@"distance"];
    return dataToReturn;
}




@end
