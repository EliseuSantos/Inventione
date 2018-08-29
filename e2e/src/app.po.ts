/*
 * Use the Page Object pattern to define the page under test.
 * See docs/coding-guide/e2e-tests.md for more info.
 */

import { browser, element, by } from 'protractor';

export class AppPage {
  usernameField = element(by.css('input[formControlName="username"]'));
  passwordField = element(by.css('input[formControlName="password"]'));
  nameField = element(by.css('input[formControlName="name"]'));
  birthdateField = element(by.css('input[formControlName="birthdate"]'));
  ageField = element(by.css('input[formControlName="age"]'));
  genderField = element(by.css('input[formControlName="gender"]'));
  registerButton = element(by.css('button[type="submit"]'));

  constructor() {
    // Forces default language
    this.navigateTo();
    browser.executeScript(() => localStorage.setItem('language', 'en-US'));
  }

  navigateTo() {
    return browser.get('/');
  }

  register() {
    this.usernameField.sendKeys('test@gmail.com');
    this.passwordField.sendKeys('123456');
    this.nameField.sendKeys('Eliseu dos Santos');
    this.birthdateField.sendKeys('02/06/1995');
    this.ageField.sendKeys('23');
    this.genderField.sendKeys('Masculino');
    this.registerButton.click();
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
