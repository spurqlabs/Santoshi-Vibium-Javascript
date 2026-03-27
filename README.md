# OrangeHRM BDD Test Automation Framework

A robust, scalable BDD (Behavior-Driven Development) test automation framework built with **Cucumber.js** and **Vibium** (Playwright-based) for testing OrangeHRM application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Framework Components](#framework-components)
- [Writing New Tests](#writing-new-tests)
- [Best Practices](#best-practices)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)

---

## Overview

This framework leverages the power of **BDD (Behavior-Driven Development)** using Cucumber.js and **Vibium** (a synchronous wrapper around Playwright) to provide:

- ✅ **Readable Test Scenarios** - Gherkin syntax for stakeholder-friendly test cases
- ✅ **Page Object Model** - Maintainable and reusable page components
- ✅ **Data-Driven Testing** - Externalized test data in JSON format
- ✅ **Parallel Execution** - Faster test execution with parallel scenarios
- ✅ **Retry Mechanism** - Automatic retry for flaky tests
- ✅ **Comprehensive Reporting** - HTML and JSON reports with screenshots
- ✅ **Custom Logging** - Colored console output for debugging

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Feature Files (.feature)                      │
│              (Gherkin syntax - Given/When/Then steps)                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Step Definitions (stepdef.js)                   │
│                 (Glue code connecting steps to code)                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Page Objects (/pages)                           │
│           (Encapsulated page actions and element locators)           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Utilities (/utils)                            │
│     (Config, Locators, Test Data Readers, Logger utilities)         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Vibium/Playwright                               │
│                   (Browser Automation Layer)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Git** (for version control)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vidium-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
npm test
```

---

## Project Structure

```
vidium-assignment/
├── config/
│   └── config.js              # Global configuration (browser, URL, timeouts)
├── features/
│   ├── hooks.js               # Cucumber hooks (Before, After, BeforeAll, AfterAll)
│   ├── stepdef.js             # Step definitions for Gherkin steps
│   └── timesheet.feature      # Feature files with test scenarios
├── locators/
│   └── time-locators.json     # CSS selectors organized by page sections
├── pages/
│   ├── loginpage.js           # Login page object
│   ├── mytimesheet.js         # Timesheet page object
│   └── myInfoPage.js          # My Info page object
├── reports/
│   ├── cucumber-report.html   # HTML test report
│   └── cucumber-report.json   # JSON test report
├── screenshots/               # Screenshots captured on test failures
├── testdata/
│   └── timesheet.json         # Test data organized by scenario
├── utils/
│   ├── configreader.js        # Configuration reader utility
│   ├── locatorreader.js       # Locator reader utility
│   ├── testdatareader.js      # Test data reader utility
│   └── logger.js              # Custom colored logging utility
├── cucumber.js                # Cucumber profiles configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # This documentation file
```

---

## Configuration

### Global Configuration (`config/config.js`)

```javascript
{
  baseUrl:      'https://opensource-demo.orangehrmlive.com',  // Application URL
  browser:      'chromium',                                    // Browser type
  headless:     false,                                         // Headless mode
  slowMo:       500,                                           // Slow down operations (ms)
  timeout:      60000,                                         // Default timeout (ms)
  maximize:     true,                                          // Maximize browser window
  windowWidth:  1920,                                          // Window width
  windowHeight: 1080                                           // Window height
}
```

### Cucumber Profiles (`cucumber.js`)

| Profile | Command | Description |
|---------|---------|-------------|
| `default` | `npm test` | Runs all tests with parallel execution |
| `smoke` | `npm run test:smoke` | Runs tests tagged with `@smoke` |
| `regression` | `npm run test:regression` | Runs tests tagged with `@regression` |
| `sanity` | `npm run test:sanity` | Runs tests tagged with `@sanity` |

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run with Specific Tags

```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression

# Sanity tests
npm run test:sanity

# Timesheet tests
npm run test:timesheet
```

### Run with Parallel Execution

```bash
npm run test:parallel
```

### Run Specific Feature File

```bash
npx cucumber-js features/timesheet.feature
```

### Run with Specific Profile

```bash
npx cucumber-js --profile smoke
```

---

## Framework Components

### 1. Feature Files (`features/*.feature`)

Gherkin-syntax test scenarios:

```gherkin
Feature: My Timesheet Management in OrangeHRM

  Background:
    Given user is on OrangeHRM login page
    When user enter username
    When user enter password
    When user click on Login button
    Then the user is logged in to the application

  @smoke
  Scenario: TC001 - Login to application
    Then the user is logged in to the application

  @regression
  Scenario: TC002 - Add Timesheet details
    Given user is on Dashboard page
    When user navigates to Time -> Timesheets
    Then ViewEmployeeTimesheet page is displayed
```

### 2. Step Definitions (`features/stepdef.js`)

Connects Gherkin steps to page object methods:

```javascript
Given('user is on OrangeHRM login page', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.open()
})

When('user enter username', function () {
  const loginPage = new LoginPage(this.vibe)
  loginPage.enterUsername()
})
```

### 3. Page Objects (`pages/*.js`)

Encapsulates page-specific logic:

```javascript
class LoginPage {
  constructor(vibe) {
    this.vibe = vibe
    this.baseUrl = configReader.get('baseUrl')
    this.locators = locatorReader.getSection('loginPage')
    this.testData = testDataReader.getScenarioData('TC001 - Login to application')
  }

  open() {
    this.vibe.go(this.baseUrl + '/web/index.php/auth/login')
  }

  enterUsername() {
    this.vibe.find(this.locators.usernameInput).fill(this.testData.username)
  }
}
```

### 4. Hooks (`features/hooks.js`)

Lifecycle management for test execution:

| Hook | Purpose |
|------|---------|
| `BeforeAll` | Create directories, load configuration |
| `Before` | Launch browser, create page instance |
| `After` | Capture screenshots on failure, close browser |
| `AfterAll` | Cleanup tasks |

### 5. Utilities (`utils/*.js`)

#### ConfigReader (`utils/configreader.js`)

```javascript
const configReader = require('./utils/configreader')

// Get full config
const config = configReader.getConfig()

// Get specific value
const baseUrl = configReader.get('baseUrl')
```

#### LocatorReader (`utils/locatorreader.js`)

```javascript
const locatorReader = require('./utils/locatorreader')

// Get specific locator
const selector = locatorReader.get('loginPage', 'usernameInput')

// Get entire section
const loginLocators = locatorReader.getSection('loginPage')
```

#### TestDataReader (`utils/testdatareader.js`)

```javascript
const testDataReader = require('./utils/testdatareader')

// Get scenario test data
const testData = testDataReader.getScenarioData('TC001 - Login to application')

// Get specific field
const username = testDataReader.getTestData('TC001 - Login to application', 'username')
```

#### Logger (`utils/logger.js`)

```javascript
const Logger = require('./utils/logger')

Logger.info('Information message')    // Green output
Logger.debug('Debug message')         // Blue output
Logger.warn('Warning message')        // Yellow output
Logger.error('Error message')         // Red output
Logger.step('Step description')       // Yellow step marker
```

### 6. Locators (`locators/*.json`)

Centralized CSS selectors:

```json
{
  "loginPage": {
    "usernameInput": "input[name='username']",
    "passwordInput": "input[name='password']",
    "loginButton": "button[type='submit']"
  },
  "dashboard": {
    "pageHeader": ".oxd-topbar-header-breadcrumb"
  }
}
```

### 7. Test Data (`testdata/*.json`)

Scenario-based test data:

```json
{
  "fileName": "timesheetData",
  "scenarios": [
    {
      "scenarioName": "TC001 - Login to application",
      "testData": {
        "username": "Admin",
        "password": "admin123"
      }
    }
  ]
}
```

---

## Writing New Tests

### Step 1: Create Feature File

Create a new `.feature` file in the `features/` directory:

```gherkin
Feature: New Feature Name

  @smoke
  Scenario: TC003 - New test scenario
    Given precondition step
    When action step
    Then verification step
```

### Step 2: Add Locators

Add CSS selectors to `locators/time-locators.json`:

```json
{
  "newPage": {
    "elementLocator": ".css-selector"
  }
}
```

### Step 3: Add Test Data

Add test data to `testdata/timesheet.json`:

```json
{
  "scenarioName": "TC003 - New test scenario",
  "testData": {
    "field1": "value1"
  }
}
```

### Step 4: Create Page Object

Create a new page class in `pages/`:

```javascript
'use strict'

const configReader   = require('../utils/configreader')
const locatorReader  = require('../utils/locatorreader')
const testDataReader = require('../utils/testdatareader')
const Logger         = require('../utils/logger')

class NewPage {
  constructor(vibe) {
    this.vibe = vibe
    this.locators = locatorReader.getSection('newPage')
    this.testData = testDataReader.getScenarioData('TC003 - New test scenario')
  }

  performAction() {
    Logger.step('Performing action')
    this.vibe.find(this.locators.elementLocator).click()
  }
}

module.exports = NewPage
```

### Step 5: Add Step Definitions

Add step definitions in `features/stepdef.js`:

```javascript
When('user performs action', function () {
  const page = new NewPage(this.vibe)
  page.performAction()
})
```

---

## Best Practices

### 1. Page Object Model

- Keep page objects focused on a single page
- Encapsulate all element interactions within page objects
- Use meaningful method names that describe actions

### 2. Locators

- Use stable selectors (data-testid, name attributes preferred)
- Avoid using dynamic IDs or classes
- Group locators by page section

### 3. Test Data

- Externalize all test data to JSON files
- Organize test data by scenario name
- Avoid hardcoding values in step definitions

### 4. Logging

- Use appropriate log levels (info, debug, warn, error)
- Log meaningful step descriptions
- Include relevant context in error messages

### 5. Assertions

- Wait for elements before interacting
- Use built-in waits instead of sleep
- Handle async operations properly

---

## Reporting

### HTML Report

Located at `reports/cucumber-report.html` after test execution. Open in any browser to view:

- Scenario results
- Step execution details
- Screenshots for failed scenarios
- Execution timeline

### JSON Report

Located at `reports/cucumber-report.json` for integration with CI/CD tools.

### Screenshots

Failed scenarios automatically capture screenshots saved to `screenshots/` with naming format:
```
FAILED_<scenario_name>.png
```

---

## Troubleshooting

### Common Issues

#### 1. Browser Not Launching

```bash
# Ensure Playwright browsers are installed
npx playwright install
```

#### 2. Timeout Errors

Increase timeout in `config/config.js`:
```javascript
timeout: 90000  // Increase to 90 seconds
```

#### 3. Element Not Found

- Verify the CSS selector in locators JSON
- Check if the element is within an iframe
- Ensure proper wait conditions

#### 4. Flaky Tests

- Enable retry mechanism in `cucumber.js`:
```javascript
retry: 2  // Retry failed scenarios twice
```

### Debug Mode

Enable debug logging by modifying `utils/logger.js`:

```javascript
const Logger = {
  debug(message) {
    console.log(format(colors.blue, 'DEBUG', message))
  }
}
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@cucumber/cucumber` | ^10.3.2 | BDD testing framework |
| `vibium` | ^26.3.17 | Synchronous Playwright wrapper |
| `cucumber-html-reporter` | ^6.0.0 | HTML report generation |
| `@google/generative-ai` | ^0.24.1 | AI capabilities |

---

## Contributing

1. Create a feature branch
2. Make your changes following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

---

## License

ISC License

---

## Author

Vidium Assignment Project

---

## Support

For issues or questions, please create an issue in the repository.
