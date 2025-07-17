#!/usr/bin/env python3
"""
Image Organizer Server
Handles file uploads and moving for the drag-and-drop image organizer
"""

import os
import shutil
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import cgi
import tempfile

class ImageOrganizerHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for file uploads"""
        if self.path == '/api/move-image':
            self.handle_move_image()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_move_image(self):
        """Handle image file upload and moving"""
        try:
            # Parse the multipart form data
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )
            
            # Get form data
            project = form.getvalue('project')
            new_name = form.getvalue('newName')
            file_item = form['file']
            
            if not all([project, new_name, file_item]):
                self.send_error(400, "Missing required fields")
                return
            
            # Validate project exists
            project_dir = os.path.join('images', 'projects', project)
            if not os.path.exists(project_dir):
                self.send_error(400, f"Project directory {project} does not exist")
                return
            
            # Get file extension from original file
            original_filename = file_item.filename
            file_ext = os.path.splitext(original_filename)[1].lower()
            
            # Ensure new name has correct extension
            if not new_name.endswith(file_ext):
                new_name = new_name.replace(os.path.splitext(new_name)[1], file_ext)
            
            # Create destination path
            destination_path = os.path.join(project_dir, new_name)
            
            # Save the uploaded file
            with open(destination_path, 'wb') as f:
                shutil.copyfileobj(file_item.file, f)
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'success': True,
                'message': f'Successfully moved {original_filename} to {new_name}',
                'path': destination_path
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            print(f"Error handling file upload: {e}")
            self.send_error(500, f"Internal server error: {str(e)}")
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        """Add CORS headers to all responses"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def run_server(port=5500):
    """Run the image organizer server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ImageOrganizerHandler)
    print(f"🚀 Image Organizer Server running on port {port}")
    print(f"📁 Visit http://localhost:{port}/image-organizer.html")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == '__main__':
    run_server() 