# PPMS (Portfolio Project Management System) Usage Guide

## Overview
The PPMS is a comprehensive dashboard for managing your portfolio projects. It allows you to create, edit, import, and export projects in bulk, with seamless integration to your portfolio site.

## 🔄 a) Bulk Update Projects from Individual Files

### Method 1: Bulk Import (Recommended)
1. **Go to Export Tab** in the PPMS dashboard
2. **Click "Bulk Import Projects"** button
3. **Select multiple JSON files** (your individual project files)
4. **The system will:**
   - Validate each file
   - Convert string arrays to proper IDs
   - Update existing projects (by title match)
   - Create new projects for unmatched titles
   - Handle null/empty values gracefully

### Method 2: Individual File Import
1. **Go to Projects Tab**
2. **Click "Add Project"**
3. **Choose "Load from JSON File"**
4. **Select your project JSON file**
5. **Review and confirm** the imported data

### Supported File Formats
- Individual project JSON files
- Files with `style: null` (automatically converted to empty array)
- Files with string arrays for genres, styles, technologies
- Files with single string values (converted to arrays)

### Validation Improvements
- ✅ Handles `style: null` gracefully
- ✅ Converts null/undefined to empty arrays
- ✅ Supports both array and single string values
- ✅ Updates existing projects instead of creating duplicates

## ⚠️ b) Style = null Warning Fix

### What Was Fixed
The system now properly handles:
- `style: null` → converts to `styles: []`
- `genre: null` → converts to `genres: []`
- `tech: null` → converts to `technologies: []`

### Validation Logic
```javascript
// Before: Rejected null values
if (data.hasOwnProperty('style') && data.style === null) {
    data.style = []; // Now converts null to empty array
}
```

### Import Process
1. **File validation** checks for required fields only
2. **Data conversion** handles null/undefined values
3. **Lookup creation** for new genres/styles/technologies
4. **Project creation/update** with proper data structure

## 🚀 c) Pushing Changes to Portfolio Site

### 🎯 **One-Click Automated Deployment** (Recommended)

The PPMS now supports **automatic deployment** with a single click!

#### Option 1: File System API (Modern Browsers)
1. **Go to Export Tab** in PPMS
2. **Click "Export for Portfolio"** or **"Export All to Portfolio"**
3. **Select your portfolio directory** when prompted
4. **Done!** Files are automatically written to the correct locations

#### Option 2: Deployment Server (All Browsers)
1. **Start the deployment server:**
   ```bash
   # Windows
   start-deployment-server.bat
   
   # Or manually
   python ppms/deploy-server.py
   ```
2. **Go to Export Tab** in PPMS
3. **Click "Export for Portfolio"** or **"Export All to Portfolio"**
4. **Done!** Server automatically deploys to your portfolio

### 📦 Manual Export (Fallback)
If automated deployment isn't available:
1. **Go to Export Tab**
2. **Click "Export for Portfolio"** or **"Export All to Portfolio"**
3. **Download the files:**
   - `manifest.json` (portfolio manifest)
   - Individual project files (e.g., `1-my-project.json`)
   - `portfolio-deployment-YYYY-MM-DD.json` (complete package)
4. **Manually copy files** to portfolio directories

### 🔧 Deployment Server Setup

The deployment server provides:
- **Automatic file writing** to correct locations
- **Backup creation** before deployment
- **Error handling** and status reporting
- **Health monitoring** at http://localhost:8080

#### Server Features:
- ✅ **Automatic backups** before deployment
- ✅ **Directory creation** if needed
- ✅ **File validation** and error reporting
- ✅ **CORS support** for web requests
- ✅ **Status monitoring** via web interface

### File Structure After Export
```
Your Portfolio/
├── _data/
│   ├── manifest.json          ← Replace this
│   └── projects/
│       ├── 1-project-one.json ← Copy these
│       ├── 2-project-two.json
│       └── 3-project-three.json
├── index.html
└── ... (other portfolio files)
```

## 🛠️ Advanced Features

### Bulk Operations
- **Bulk Status Update**: Change status for multiple projects
- **Bulk Technology Add**: Add technologies to multiple projects
- **Bulk Export**: Export selected projects only
- **Bulk Delete**: Remove multiple projects

### Templates
- **Create Templates**: Save project configurations
- **Apply Templates**: Use templates for new projects
- **Import/Export Templates**: Share templates between systems

### Analytics & Monitoring
- **Project Statistics**: View project counts, completion rates
- **Performance Metrics**: Load times, user interactions
- **Content Analytics**: Technology popularity, quality scores
- **System Health**: Memory usage, validation status

### Backup & Version Control
- **Auto Backup**: Automatic backups every 30 minutes
- **Manual Backup**: Create backups with descriptions
- **Restore**: Roll back to previous versions
- **Export/Import**: Full data portability

## 🔧 Troubleshooting

### Import Issues
- **"Invalid project format"**: Check required fields (title, description, medium)
- **"Style = null not accepted"**: Fixed - now converts to empty array
- **Duplicate projects**: System updates existing projects by title

### Export Issues
- **Missing images**: First gallery image becomes hero image
- **Broken links**: Use validation system to check URLs
- **Format errors**: Check console for detailed error messages

### Portfolio Integration
- **Projects not showing**: Verify manifest.json is in correct location
- **Images not loading**: Check image URLs in gallery field
- **Styling issues**: Ensure portfolio CSS matches project data structure

## 📋 Best Practices

### Project Management
1. **Use consistent naming** for projects
2. **Add images to gallery** (first image = hero image)
3. **Validate URLs** before saving
4. **Use templates** for similar project types
5. **Create regular backups** before major changes

### Data Import
1. **Backup existing data** before bulk imports
2. **Test with small batches** first
3. **Review converted data** before confirming
4. **Check console logs** for warnings/errors

### Portfolio Deployment
1. **Always backup** current portfolio
2. **Test locally** before deploying
3. **Verify all images** load correctly
4. **Check mobile responsiveness**
5. **Validate all links** work properly

## 🆘 Support

### Debug Information
- **Console logs** show detailed import/export information
- **Validation status** displays field-level issues
- **Analytics dashboard** shows system health
- **Activity log** tracks all changes

### Common Commands
```javascript
// Check current data
console.log(dashboard.data);

// Export specific project
dashboard.exportProjectPreview();

// Validate all data
dashboard.validateAllData();

// Create backup
dashboard.createManualBackup();
```

---

**Need Help?** Check the browser console for detailed error messages and debugging information. The PPMS includes comprehensive logging to help identify and resolve issues. 