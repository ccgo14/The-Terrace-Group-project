import sys
import os

# Resolve project root so this file runs both directly and via -m
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from server import create_app

app = create_app()

if __name__ == '__main__':
    app.run(port=5555, debug=True)