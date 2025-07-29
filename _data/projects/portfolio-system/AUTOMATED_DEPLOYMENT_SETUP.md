# 🚀 Automated Portfolio Deployment Setup

## Overview
The PPMS now supports **one-click automated deployment** to your portfolio! No more manual file copying.

## 🎯 Quick Start

### Option 1: File System API (Easiest - Modern Browsers)
1. **Open PPMS** in a modern browser (Chrome, Edge, Firefox)
2. **Go to Export Tab**
3. **Click "Export for Portfolio"** or **"Export All to Portfolio"**
4. **Select your portfolio directory** when prompted
5. **Done!** Files are automatically deployed

### Option 2: Deployment Server (All Browsers)
1. **Start the deployment server:**
   ```bash
   # Windows (double-click)
   start-deployment-server.bat
   
   # Or manually
   python ppms/deploy-server.py
   ```
2. **Open PPMS** in any browser
3. **Go to Export Tab**
4. **Click "Export for Portfolio"** or **"Export All to Portfolio"**
5. **Done!** Server automatically deploys files

## 🔧 Server Setup (Option 2)

### Prerequisites
- Python 3.7 or higher
- Your portfolio directory accessible

### Installation
1. **Check Python:**
   ```bash
   python --version
   ```

2. **Start server:**
   ```bash
   # From portfolio root directory
   python ppms/deploy-server.py
   
   # Or specify custom path
   python ppms/deploy-server.py "C:\path\to\your\portfolio"
   ```

3. **Verify server:**
   - Open http://localhost:8080
   - Should show "Status: Running"

### Server Features
- ✅ **Automatic backups** before deployment
- ✅ **Directory creation** if needed
- ✅ **Error handling** and reporting
- ✅ **Health monitoring**
- ✅ **CORS support** for web requests

## 📁 What Gets Deployed

The system automatically creates/updates:
```
Your Portfolio/
├── _data/
│   ├── manifest.json          ← Updated automatically
│   └── projects/
│       ├── 1-project-one.json ← Created automatically
│       ├── 2-project-two.json
│       └── 3-project-three.json
└── backups/                   ← Automatic backups
    └── backup_20250717_143022/
```

## 🔄 Workflow

### Before Deployment
1. **Edit projects** in PPMS
2. **Preview changes** using the preview feature
3. **Save all changes**

### During Deployment
1. **Click export button**
2. **Select directory** (if using File System API)
3. **Wait for confirmation**

### After Deployment
1. **Refresh portfolio page**
2. **Verify changes** are visible
3. **Test functionality**

## 🛠️ Troubleshooting

### File System API Issues
- **"Permission denied"**: Grant folder access when prompted
- **"Not supported"**: Use deployment server instead
- **"Directory not found"**: Select the correct portfolio root folder

### Server Issues
- **"Port 8080 in use"**: Change port in deploy-server.py
- **"Python not found"**: Install Python 3.7+
- **"Permission error"**: Run as administrator (Windows)

### Deployment Issues
- **Files not updating**: Check server logs at http://localhost:8080
- **Portfolio not refreshing**: Hard refresh (Ctrl+F5)
- **Backup failed**: Check disk space and permissions

## 🔒 Security Notes

- **Local only**: Server runs on localhost only
- **No external access**: Cannot be accessed from internet
- **Backup protection**: Automatic backups before changes
- **File validation**: Checks file integrity before writing

## 📊 Monitoring

### Server Status
- **Health check**: http://localhost:8080/health
- **Status page**: http://localhost:8080
- **Console logs**: Check terminal output

### Deployment Logs
- **Success**: Green notification in PPMS
- **Errors**: Red notification with details
- **Warnings**: Yellow notification with suggestions

## 🎉 Benefits

### Before (Manual)
- ❌ Copy files manually
- ❌ Risk of overwriting wrong files
- ❌ No automatic backups
- ❌ Time-consuming process
- ❌ Error-prone

### After (Automated)
- ✅ One-click deployment
- ✅ Automatic file placement
- ✅ Built-in backups
- ✅ Instant deployment
- ✅ Error handling

---

**Ready to deploy?** Just click the export button in PPMS and watch the magic happen! 🚀 