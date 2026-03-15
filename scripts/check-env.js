#!/usr/bin/env node
// ============================================================
// PROTEX — Pre-flight Environment Check
// Run: node scripts/check-env.js
// ============================================================

const REQUIRED = ['VITE_OPENROUTER_API_KEY']
const OPTIONAL = ['VITE_HERMES_MODEL', 'VITE_HERMES_BASE_URL', 'VITE_APP_ENV']

let hasError = false

console.log('\n🛡️  PROTEX — Environment Check\n')

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`  ❌  MISSING (required): ${key}`)
    hasError = true
  } else {
    const val = process.env[key]
    const masked = val.slice(0, 6) + '...' + val.slice(-4)
    console.log(`  ✅  ${key} = ${masked}`)
  }
}

for (const key of OPTIONAL) {
  const val = process.env[key]
  if (val) {
    console.log(`  ✅  ${key} = ${val}`)
  } else {
    console.log(`  ℹ️   ${key} not set (using default)`)
  }
}

if (hasError) {
  console.error('\n  ⚠️  Missing required variables. Copy .env.example → .env.local\n')
  process.exit(1)
} else {
  console.log('\n  ✅  All required variables present. Ready to launch.\n')
}
