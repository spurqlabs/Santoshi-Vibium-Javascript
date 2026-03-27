'use strict'

const { Given, When, Then } = require('@cucumber/cucumber')
const LoginPage       = require('../pages/loginpage')
const MyTimesheetPage = require('../pages/mytimesheet')
const MyInfoPage      = require('../pages/myInfoPage')

// ── Background Steps ─────────────────────────────────────────────────────────

Given('user is on OrangeHRM login page', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.open()
})

When('user enter username', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.enterUsername()
})

When('user enter password', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.enterPassword()
})

When('user click on Login button', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.clickLoginButton()
})

Then('the user is logged in to the application', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.isLoggedIn()
})

// ── TC002: Add Timesheet Details ─────────────────────────────────────────────

Given('user is on Dashboard page', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.isDashboardDisplayed()
})

When('user navigates to Time -> Timesheets', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.clickTimeMenu()
})

Then('ViewEmployeeTimesheet page is displayed', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.isEmployeeTimesheetPageDisplayed()
})

When('User click on Timesheet option', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.clickTimesheetsTab()
})

Then('Timesheet dropdown list is displayed', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.isTimesheetsDropdownVisible()
  
})

When('user select My Timesheets option from the Timesheet dropdown', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.selectMyTimesheets()
})

Then('ViewMyTimesheet page is displayed', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.isViewMyTimesheetPageDisplayed()
})

When('User click on Edit button', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.clickEditButton()
})

Then('EditTimesheet page is displayed', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.isEditTimesheetPageDisplayed()
})

When('User click on Cancel button', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.clickCancelButton()
})

Then('View MyTimesheet page is displayed', function () {
  const page = new MyTimesheetPage(this.vibe)
  page.isViewMyTimesheetPageDisplayed()
})



