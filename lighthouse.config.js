module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // Only run the categories you care about
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    
    // Performance settings
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    },
    
    // Viewport
    viewport: {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      isLandscape: false
    },
    
    // Skip certain audits
    skipAudits: [
      'redirects-http'
    ]
  },
  
  // Custom thresholds for CI
  assertions: {
    'categories:performance': ['error', { minScore: 0.95 }],
    'categories:accessibility': ['error', { minScore: 0.95 }],
    'categories:best-practices': ['error', { minScore: 0.95 }],
    'categories:seo': ['error', { minScore: 0.95 }]
  }
};
