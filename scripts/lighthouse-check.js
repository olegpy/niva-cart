#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

// Configuration
const MIN_SCORE = process.env.CI ? 0.90 : 0.95; // 90% in CI, 95% locally
const REPORT_PATH = './lighthouse-report.json';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkLighthouseReport() {
  try {
    // Check if report file exists
    if (!fs.existsSync(REPORT_PATH)) {
      log('❌ Lighthouse report not found. Please run "npm run lighthouse:ci" first.', 'red');
      process.exit(1);
    }

    // Read and parse the report
    const reportData = fs.readFileSync(REPORT_PATH, 'utf8');
    const report = JSON.parse(reportData);

    // Extract scores
    const categories = report.categories;
    const scores = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      'best-practices': Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    };

    // Display scores
    log('\n📊 Lighthouse Performance Report', 'bold');
    log('================================', 'blue');
    
    let allPassed = true;
    
    Object.entries(scores).forEach(([category, score]) => {
      const passed = score >= (MIN_SCORE * 100);
      const status = passed ? '✅' : '❌';
      const color = passed ? 'green' : 'red';
      
      log(`${status} ${category.padEnd(15)}: ${score}/100`, color);
      
      if (!passed) {
        allPassed = false;
      }
    });

    log('================================', 'blue');

    // Check if all scores meet the minimum requirement
    if (allPassed) {
      log(`\n🎉 All Lighthouse scores are above ${MIN_SCORE * 100}%!`, 'green');
      log('Your application meets the performance requirements.', 'green');
      process.exit(0);
    } else {
      log(`\n⚠️  Some Lighthouse scores are below ${MIN_SCORE * 100}%`, 'red');
      log('Please optimize your application to meet the performance requirements.', 'red');
      
      // Show specific recommendations
      log('\n📋 Recommendations:', 'yellow');
      Object.entries(scores).forEach(([category, score]) => {
        if (score < (MIN_SCORE * 100)) {
          log(`• Improve ${category} score (currently ${score}%, need ${MIN_SCORE * 100}%)`, 'yellow');
        }
      });
      
      process.exit(1);
    }

  } catch (error) {
    log(`❌ Error reading Lighthouse report: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the check
checkLighthouseReport();
