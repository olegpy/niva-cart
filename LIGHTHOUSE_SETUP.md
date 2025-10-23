# Lighthouse Performance Testing Setup

This project is configured with Lighthouse to ensure performance scores are above 95% across all categories.

## 🚀 Quick Start

### Option 1: Full Automated Check (Recommended)
```bash
npm run lighthouse:full
```
This command will:
1. Build your application
2. Start the production server
3. Run Lighthouse audit
4. Check if all scores are above 95%
5. Stop the server automatically

### Option 2: Manual Step-by-Step
```bash
# 1. Build the application
npm run build

# 2. Start the production server (in one terminal)
npm start

# 3. Run Lighthouse audit (in another terminal)
npm run lighthouse:ci

# 4. Check the scores
npm run lighthouse:check
```

### Option 3: Development Server Check
```bash
# 1. Start development server (in one terminal)
npm run dev

# 2. Run Lighthouse on localhost:3000 (in another terminal)
npm run lighthouse
```

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run lighthouse` | Run Lighthouse with HTML report output |
| `npm run lighthouse:ci` | Run Lighthouse with JSON output for CI |
| `npm run lighthouse:check` | Check if scores meet 95% threshold |
| `npm run lighthouse:full` | Complete automated check (build + test + verify) |

## 🎯 Performance Requirements

All Lighthouse categories must score **95% or higher**:

- **Performance**: 95%+
- **Accessibility**: 95%+
- **Best Practices**: 95%+
- **SEO**: 95%+

## 📁 Generated Files

- `lighthouse-report.html` - Detailed HTML report
- `lighthouse-report.json` - JSON data for programmatic analysis

## ⚙️ Configuration

The Lighthouse configuration is in `lighthouse.config.js`:

- **Device**: Mobile emulation (375x667)
- **Throttling**: Simulated 3G connection
- **Categories**: Performance, Accessibility, Best Practices, SEO
- **Threshold**: 95% minimum score for all categories

## 🔧 Troubleshooting

### Common Issues

1. **Server not starting**: Make sure port 3000 is available
2. **Build failures**: Fix any TypeScript/ESLint errors first
3. **Low scores**: Check the HTML report for specific recommendations

### Performance Optimization Tips

1. **Images**: Optimize and use next/image
2. **Fonts**: Use font-display: swap
3. **JavaScript**: Code splitting and lazy loading
4. **CSS**: Remove unused styles
5. **Third-party scripts**: Load asynchronously

## 🚦 CI/CD Integration

To integrate with your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run Lighthouse Performance Check
  run: |
    npm run build
    npm start &
    sleep 10
    npm run lighthouse:ci
    npm run lighthouse:check
```

## 📈 Monitoring

The `lighthouse-check.js` script will:
- ✅ Pass if all scores ≥ 95%
- ❌ Fail if any score < 95%
- 📊 Display detailed score breakdown
- 💡 Show specific recommendations for failed categories

## 🎉 Success!

When all checks pass, you'll see:
```
🎉 All Lighthouse scores are above 95%!
Your application meets the performance requirements.
```
