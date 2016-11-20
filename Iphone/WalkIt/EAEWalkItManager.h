//
//  EAEWalkItManager.h
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-17.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  Class WalkItManager is used to manage data for whole application.

#import <Foundation/Foundation.h>
#import "EAEWalkItem.h"
#import <MapKit/MapKit.h>

@interface EAEWalkItManager : NSObject

@property (nonatomic, strong, readonly) NSMutableArray * favoriteWalkList;              //favorite walks
@property (nonatomic, strong, readonly) EAEWalkItem * actualWalkItem;                  //used when a walk is active
@property (nonatomic, strong, readonly) NSMutableDictionary * walksStatistic;

- (instancetype)init NS_UNAVAILABLE; //singleton
+(id) sharedManager;

-(void)loadFavorites;
-(void)saveToFavorites:(EAEWalkItem*)walkToSave;

-(BOOL)checkIfWalkInProgress;
-(void)updateActualPosition:(CLLocation*)newPosition;
-(void)addWalkStartPosition:(CLLocation*)start andEndPosition:(CLLocation*)end;
-(void)updateStartPosition:(CLLocation*)newStartPosition;
-(void)updateEndPosition:(CLLocation*)newEndPosition;
-(void)createNewWalkWithName:(NSString*)name;

-(void)saveWalkStatistic;
-(void)loadWalkStatistic;

-(NSString*)formatNSDateToString:(NSDate*)theDate;
-(NSString*)countMinsAndSecsFromSeconds:(NSString*)seconds;
-(NSString*)stringToDoubleWith2Decimal:(NSString*)numberAsString;
-(NSDictionary*)returnFavoritePrintDataForWalk:(EAEWalkItem*)walkItem;
-(NSArray*)formatNSDateAndReturnParts:(NSDate*)theDate;

-(NSDictionary*)countAndReturnDayStatistic;
-(NSDictionary*)countAndReturnWeekStatistic;
-(NSDictionary*)countAndReturnMonthStatistic;


@end
