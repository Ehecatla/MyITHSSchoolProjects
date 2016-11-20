//
//  EAEMessagePopUp.h
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-30.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  EAEMessagePopUp class is used to show a pop up view message with text on it for
//  a short duration time.

#import <UIKit/UIKit.h>

@interface EAEMessagePopUp : UIView

+ (void)showMessageInParentView: (UIView *)view andText:(NSString *)text;


@end
