'use strict'

const { setWorldConstructor, World, Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber')
const { browser } = require('vibium/sync')
const fs           = require('fs')
const path         = require('path')
const configReader = require('../utils/configreader')

// ── World ────────────────────────────────────────────────────────────────────

class VibiumWorld extends World {
  constructor(options) {
    super(options)
    this.bro          = null
    this.vibe         = null
    this.scenarioName = ''
  }
}

setWorldConstructor(VibiumWorld)

// ── Suite-level hooks ────────────────────────────────────────────────────────

BeforeAll(function () {
  ['reports', 'screenshots'].forEach(dir => {
    const p = path.join(process.cwd(), dir)
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
  })

  const cfg = configReader.getConfig()
  console.log('\n[Suite] Configuration loaded:')
  console.log(`  Browser  : ${cfg.browser}`)
  console.log(`  Base URL : ${cfg.baseUrl}`)
  console.log(`  Headless : ${cfg.headless}`)
  console.log(`  Timeout  : ${cfg.timeout}ms`)
  console.log(`  SlowMo   : ${cfg.slowMo}ms`)
  console.log(`  Maximize : ${cfg.maximize}`)
  console.log(`  Window   : ${cfg.windowWidth}x${cfg.windowHeight}`)
  console.log('[Suite] Starting test run...\n')
})

AfterAll(function () {
  console.log('\n[Suite] Test run complete.\n')
})

// ── Scenario-level hooks ─────────────────────────────────────────────────────

Before(function (scenario) {
  this.scenarioName = scenario.pickle.name
  console.log(`[Before] "${this.scenarioName}"`)

  // Read browser settings from config
  const headless      = configReader.get('headless')
  const slowMo        = configReader.get('slowMo')
  const maximize      = configReader.get('maximize')
  const windowWidth   = configReader.get('windowWidth')
  const windowHeight  = configReader.get('windowHeight')

  // Build launch options
  // viewport: null  → disables Playwright's fixed viewport so the window fills the screen
  // --start-maximized → tells Chromium to open maximized at the OS level
  // --window-size     → sets explicit pixel dimensions as a fallback
  const launchOptions = {
    headless,
    slowMo,
    viewport: maximize ? null : { width: windowWidth, height: windowHeight },
    args: maximize
      ? ['--start-maximized', `--window-size=${windowWidth},${windowHeight}`]
      : []
  }

  // Launch browser with maximized window
  this.bro  = browser.start(launchOptions)
  this.vibe = this.bro.page()
})

After(function (scenario) {
  const status = scenario.result.status

  if (status === 'FAILED') {
    console.log(`[After] FAILED — capturing screenshot for "${this.scenarioName}"`)
    try {
      const png      = this.vibe.screenshot()
      const safeName = this.scenarioName.replace(/[^a-z0-9]/gi, '_').toLowerCase()

      // Attach to Cucumber HTML report
      this.attach(png, 'image/png')

      // Save to disk for CI artifact collection
      fs.writeFileSync(
        path.join(process.cwd(), 'screenshots', `FAILED_${safeName}.png`),
        png
      )
    } catch (e) {
      console.error('[After] Screenshot error:', e.message)
    }
  }

  if (this.bro) {
    try { this.bro.stop() } catch (e) {}
  }

  console.log(`[After] "${this.scenarioName}" [${status}]\n`)
})
