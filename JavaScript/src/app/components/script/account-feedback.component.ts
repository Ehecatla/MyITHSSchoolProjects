import {Component, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'account-feedback',
  providers: [],
  templateUrl: '../html/account-feedback.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [],
  pipes: []
})
export class AccountFeedbackComponent {
  @Input() feedback: string;
}