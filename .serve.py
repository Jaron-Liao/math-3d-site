import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
os.chdir(os.path.dirname(os.path.abspath(__file__)))
print('serving', os.getcwd(), flush=True)
ThreadingHTTPServer(('127.0.0.1', 8899), SimpleHTTPRequestHandler).serve_forever()
