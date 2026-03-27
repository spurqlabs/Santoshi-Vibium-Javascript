'use strict'

const configReader   = require('../utils/configreader')
const locatorReader  = require('../utils/locatorreader')
const testDataReader = require('../utils/testdatareader')
const Logger         = require('../utils/logger')

class MyTimesheetPage {
  /**
   * @param {object} vibe  vibium page instance from World
   */
  constructor(vibe) {
    this.vibe     = vibe
    this.baseUrl  = configReader.get('baseUrl')

    // Locator sections from time-locators.json
    this.commonLoc    = locatorReader.getSection('common')
    this.dashboardLoc = locatorReader.getSection('dashboard')
    this.sidebarLoc   = locatorReader.getSection('sidebar')
    this.empTsLoc     = locatorReader.getSection('viewEmployeeTimesheet')
    this.topNavLoc    = locatorReader.getSection('timesheetsTopNav')
    this.myTsLoc      = locatorReader.getSection('viewMyTimesheet')
    this.editLoc      = locatorReader.getSection('editTimesheet')

    // Test data for TC002 from timesheet.json
    this.tsData = testDataReader.getScenarioData('TC002 - Add Timesheet details')
    Logger.debug('MyTimesheetPage initialised')
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  /** Returns true if the Dashboard page is loaded */
  isDashboardDisplayed() {
    Logger.step('Verifying Dashboard page is displayed')
    try {
      this.vibe.find(this.dashboardLoc.pageHeader)
      Logger.info('Dashboard page verified successfully')
      return true
    } catch (e) {
      Logger.warn('Dashboard page header not found')
      Logger.error(e.message)
      return false
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Click Time in the sidebar and wait for the Time module page to load */
  clickTimeMenu() {
    Logger.step('Clicking Time menu in sidebar')
    this.vibe.find(this.sidebarLoc.timeMenuLink).click()
    // Wait for Time module (ViewEmployeeTimesheet) to finish loading
    this.vibe.find(this.empTsLoc.breadcrumb)
    Logger.info('Time module loaded — ViewEmployeeTimesheet page ready')
  }

  /** Click the Timesheets tab and wait for the dropdown to appear */
  clickTimesheetsTab() {
    Logger.step('Clicking Timesheets tab in top navigation')
    this.vibe.find(this.topNavLoc.timesheetsTab).click()
    // Wait for dropdown menu to be visible
    this.vibe.find(this.topNavLoc.dropdownMenu)
    Logger.info('Timesheets dropdown menu is visible')
  }

  /** Returns true if the Timesheets dropdown menu is visible */
  isTimesheetsDropdownVisible() {
    Logger.step('Verifying Timesheets dropdown is visible')
    try {
      this.vibe.find(this.topNavLoc.dropdownMenu)
      Logger.info('Timesheets dropdown verified successfully')
      return true
    } catch (e) {
      Logger.warn('Timesheets dropdown not found')
      Logger.error(e.message)
      return false
    }
  }

  /** Click My Timesheets from the dropdown and wait for the page to fully load */
  selectMyTimesheets() {
    Logger.step('Selecting My Timesheets from dropdown')
    // Ensure dropdown is visible before clicking
    const dropdownOption = this.vibe.find(this.topNavLoc.myTimesheetsOption)
    
    // Use force click to handle any potential overlay issues
    dropdownOption.click({ force: true })
    // Wait for the My Timesheet page to load by checking for the heading
    this.vibe.find(this.myTsLoc.myTimesheetHeading)
    Logger.info('ViewMyTimesheet page loaded successfully')
  }

  // ── ViewEmployeeTimesheet page ─────────────────────────────────────────────

  /** Returns true if the ViewEmployeeTimesheet page is loaded */
  isEmployeeTimesheetPageDisplayed() {
    Logger.step('Verifying ViewEmployeeTimesheet page is displayed')
    try {
      // Use breadcrumb as primary check — loads before the form input
      this.vibe.find(this.empTsLoc.breadcrumb)
      Logger.info('ViewEmployeeTimesheet page verified successfully')
      return true
    } catch (e) {
      Logger.warn('ViewEmployeeTimesheet breadcrumb not found')
      Logger.error(e.message)
      return false
    }
  }

  // ── ViewMyTimesheet page ───────────────────────────────────────────────────

  /** Returns true if the ViewMyTimesheet page is loaded */
  isViewMyTimesheetPageDisplayed() {
    Logger.step('Verifying ViewMyTimesheet page is displayed')
    try {
      // Use breadcrumb as primary check — consistent with other page verification methods
      this.vibe.find(this.myTsLoc.myTimesheetHeading)
      Logger.info('ViewMyTimesheet page verified successfully')
      return true
    } catch (e) {
      Logger.warn('ViewMyTimesheet heading not found')
      Logger.error(e.message)
      return false
    }
  }

  /** Click the Edit button and wait for the edit form to load */
  clickEditButton() {
    Logger.step('Clicking Edit button on ViewMyTimesheet')
    // Wait for the timesheet table to fully render before looking for Edit button
    this.vibe.find(this.myTsLoc.timesheetTable)
    Logger.debug('Timesheet table rendered — proceeding to click Edit')
    this.vibe.find(this.myTsLoc.editBtn).click()
    Logger.info('Edit button clicked — navigating to EditTimesheet form')
  }

  // ── EditTimesheet page ─────────────────────────────────────────────────────

  /** Returns true if the EditTimesheet form is loaded */
  isEditTimesheetPageDisplayed() {
    Logger.step('Verifying EditTimesheet page is displayed')
    try {
      this.vibe.find(this.editLoc.editTimesheetHeading)
      Logger.info('EditTimesheet page verified successfully')
      return true
    } catch (e) {
      Logger.warn('EditTimesheet heading not found')
      Logger.error(e.message)
      return false
    }
  }

  
  
  
  /** Click Cancel button on EditTimesheet and wait for ViewMyTimesheet to reload */
  clickCancelButton() {
    Logger.step('Clicking Cancel button on EditTimesheet')
    this.vibe.find(this.editLoc.cancelBtn).click()
    // Wait for ViewMyTimesheet heading to confirm navigation back
    this.vibe.find(this.myTsLoc.myTimesheetHeading)
    Logger.info('Cancel button clicked — returned to ViewMyTimesheet page')
  }

  

  /** Returns true if the success toast is visible after saving */
  isTimesheetSavedSuccessfully() {
    Logger.step('Verifying timesheet saved successfully')
    try {
      this.vibe.find(this.commonLoc.toastSuccess)
      Logger.info('Timesheet saved successfully — success toast visible')
      return true
    } catch (e) {
      Logger.warn('Success toast not found after save')
      Logger.error(e.message)
      return false
    }
  }

  // ── Utility ────────────────────────────────────────────────────────────────

  /** Take a screenshot and attach it to the Cucumber report */
  takeScreenshot(world) {
    Logger.debug('Taking screenshot')
    try {
      const png = this.vibe.screenshot()
      world.attach(png, 'image/png')
      Logger.info('Screenshot captured and attached to report')
    } catch (e) {
      Logger.error(`Screenshot failed: ${e.message}`)
    }
  }
}

module.exports = MyTimesheetPage
