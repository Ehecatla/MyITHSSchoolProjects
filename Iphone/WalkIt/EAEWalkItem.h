//
//  EAEWalkItem.h
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-17.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  EAEWalkItem class is used to represent a single walk made by user.

#import <Foundation/Foundation.h>
//#import "EAEWalkMapPin.h"
#import <MapKit/MapKit.h>

@interface EAEWalkItem : NSObject <NSCoding>

@property (strong, nonatomic) NSString * walkName;
@property (strong, nonatomic) NSNumber * pace;       //km/h
@property (nonatomic) BOOL isWalking;                //if actualWalkItem is to be changed or not
@property (nonatomic, strong) NSDate * walkDate;
@property (nonatomic) double walkLength;            //in kilometers
@property(nonatomic,strong) NSString * walkTime;    //in seconds

@property(nonatomic) CLLocation * startPosition;    
@property(nonatomic) CLLocation * endPosition;
@property(nonatomic) CLLocation * actualPosition;   //during active walk

@property(nonatomic, strong) NSString * startAdress;
@property(nonatomic, strong) NSString * endAdress;

 
-(instancetype)initWith: (CLLocation *) startPlace andWith:(CLLocation*)endPlace andName:(NSString*)walkTitle;
-(instancetype)initWithName:(NSString*)walkTitle;
-(void)countWalkPace;

//implementing of coding protocol methods
-(id)initWithCoder:(NSCoder *)aDecoder;
-(void)encodeWithCoder:(NSCoder *)aCoder;

@end
