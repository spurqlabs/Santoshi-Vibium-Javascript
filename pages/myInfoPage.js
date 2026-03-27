'use strict'

const configReader   = require('../utils/configreader')
const locatorReader  = require('../utils/locatorreader')
const testDataReader = require('../utils/testdatareader')
const Logger         = require('../utils/logger')

class MyInfoPage {
  /**
   * @param {object} vibe  vibium page instance from World
   */
  constructor(vibe) {
    this.vibe     = vibe
    this.baseUrl  = configReader.get('baseUrl')

    // Locator sections from time-locators.json
    this.commonLoc    = locatorReader.getSection('common')
    this.dashboardLoc = locatorReader.getSection('dashboard')
    this.myInfoLoc    = locatorReader.getSection('myInfo')
    this.contactLoc   = locatorReader.getSection('contactDetails')

    // Test data for TC003 from timesheet.json
    this.contactData = testDataReader.getScenarioData('TC003 - Add Contact details')
    Logger.debug('MyInfoPage initialised')
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

  /** Click My Info tab in the sidebar */
  clickMyInfoTab() {
    Logger.step('Clicking My Info tab in sidebar')
    this.vibe.find(this.myInfoLoc.myInfoLink).click()
    // Wait for Personal Details page to load
    this.vibe.find(this.myInfoLoc.profileName)
    Logger.info('My Info page loaded successfully')
  }

  // ── Personal Details Page ──────────────────────────────────────────────────

  /** Returns true if the Personal Details page is displayed with user details */
  isPersonalDetailsPageDisplayed() {
    Logger.step('Verifying Personal Details page is displayed')
    try {
      // Check for profile name element which confirms personal details are loaded
      this.vibe.find(this.myInfoLoc.profileName)
      Logger.info('Personal Details page verified successfully')
      return true
    } catch (e) {
      Logger.warn('Personal Details page elements not found')
      Logger.error(e.message)
      return false
    }
  }

  // ── Contact Details Tab ────────────────────────────────────────────────────

  /** Click on Contact Details subtab */
  clickContactDetailsTab() {
    Logger.step('Clicking Contact Details subtab')
    this.vibe.find(this.myInfoLoc.contactDetailsTab).click()
    Logger.info('Contact Details page loaded successfully')
  }

  

  // ── Contact Details Form Fields ────────────────────────────────────────────

  /** Enter street 1 address */
  enterStreet1() {
    Logger.step(`Entering street 1: "${this.contactData.street1}"`)
    this.vibe.find(this.contactLoc.street1Input).clear()
    this.vibe.find(this.contactLoc.street1Input).fill(this.contactData.street1)
    Logger.info(`Street 1 entered: ${this.contactData.street1}`)
  }

  /** Enter city */
  enterCity() {
    Logger.step(`Entering city: "${this.contactData.city}"`)
    this.vibe.find(this.contactLoc.cityInput).clear()
    this.vibe.find(this.contactLoc.cityInput).fill(this.contactData.city)
    Logger.info(`City entered: ${this.contactData.city}`)
  }

  /** Enter state */
  enterState() {
    Logger.step(`Entering state: "${this.contactData.state}"`)
    this.vibe.find(this.contactLoc.stateInput).clear()
    this.vibe.find(this.contactLoc.stateInput).fill(this.contactData.state)
    Logger.info(`State entered: ${this.contactData.state}`)
  }

  /** Enter zip code */
  enterZipCode() {
    Logger.step(`Entering zip code: "${this.contactData.zipCode}"`)
    this.vibe.find(this.contactLoc.zipCodeInput).clear()
    this.vibe.find(this.contactLoc.zipCodeInput).fill(this.contactData.zipCode)
    Logger.info(`Zip code entered: ${this.contactData.zipCode}`)
  }

  /** Enter mobile number */
  enterMobile() {
    Logger.step(`Entering mobile: "${this.contactData.mobile}"`)
    this.vibe.find(this.contactLoc.mobileInput).clear()
    this.vibe.find(this.contactLoc.mobileInput).fill(this.contactData.mobile)
    Logger.info(`Mobile entered: ${this.contactData.mobile}`)
  }

  /** Enter work phone */
  enterWorkPhone() {
    Logger.step(`Entering work phone: "${this.contactData.workPhone}"`)
    this.vibe.find(this.contactLoc.workPhoneInput).clear()
    this.vibe.find(this.contactLoc.workPhoneInput).fill(this.contactData.workPhone)
    Logger.info(`Work phone entered: ${this.contactData.workPhone}`)
  }

  /** Enter work email */
  enterWorkEmail() {
    Logger.step(`Entering work email: "${this.contactData.workEmail}"`)
    this.vibe.find(this.contactLoc.workEmailInput).clear()
    this.vibe.find(this.contactLoc.workEmailInput).fill(this.contactData.workEmail)
    Logger.info(`Work email entered: ${this.contactData.workEmail}`)
  }

  // ── Save Contact Details ───────────────────────────────────────────────────

  /** Click Save button on Contact Details form */
  clickSaveButton() {
    Logger.step('Clicking Save button on Contact Details')
    this.vibe.find(this.contactLoc.saveButton).click()
    // Wait for success toast
    this.vibe.find(this.commonLoc.toastSuccess)
    Logger.info('Save button clicked — success toast confirmed')
  }

  /** Returns true if the contact details are saved successfully */
  isContactDetailsSavedSuccessfully() {
    Logger.step('Verifying contact details saved successfully')
    try {
      this.vibe.find(this.commonLoc.toastSuccess)
      Logger.info('Contact details saved successfully — success toast visible')
      return true
    } catch (e) {
      Logger.warn('Success toast not found after saving contact details')
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

module.exports = MyInfoPage
