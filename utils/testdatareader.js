'use strict'

const fs   = require('fs')
const path = require('path')

/**
 * Reads and parses timesheet.json from the testdata/ folder.
 * Structure:
 * {
 *   "fileName": "timesheetData",
 *   "scenarios": [
 *     { "scenarioName": "TC001 - Login to application", "testData": { ... } },
 *     { "scenarioName": "TC002 - Add Timesheet details", "testData": { ... } }
 *   ]
 * }
 */
function readTestData() {
  const filePath = path.join(process.cwd(), 'testdata', 'timesheet.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`)
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/**
 * Returns the full testData object for a given scenario name.
 * @param {string} scenarioName  e.g. 'TC001 - Login to application'
 * @returns {object} testData block
 */
function getScenarioData(scenarioName) {
  const data = readTestData()
  const scenario = data.scenarios.find(s => s.scenarioName === scenarioName)
  if (!scenario) {
    throw new Error(`Scenario "${scenarioName}" not found in timesheet.json`)
  }
  return scenario.testData
}

/**
 * Returns a single field value from a scenario's testData.
 * @param {string} scenarioName  e.g. 'TC002 - Add Timesheet details'
 * @param {string} key           e.g. 'projectName', 'mondayHours'
 * @returns {string}
 */
function getTestData(scenarioName, key) {
  const testData = getScenarioData(scenarioName)
  if (!(key in testData)) {
    throw new Error(`Key "${key}" not found in testData for scenario "${scenarioName}"`)
  }
  return testData[key]
}

module.exports = { readTestData, getScenarioData, getTestData }
