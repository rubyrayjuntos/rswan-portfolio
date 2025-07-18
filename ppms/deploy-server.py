#!/usr/bin/env python3
"""
PPMS Portfolio Deployment Server
Automatically deploys projects from PPMS to portfolio directory
"""

import json
import os
import shutil
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser

class PortfolioDeploymentHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, portfolio_path=None, **kwargs):
        self.portfolio_path = portfolio_path
        super().__init__(*args, **kwargs)
    
    def do_POST(self):
        if self.path == '/api/deploy-portfolio':
            self.handle_deploy_portfolio()
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_GET(self):
        if self.path == '/':
            self.send_deployment_status()
        elif self.path == '/health':
            self.send_health_check()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_deploy_portfolio(self):
        try:
            # Get content length
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            deployment_data = json.loads(post_data.decode('utf-8'))
            
            # Extract data
            manifest = deployment_data.get('manifest', {})
            projects = deployment_data.get('projects', [])
            
            # Deploy to portfolio directory
            success, message = self.deploy_to_portfolio(manifest, projects)
            
            # Send response
            self.send_response(200 if success else 500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                'success': success,
                'message': message,
                'timestamp': datetime.now().isoformat(),
                'projects_deployed': len(projects)
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Deployment failed: {str(e)}")
    
    def deploy_to_portfolio(self, manifest, projects):
        try:
            if not self.portfolio_path:
                return False, "Portfolio path not configured"
            
            # Create backup
            backup_path = self.create_backup()
            
            # Create _data directory
            data_dir = os.path.join(self.portfolio_path, '_data')
            os.makedirs(data_dir, exist_ok=True)
            
            # Create projects directory
            projects_dir = os.path.join(data_dir, 'projects')
            os.makedirs(projects_dir, exist_ok=True)
            
            # Write manifest
            manifest_path = os.path.join(data_dir, 'manifest.json')
            with open(manifest_path, 'w', encoding='utf-8') as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
            
            # Write project files
            for project in projects:
                filename = f"{project['id']}-{project['title'].lower().replace(' ', '-').replace('/', '-')}.json"
                project_path = os.path.join(projects_dir, filename)
                with open(project_path, 'w', encoding='utf-8') as f:
                    json.dump(project, f, indent=2, ensure_ascii=False)
            
            return True, f"Successfully deployed {len(projects)} projects to {self.portfolio_path}"
            
        except Exception as e:
            return False, f"Deployment error: {str(e)}"
    
    def create_backup(self):
        """Create a backup of the current portfolio data"""
        try:
            backup_dir = os.path.join(self.portfolio_path, 'backups')
            os.makedirs(backup_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_path = os.path.join(backup_dir, f'backup_{timestamp}')
            
            # Copy _data directory if it exists
            data_dir = os.path.join(self.portfolio_path, '_data')
            if os.path.exists(data_dir):
                shutil.copytree(data_dir, backup_path)
            
            return backup_path
        except Exception as e:
            print(f"Backup failed: {e}")
            return None
    
    def send_deployment_status(self):
        """Send deployment status page"""
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>PPMS Portfolio Deployment Server</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .status {{ padding: 20px; background: #f0f0f0; border-radius: 8px; }}
                .success {{ background: #d4edda; color: #155724; }}
                .error {{ background: #f8d7da; color: #721c24; }}
            </style>
        </head>
        <body>
            <h1>🚀 PPMS Portfolio Deployment Server</h1>
            <div class="status">
                <h2>Status: Running</h2>
                <p><strong>Portfolio Path:</strong> {self.portfolio_path or 'Not configured'}</p>
                <p><strong>Server Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <p><strong>API Endpoint:</strong> POST /api/deploy-portfolio</p>
            </div>
            <h3>Usage:</h3>
            <p>This server automatically deploys projects from PPMS to your portfolio directory.</p>
            <p>Send a POST request to <code>/api/deploy-portfolio</code> with your project data.</p>
        </body>
        </html>
        """
        
        self.wfile.write(html.encode('utf-8'))
    
    def send_health_check(self):
        """Send health check response"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'portfolio_path': self.portfolio_path
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def log_message(self, format, *args):
        """Custom logging to show deployment activity"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

def create_handler_class(portfolio_path):
    """Create a handler class with the portfolio path"""
    class Handler(PortfolioDeploymentHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, portfolio_path=portfolio_path, **kwargs)
    return Handler

def main():
    # Get portfolio path from command line or use default
    import sys
    if len(sys.argv) > 1:
        portfolio_path = sys.argv[1]
    else:
        # Default to current directory
        portfolio_path = os.getcwd()
    
    # Validate portfolio path
    if not os.path.exists(portfolio_path):
        print(f"Error: Portfolio path '{portfolio_path}' does not exist")
        sys.exit(1)
    
    print(f"🚀 Starting PPMS Portfolio Deployment Server")
    print(f"📁 Portfolio Path: {portfolio_path}")
    print(f"🌐 Server will start on http://localhost:8080")
    
    # Create handler class with portfolio path
    HandlerClass = create_handler_class(portfolio_path)
    
    # Start server
    server = HTTPServer(('localhost', 8080), HandlerClass)
    
    # Open browser
    def open_browser():
        import time
        time.sleep(1)
        webbrowser.open('http://localhost:8080')
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    print(f"✅ Server started! Press Ctrl+C to stop")
    print(f"📖 Visit http://localhost:8080 for status")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped")
        server.shutdown()

if __name__ == '__main__':
    main() 