'use strict'

const config = require('../config/config')

/**
 * Returns the full config object.
 * @returns {object}
 */
function getConfig() {
  return config
}

/**
 * Returns a specific config value by key.
 * @param {string} key  e.g. 'baseUrl', 'browser', 'headless', 'timeout', 'slowMo', 'maximize', 'windowWidth', 'windowHeight'
 * @returns {*}
 */
function get(key) {
  if (!(key in config)) {
    throw new Error(`Config key "${key}" not found in config.js`)
  }
  return config[key]
}

module.exports = { getConfig, get }
