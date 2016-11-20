//
//  EAEMessagePopUp.m
//  WalkIt
//
//  Created by ITHS-Ella on 2016-04-30.
//  Copyright © 2016 ITHS-Ella. All rights reserved.
//
//  EAEMessagePopUp class is used to show a pop up view message with text on it for
//  a short duration time.

#import "EAEMessagePopUp.h"

@interface EAEMessagePopUp()

@property (strong, nonatomic) NSString * message;
@property (nonatomic, strong) UILabel * messageLabel;
-(void)createLabelWithMessage:(NSString*)message;

@end

@implementation EAEMessagePopUp


/*
 Method createLabelWithMessage takes string being message to show as argument, 
 creates UILabel object with that message and adds it to the EAEMessagePopUp view
 that called this method.
 */
-(void)createLabelWithMessage:(NSString*)message{
    CGRect frameForLabel = CGRectMake(5.0, 5.0, self.frame.size.width - 10.0, self.frame.size.height - 10.0);
    self.messageLabel = [[UILabel alloc]initWithFrame:frameForLabel];
    self.messageLabel.text = message;
    self.messageLabel.backgroundColor = [UIColor whiteColor];
    self.messageLabel.textAlignment = NSTextAlignmentCenter;
    self.messageLabel.textColor = [UIColor blackColor];
    self.messageLabel.numberOfLines = 2;
    self.messageLabel.font = [UIFont systemFontOfSize:12.0];
    self.messageLabel.lineBreakMode = NSLineBreakByCharWrapping;
    [self addSubview:self.messageLabel];
}


/*
 Static method showMessageInParentView creates new instance of EAEMessagePopUp and
 pans it for a short duration of time on parent view that was sent with argument.
 Message shown is same as given in text argument. If there is message showing already
 in parent view (of class EAEMessagePopUP) then new message will be placed above it
 to ensure that there is no overlapping and user can see all messages.
 */
+ (void)showMessageInParentView: (UIView *)view andText:(NSString *)text{
    double MessageHeight = 50;
    double SpaceBetweenMessages = 10;
    int messagesShowingInParentView = 0;
    
    for (UIView *anyView in [view subviews]) {  //check if any message is showing already
        if ([anyView isKindOfClass:[EAEMessagePopUp class]]){
            messagesShowingInParentView = messagesShowingInParentView +1;
        }
    }
    
    CGRect parentFrame = view.frame; // get the frame of parent view!
    double yOfMessageFrame = parentFrame.size.height - (70.0 + MessageHeight * messagesShowingInParentView + SpaceBetweenMessages * messagesShowingInParentView);
    CGRect thisMessageFrame = CGRectMake(parentFrame.origin.x + 20.0, yOfMessageFrame, parentFrame.size.width - 40.0, MessageHeight);
    
    EAEMessagePopUp * messageView = [[EAEMessagePopUp alloc] initWithFrame:thisMessageFrame];
    messageView.backgroundColor = [UIColor whiteColor];
    messageView.alpha = 0.0f;
    messageView.layer.cornerRadius = 4.0;
    messageView.message = text;
    [messageView createLabelWithMessage:text];
    [view addSubview:messageView];
    
    [UIView animateWithDuration:0.3 animations:^{
        messageView.alpha = 0.9f;
        messageView.messageLabel.alpha = 0.9f;
    }completion:^(BOOL finished) {
        if(finished){
            
        }
    }];
    [messageView performSelector:@selector(showMessageForTime) withObject:nil afterDelay:3];
    
}


/*
 Method showMessageForTime ensures that message object of EAEMessagePopUp class 
 dissapears from parent view in short duration of time when called. This method
 animates dissaperance of view which is set to end in transparent state and then 
 removes that view from superview.
 */
-(void)showMessageForTime{
    [UIView animateWithDuration:0.3 animations:^{
        self.alpha = 0.0;
        self.messageLabel.alpha = 0.0;
    }completion:^(BOOL shown) {
        if(shown){ //when animation completed remove from superview
            [self removeFromSuperview];
        }
    }];
}

@end
