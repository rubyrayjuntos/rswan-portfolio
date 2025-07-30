# Content Audit Dashboard

A simple web interface for running content audits on your portfolio projects and viewing the results.

## Features

- **One-Click Audit**: Run comprehensive content audits with a single button click
- **Real-Time Results**: View audit reports and summaries immediately after completion
- **Statistics Dashboard**: See project completion statistics at a glance
- **Clean Interface**: Neumorphic design matching your portfolio's aesthetic
- **No Complex Setup**: Simple server that runs your existing audit script

## Quick Start

### Option 1: Using npm script (Recommended)
```bash
npm run audit
```

### Option 2: Using batch file (Windows)
```bash
start-audit-server.bat
```

### Option 3: Direct command
```bash
node scripts/audit-server.js
```

## Usage

1. **Start the server** using one of the methods above
2. **Open your browser** and go to `http://localhost:3001`
3. **Click "Run Content Audit"** to start the audit process
4. **View results** in the dashboard panels

## What the Audit Checks

The dashboard runs your existing `scripts/content-audit.js` script, which checks:

### Content Completeness
- Required sections (title, description, pitch, challenge, development, outcome)
- Medium-specific content (process/inspiration for art, specs/artifacts for code, excerpts/themes for writing)

### Image Validation
- Card hero images exist in the correct folder structure
- Gallery images are properly referenced

### Link Validation
- External and internal links are valid
- No broken or placeholder URLs

## Dashboard Features

### Statistics Cards
- **Total Projects**: Number of projects analyzed
- **Complete**: Projects with all required content
- **Needs Review**: Projects with minor issues
- **Incomplete**: Projects missing core content

### Report Panels
- **Audit Report**: Detailed analysis of each project
- **Audit Summary**: Executive summary with action items

### Controls
- **Run Content Audit**: Execute the audit script
- **View Latest Report**: Display the most recent audit report
- **View Summary**: Show the audit summary
- **Clear Results**: Reset the dashboard

## Server Endpoints

The dashboard uses these API endpoints:

- `POST /api/run-audit` - Execute the content audit script
- `GET /api/audit-report` - Retrieve the full audit report
- `GET /api/audit-summary` - Retrieve the audit summary
- `GET /api/audit-stats` - Get project statistics

## Troubleshooting

### Server won't start
- Make sure you have Node.js installed
- Install dependencies: `npm install`
- Check if port 3001 is available

### Audit fails
- Ensure `scripts/content-audit.js` exists and is working
- Check that `_data/projects/` directory exists
- Verify file permissions

### Reports not loading
- Check that `content-audit-report.md` and `content-audit-summary.md` were generated
- Look at the server console for error messages

## Files

- `content-audit-dashboard.html` - The main dashboard interface
- `scripts/audit-server.js` - Express server that runs the audit
- `start-audit-server.bat` - Windows batch file for easy startup
- `AUDIT_DASHBOARD_README.md` - This documentation

## Integration

This dashboard integrates seamlessly with your existing content audit system:

- Uses your existing `scripts/content-audit.js` script
- Reads the same report files (`content-audit-report.md`, `content-audit-summary.md`)
- Follows your project's design patterns and color scheme
- No changes needed to your existing audit logic 