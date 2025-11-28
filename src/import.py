import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def import_data():
    filename = os.path.join("data", "raw", "parking_data.json")
    with open(filename, 'r') as f:
        data = json.load(f)
    supabase.table("raw_data").insert(data).execute()

if __name__ == "__main__":
    import_data()