export class AngularCliTestPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('angular-cli-test-app p')).getText();
  }
}
