'use strict'

module.exports = {
  // ── Default profile ──────────────────────────────────────────────────────
  default: {
    // Feature files
    paths: ['features/**/*.feature'],

    // Support + step files (hooks.js must come before stepdef.js)
    require: [
      'features/hooks.js',
      'features/stepdef.js'
    ],

    // Formatters: terminal progress + JSON (for HTML report) + built-in HTML
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],

    formatOptions: {
      snippetInterface: 'synchronous'
    },

    //Parallel Execution
    parallel: 2,

    // Retry failing scenarios once
    retry: 1,

    // Run all scenarios even if some fail
    failFast: false
  },

  // ── Smoke profile: npm run test:smoke ────────────────────────────────────
  smoke: {
    paths: ['features/**/*.feature'],
    require: ['features/hooks.js', 'features/stepdef.js'],
    tags: '@smoke',
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'synchronous' }
  },

  // ── Regression profile: npm run test:regression ──────────────────────────
  regression: {
    paths: ['features/**/*.feature'],
    require: ['features/hooks.js', 'features/stepdef.js'],
    tags: '@regression',
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'synchronous' }
  },
  sanity: {
    paths: ['features/**/*.feature'],
    require: ['features/hooks.js', 'features/stepdef.js'],
    tags: '@sanity',
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'synchronous' }
  },

}
