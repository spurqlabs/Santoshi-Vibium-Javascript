const fs = require('fs')
const { browser } = require('vibium/sync')

const bro = browser.start()
const vibe = bro.page()

function snap(filename) {
  fs.writeFileSync('screenshots/' + filename, vibe.screenshot())
  console.log('Screenshot saved:', filename)
}

function waitForPage() {
  vibe.find('.oxd-topbar-header-breadcrumb')
}

try {
  // ── STEP 1: Login ───────────────────────────────────────────────────────
  console.log('[1] Logging in...')
  vibe.go('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  vibe.find('input[name="username"]').fill('Admin')
  vibe.find('input[name="password"]').fill('admin123')
  vibe.find('button[type="submit"]').click()
  waitForPage()
  snap('01_dashboard.png')

  // ── STEP 2: Navigate to Time module ────────────────────────────────────
  console.log('[2] Time module...')
  vibe.go('https://opensource-demo.orangehrmlive.com/web/index.php/time/viewMyTimesheet')
  waitForPage()
  snap('02_my_timesheet_page.png')

  // ── STEP 3: Wait for timesheet grid to load and scroll down ────────────
  console.log('[3] Timesheet loaded - full view...')
  vibe.find('.timesheet-pending-action-table, .oxd-sheet, h6, .orangehrm-timesheet')
  snap('03_my_timesheet_loaded.png')

  // ── STEP 4: Timesheets dropdown - My Timesheets ────────────────────────
  console.log('[4] Timesheets dropdown...')
  vibe.find('.oxd-topbar-body-nav-tab-link:has-text("Timesheets"), .oxd-topbar-body-nav-tab:has-text("Timesheets")').click()
  snap('04_timesheets_dropdown_open.png')

  // ── STEP 5: Click My Timesheets ────────────────────────────────────────
  console.log('[5] My Timesheets submenu...')
  vibe.find('.oxd-dropdown-menu a:has-text("My Timesheets"), a:has-text("My Timesheets")').click()
  waitForPage()
  snap('05_my_timesheets_submenu.png')

  // ── STEP 6: Employee Timesheets ────────────────────────────────────────
  console.log('[6] Employee Timesheets...')
  vibe.go('https://opensource-demo.orangehrmlive.com/web/index.php/time/viewEmployeeTimesheet')
  waitForPage()
  snap('06_employee_timesheets.png')

  // ── STEP 7: Attendance dropdown ────────────────────────────────────────
  console.log('[7] Attendance dropdown...')
  vibe.find('.oxd-topbar-body-nav-tab:has-text("Attendance"), .oxd-topbar-body-nav-tab-link:has-text("Attendance")').click()
  snap('07_attendance_dropdown.png')

  // ── STEP 8: Punch In/Out ───────────────────────────────────────────────
  console.log('[8] Punch In/Out...')
  vibe.find('a:has-text("Punch In/Out")').click()
  waitForPage()
  snap('08_punch_in_out.png')

  // ── STEP 9: My Records ─────────────────────────────────────────────────
  console.log('[9] Attendance - My Records...')
  vibe.find('.oxd-topbar-body-nav-tab:has-text("Attendance")').click()
  vibe.find('a:has-text("My Records")').click()
  waitForPage()
  snap('09_my_attendance_records.png')

  // ── STEP 10: Employee Records ──────────────────────────────────────────
  console.log('[10] Attendance - Employee Records...')
  vibe.find('.oxd-topbar-body-nav-tab:has-text("Attendance")').click()
  vibe.find('a:has-text("Employee Records")').click()
  waitForPage()
  snap('10_employee_attendance_records.png')

  // ── STEP 11: Reports ───────────────────────────────────────────────────
  console.log('[11] Reports...')
  vibe.find('.oxd-topbar-body-nav-tab:has-text("Reports")').click()
  snap('11_reports_dropdown.png')

  // ── STEP 12: Project Info ──────────────────────────────────────────────
  console.log('[12] Project Info...')
  vibe.find('.oxd-topbar-body-nav-tab:has-text("Project Info")').click()
  snap('12_project_info_dropdown.png')

  console.log('\nAll screenshots captured!')

} catch (err) {
  console.error('Error:', err.message)
  try { snap('error_screenshot.png') } catch (e) {}
} finally {
  bro.stop()
}
