//
//  EAEStatsViewController.m
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-28.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  EAEStatsViewController class is used to handle showing statistic for user.

#import "EAEStatsViewController.h"
#import "EAEWalkItManager.h"

@interface EAEStatsViewController ()

@property (weak, nonatomic) IBOutlet UILabel *todayDistanceLabel;
@property (weak, nonatomic) IBOutlet UILabel *todayTimeLabel;
@property (weak, nonatomic) IBOutlet UILabel *weekDistanceLabel;
@property (weak, nonatomic) IBOutlet UILabel *weekTimeLabel;
@property (weak, nonatomic) IBOutlet UILabel *monthDistanceLabel;
@property (weak, nonatomic) IBOutlet UILabel *monthTimeLabel;
@property (strong,nonatomic) NSDate * actualDate;
@property (strong, nonatomic) EAEWalkItManager * walkManager;

@property (weak, nonatomic) IBOutlet UILabel *todayLabel;
@property (weak, nonatomic) IBOutlet UILabel *monthLabel;
@property (weak, nonatomic) IBOutlet UILabel *weekLabel;


@end

@implementation EAEStatsViewController


-(EAEWalkItManager*)walkManager{
    if(!_walkManager){
        _walkManager = [EAEWalkItManager sharedManager];
    }
    return _walkManager;
}

-(NSDate*)actualDate{
    if(!_actualDate){
        //fetch day date
        _actualDate = [NSDate date];
    }
    return _actualDate;
}

//[self.walkManager formatNSDateToString:_actualDate];

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self loadDayData];
    [self loadWeekData];
    [self loadMonthData];
   
}


-(void)loadDayData{
   NSDictionary * dayStatistic = [self.walkManager countAndReturnDayStatistic];
    self.todayTimeLabel.text = [dayStatistic objectForKey:@"time"];
    self.todayDistanceLabel.text = [dayStatistic objectForKey:@"distance"];
}
-(void)loadWeekData{
     NSDictionary * weekStatistic = [self.walkManager countAndReturnWeekStatistic];
    self.weekTimeLabel.text = [weekStatistic objectForKey:@"time"];
    self.weekDistanceLabel.text = [weekStatistic objectForKey:@"distance"];
}
-(void)loadMonthData{

    NSDictionary * monthStatistic = [self.walkManager countAndReturnMonthStatistic];
    self.monthTimeLabel.text = [monthStatistic objectForKey:@"time"];
    self.monthDistanceLabel.text = [monthStatistic objectForKey:@"distance"];
}




- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    
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
