//
//  EAEWalkItem.m
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-17.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  EAEWalkItem class is used to represent a single walk made by user.

#import "EAEWalkItem.h"

@interface EAEWalkItem()

@end

@implementation EAEWalkItem

/*
 Method initWith is used to create object with name, start position and end position.
 */
-(instancetype)initWith: (CLLocation *) startPlace andWith:(CLLocation*)endPlace andName:(NSString *)walkTitle{
    self = [super init];
    if(self){
        self.startPosition = startPlace;
        self.endPosition = endPlace;
        self.walkName = walkTitle;
        self.isWalking = NO;
        self.walkLength = 0;
        NSDate * actualDate = [NSDate date];
        self.walkDate = actualDate;
        NSLog(@"Walk created!");
        
    }
    return self;

}

/*
 Method initWithName is used to create new EAEWalkItem object with all properties
 being empty besides walkTitle.
 */
-(instancetype)initWithName:(NSString*)walkTitle{
    self = [super init];
    if(self){
        self.walkName = walkTitle;
        self.isWalking = NO;
        self.walkLength = 0;
        NSDate * actualDate = [NSDate date];
        self.walkDate = actualDate;
        NSLog(@"Walk created!");
        
    }
    return self;
}


/*
 This method count and assigns walking pace to EAEWalkItem object using distance
 and time properties of that object.
 */
-(void)countWalkPace{
    double hours = [self.walkTime doubleValue] / 60 /60;
    self.pace = @(self.walkLength / hours);
}

/*
 Method initWithCoder creates and returns new object of EAEWalkItem created with
 help of information gained by loading data with help of decoding.
 */
-(id)initWithCoder:(NSCoder *)aDecoder{
    self = [super init];
    if(self){
        self.walkName = [aDecoder decodeObjectForKey:@"walkName"];
        self.walkDate = [aDecoder decodeObjectForKey:@"walkDate"];
        self.walkTime = [aDecoder decodeObjectForKey:@"walkTime"];
        self.startPosition = [aDecoder decodeObjectForKey:@"startPosition"];
        self.endPosition = [aDecoder decodeObjectForKey:@"endPosition"];
        self.walkLength = [[aDecoder decodeObjectForKey:@"walkLength"] doubleValue];
        self.pace = [aDecoder decodeObjectForKey:@"pace"];
        self.startAdress = [aDecoder decodeObjectForKey:@"startAdress"];
        self.endAdress = [aDecoder decodeObjectForKey:@"endAdress"];
        self.isWalking = NO;
    }
    return self;
}

/*
 Method encodeWithCoder encodes EAEWalkItem objects property data to be saved later
 in defaults.
 */
-(void)encodeWithCoder:(NSCoder *)aCoder{
    [aCoder encodeObject:self.walkName forKey:@"walkName"];
    [aCoder encodeObject:self.walkTime forKey:@"walkTime"];
    [aCoder encodeObject:self.walkDate forKey:@"walkDate"];
    [aCoder encodeObject:self.startPosition forKey:@"startPosition"];
    [aCoder encodeObject:self.endPosition forKey:@"endPosition"];
    [aCoder encodeObject:@(self.walkLength) forKey:@"walkLength"];
    [aCoder encodeObject:self.pace forKey:@"pace"];
    [aCoder encodeObject:self.startAdress forKey:@"startAdress"];
    [aCoder encodeObject:self.endAdress forKey:@"endAdress"];
}

@end
