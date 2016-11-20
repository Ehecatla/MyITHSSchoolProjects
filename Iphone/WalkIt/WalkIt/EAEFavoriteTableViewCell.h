//
//  EAEFavoriteTableViewCell.h
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-18.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface EAEFavoriteTableViewCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *cellWalkName;
@property (weak, nonatomic) IBOutlet UILabel *cellStartPoint;
@property (weak, nonatomic) IBOutlet UILabel *cellEndPoint;
@property (weak, nonatomic) IBOutlet UILabel *cellTime;
@property (weak, nonatomic) IBOutlet UILabel *cellDistance;
@property (weak, nonatomic) IBOutlet UILabel *cellPace;

@end
