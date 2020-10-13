import os
from waitress import serve
from app import app as server
from dotenv import load_dotenv

load_dotenv()

PORT = os.getenv("PORT")

if __name__ == "__main__":
    serve(server, host='0.0.0.0', port=PORT)