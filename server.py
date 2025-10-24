#!/usr/bin/env python3
import http.server
import socketserver

# For some reason, Port 8000 gets messed up
PORT = 8114

# Fixes local mime type issues
if __name__ == '__main__':
    http.server.SimpleHTTPRequestHandler.extensions_map['.js'] = 'application/javascript'
    http.server.SimpleHTTPRequestHandler.extensions_map['.css'] = 'text/css'
    http.server.test(port=PORT, HandlerClass=http.server.SimpleHTTPRequestHandler, protocol="HTTP/1.1")
    
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    httpd.serve_forever()