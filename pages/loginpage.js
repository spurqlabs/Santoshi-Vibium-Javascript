'use strict'

const configReader   = require('../utils/configreader')
const locatorReader  = require('../utils/locatorreader')
const testDataReader = require('../utils/testdatareader')
const Logger         = require('../utils/logger')

class LoginPage {
  /**
   * @param {object} vibe  vibium page instance from World
   */
  constructor(vibe) {
    this.vibe     = vibe
    this.baseUrl  = configReader.get('baseUrl')
    this.locators = locatorReader.getSection('loginPage')
    this.testData = testDataReader.getScenarioData('TC001 - Login to application')
    Logger.debug('LoginPage initialised')
  }

  /** Navigate to the OrangeHRM login page */
  open() {
    const url = this.baseUrl + '/web/index.php/auth/login'
    Logger.step('Navigating to OrangeHRM login page')
    Logger.info(`URL: ${url}`)
    this.vibe.go(url)
  }

  /** Fill username from testdata */
  enterUsername() {
    Logger.step(`Entering username: "${this.testData.username}"`)
    this.vibe.find(this.locators.usernameInput).fill(this.testData.username)
    Logger.info('Username entered successfully')
  }

  /** Fill password from testdata */
  enterPassword() {
    Logger.step('Entering password')
    this.vibe.find(this.locators.passwordInput).fill(this.testData.password)
    Logger.info('Password entered successfully')
  }

  /** Click the Login button and wait for dashboard to load after navigation */
  clickLoginButton() {
    Logger.step('Clicking Login button')
    this.vibe.find(this.locators.loginButton).click()
    // After click, the page navigates to dashboard — wait for breadcrumb to confirm load
    this.vibe.find(locatorReader.get('dashboard', 'pageHeader'))
    Logger.info('Login button clicked — dashboard loaded')
  }

  /** Returns true if the dashboard breadcrumb is visible — confirms successful login */
  isLoggedIn() {
    Logger.step('Verifying login — checking dashboard header')
    try {
      this.vibe.find(locatorReader.get('dashboard', 'pageHeader'))
      Logger.info('Login verified: dashboard header is visible')
      return true
    } catch (e) {
      Logger.warn('Login verification failed: dashboard header not found')
      Logger.error(e.message)
      return false
    }
  }

  /** Returns the error message text shown on failed login */
  getErrorMessage() {
    Logger.step('Retrieving login error message')
    try {
      const msg = this.vibe.find(this.locators.errorMessage).text()
      Logger.warn(`Login error message displayed: "${msg}"`)
      return msg
    } catch (e) {
      Logger.debug('No error message element found on login page')
      return null
    }
  }
}

module.exports = LoginPage
