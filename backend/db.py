from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Read MongoDB URI from env
uri = os.getenv("MONGO_URI")

# Create the MongoDB client
client = MongoClient(uri, server_api=ServerApi('1'))

# Try connecting (optional, but useful for debugging)
try:
    client.admin.command('ping')
    print("✅ Pinged your MongoDB deployment. Connection successful!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

# Define database and collection references
db = client["dootle"]  # database name
stories_collection = db["stories"]
