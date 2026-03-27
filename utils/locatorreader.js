'use strict'

const fs   = require('fs')
const path = require('path')

/**
 * Reads and parses time-locators.json from the locators/ folder.
 * Sections: loginPage | dashboard | sidebar | viewEmployeeTimesheet |
 *           timesheetsTopNav | viewMyTimesheet | editTimesheet | common
 */
function readLocators() {
  const filePath = path.join(process.cwd(), 'locators', 'time-locators.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Locator file not found: ${filePath}`)
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/**
 * Returns a CSS selector for the given section and key.
 * @param {string} section  e.g. 'loginPage', 'editTimesheet'
 * @param {string} key      e.g. 'usernameInput', 'saveBtn'
 * @returns {string} CSS selector
 */
function get(section, key) {
  const locators = readLocators()
  if (!locators[section]) {
    throw new Error(`Locator section "${section}" not found in time-locators.json`)
  }
  if (!locators[section][key]) {
    throw new Error(`Key "${key}" not found in locator section "${section}"`)
  }
  return locators[section][key]
}

/**
 * Returns the full locator object for a given section.
 * @param {string} section  e.g. 'loginPage'
 * @returns {object}
 */
function getSection(section) {
  const locators = readLocators()
  if (!locators[section]) {
    throw new Error(`Locator section "${section}" not found in time-locators.json`)
  }
  return locators[section]
}

module.exports = { readLocators, get, getSection }
