'use strict'

const LEVELS = { DEBUG: 0, INFO: 1, STEP: 2, WARN: 3, ERROR: 4 }

const colors = {
  reset:  '\x1b[0m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  blue:   '\x1b[34m'
}

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 23)
}

function format(color, label, message) {
  return `${colors.cyan}[${timestamp()}]${colors.reset} ${color}[${label}]${colors.reset} ${message}`
}

const Logger = {
  /** Informational message — general flow events */
  info(message) {
    console.log(format(colors.green, 'INFO ', message))
  },

  /** Debug message — detailed diagnostic data */
  debug(message) {
    console.log(format(colors.blue, 'DEBUG', message))
  },

  /** Warning message — unexpected but non-fatal situations */
  warn(message) {
    console.warn(format(colors.yellow, 'WARN ', message))
  },

  /** Error message — failures and exceptions */
  error(message) {
    console.error(format(colors.red, 'ERROR', message))
  },

  /** Test step message — BDD step-level tracing */
  step(message) {
    console.log(format(colors.yellow, 'STEP ', `→ ${message}`))
  }
}

module.exports = Logger
