'use strict'

const fs    = require('fs')
const path  = require('path')
const https = require('https')

// ── SpurQuality MCP server config (mirrors .mcp.json) ────────────────────────
const SPUR_MCP_HOST = 'spur-mcp.onrender.com'
const SPUR_HEADERS  = {
  'user-email' : 'santoshi.mohite@spurqlabs.com',
  'secret-key' : '2cc26c760ac76bcb6c2ac14de567ec2c374a44bda98c26dd46971a157d1424c1',
  'organization': 'SpurQLabs',
  'ProjectName' : 'Playground'
}

class ReportGenerator {

  /**
   * Main entry point.
   * 1. Reads reports/cucumber-report.json
   * 2. Uploads it to SpurQuality /upload-cucumber → gets uploadId
   * 3. Calls MCP create_execution_from_assembled_report with uploadId
   */
  static async generate() {
    const reportPath = path.join(process.cwd(), 'reports', 'cucumber-report.json')

    if (!fs.existsSync(reportPath)) {
      console.log('\n[SpurQuality] cucumber-report.json not found — skipping upload.\n')
      return
    }

    console.log('\n[SpurQuality] Uploading test results to SpurQuality...')

    try {
      // Step 1 — Upload cucumber JSON file, get back an uploadId
      const uploadId = await ReportGenerator._uploadCucumberFile(reportPath)
      console.log(`[SpurQuality] File uploaded successfully. Upload ID: ${uploadId}`)

      // Step 2 — Create test execution from the uploaded file
      const result = await ReportGenerator._createExecution(uploadId)
      console.log('[SpurQuality] Test execution created successfully!')
      console.log('[SpurQuality] Response:', JSON.stringify(result, null, 2))
    } catch (err) {
      console.error('[SpurQuality] Report upload failed:', err.message)
    }
  }

  // ── Step 1: Upload file ─────────────────────────────────────────────────────

  static _uploadCucumberFile(filePath) {
    return new Promise((resolve, reject) => {
      const fileContent = fs.readFileSync(filePath)
      const boundary    = `----SpurBoundary${Date.now()}`

      // Build multipart/form-data body manually (no external deps needed)
      const body = Buffer.concat([
        Buffer.from(
          `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="file"; filename="cucumber-report.json"\r\n` +
          `Content-Type: application/json\r\n\r\n`
        ),
        fileContent,
        Buffer.from(`\r\n--${boundary}--\r\n`)
      ])

      const options = {
        hostname: SPUR_MCP_HOST,
        path    : '/upload-cucumber',
        method  : 'POST',
        headers : {
          ...SPUR_HEADERS,
          'Content-Type'  : `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length
        }
      }

      const req = https.request(options, res => {
        let raw = ''
        res.on('data', chunk => { raw += chunk })
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw)
            if (parsed.uploadId) {
              resolve(parsed.uploadId)
            } else {
              reject(new Error('No uploadId in upload response: ' + raw))
            }
          } catch (e) {
            reject(new Error('Failed to parse upload response: ' + raw))
          }
        })
      })

      req.on('error', reject)
      req.write(body)
      req.end()
    })
  }

  // ── Step 2: Create execution via MCP JSON-RPC call ─────────────────────────

  static _createExecution(uploadId) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        jsonrpc: '2.0',
        id     : 1,
        method : 'tools/call',
        params : {
          name     : 'create_execution_from_assembled_report',
          arguments: {
            organizationName    : 'SpurQLabs',
            projectName         : 'Playground',
            cucumberFileUploadId: uploadId,
            testExecutionSummary: 'OrangeHRM Timesheet Automation Run',
            testCaseExecutedBy  : 'Santoshi Mohite',
            author              : 'Santoshi Mohite',
            testType            : 'cucumber'
          }
        }
      })

      const options = {
        hostname: SPUR_MCP_HOST,
        path    : '/mcp',
        method  : 'POST',
        headers : {
          ...SPUR_HEADERS,
          'Content-Type'  : 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }

      const req = https.request(options, res => {
        let raw = ''
        res.on('data', chunk => { raw += chunk })
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw))
          } catch (e) {
            reject(new Error('Failed to parse execution response: ' + raw))
          }
        })
      })

      req.on('error', reject)
      req.write(payload)
      req.end()
    })
  }
}

// ── Allow direct execution: node utils/reportGenerator.js ────────────────────
if (require.main === module) {
  ReportGenerator.generate()
    .then(() => {
      console.log('[SpurQuality] Done.\n')
      process.exit(0)
    })
    .catch(err => {
      console.error('[SpurQuality] Fatal error:', err.message)
      process.exit(1)
    })
}

module.exports = ReportGenerator
