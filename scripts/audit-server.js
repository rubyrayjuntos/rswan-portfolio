const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../content-audit-dashboard.html'));
});

// Run audit endpoint
app.post('/api/run-audit', async (req, res) => {
    try {
        console.log('Starting content audit...');
        
        // Run the content audit script
        exec('node scripts/content-audit.js', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
            if (error) {
                console.error('Audit execution error:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Failed to run audit script',
                    details: error.message 
                });
            }
            
            if (stderr) {
                console.warn('Audit stderr:', stderr);
            }
            
            console.log('Audit stdout:', stdout);
            
            // Check if reports were generated
            const reportPath = path.join(__dirname, '../content-audit-report.md');
            const summaryPath = path.join(__dirname, '../content-audit-summary.md');
            
            if (fs.existsSync(reportPath) && fs.existsSync(summaryPath)) {
                res.json({ 
                    success: true, 
                    message: 'Audit completed successfully',
                    reportGenerated: true
                });
            } else {
                res.json({ 
                    success: true, 
                    message: 'Audit completed but reports not found',
                    reportGenerated: false
                });
            }
        });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error',
            details: error.message 
        });
    }
});

// Get audit report
app.get('/api/audit-report', (req, res) => {
    const reportPath = path.join(__dirname, '../content-audit-report.md');
    
    if (fs.existsSync(reportPath)) {
        const report = fs.readFileSync(reportPath, 'utf8');
        res.json({ success: true, report });
    } else {
        res.status(404).json({ success: false, error: 'Report not found' });
    }
});

// Get audit summary
app.get('/api/audit-summary', (req, res) => {
    const summaryPath = path.join(__dirname, '../content-audit-summary.md');
    
    if (fs.existsSync(summaryPath)) {
        const summary = fs.readFileSync(summaryPath, 'utf8');
        res.json({ success: true, summary });
    } else {
        res.status(404).json({ success: false, error: 'Summary not found' });
    }
});

// Get audit statistics
app.get('/api/audit-stats', (req, res) => {
    const summaryPath = path.join(__dirname, '../content-audit-summary.md');
    
    if (fs.existsSync(summaryPath)) {
        const summary = fs.readFileSync(summaryPath, 'utf8');
        
        // Parse statistics from summary
        const totalMatch = summary.match(/Total Projects: (\d+)/);
        const completeMatch = summary.match(/Complete: (\d+)/);
        const needsReviewMatch = summary.match(/Needs Review: (\d+)/);
        const incompleteMatch = summary.match(/Incomplete: (\d+)/);
        
        const stats = {
            total: totalMatch ? parseInt(totalMatch[1]) : 0,
            complete: completeMatch ? parseInt(completeMatch[1]) : 0,
            needsReview: needsReviewMatch ? parseInt(needsReviewMatch[1]) : 0,
            incomplete: incompleteMatch ? parseInt(incompleteMatch[1]) : 0
        };
        
        res.json({ success: true, stats });
    } else {
        res.status(404).json({ success: false, error: 'Summary not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Audit server running on http://localhost:${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}`);
}); 