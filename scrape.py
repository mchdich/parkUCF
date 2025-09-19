import requests
import json
import time
from datetime import datetime
import logging
import os  # <-- added for folder management

# Set up logging
logging.basicConfig(filename='parking_scraper.log', level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

# API endpoint
URL = "https://secure.parking.ucf.edu/GarageCounter/GetOccupancy"

# Ensure the data folder exists
DATA_DIR = "data"  # <-- new
os.makedirs(DATA_DIR, exist_ok=True)  # <-- new

# Function to fetch and extract data for garages A-H only
def fetch_parking_data():
    try:
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()
        
        extracted_data = []
        for garage in data:
            counts = garage.get("location", {}).get("counts", {})
            if counts:
                location_name = counts.get("location_name", "")
                if location_name.startswith("Garage ") and location_name[7] in 'ABCDEFGH':
                    # Parse API timestamp to ISO format
                    try:
                        api_ts = datetime.strptime(counts.get("timestamp"), "%m/%d/%Y %H:%M:%S")
                        iso_timestamp = api_ts.isoformat()
                    except ValueError:
                        iso_timestamp = counts.get("timestamp")
                    
                    available = int(counts.get("available") or 0)
                    occupied = int(counts.get("occupied") or 0)
                    total = int(counts.get("total") or 0)
                    occupancy_rate = round(occupied / total, 4) if total > 0 else 0.0
                    
                    garage_data = {
                        "fetch_time": datetime.now().isoformat(),
                        "name": location_name,
                        "available": available,
                        "occupied": occupied,
                        "total": total,
                        "occupancy_rate": occupancy_rate,
                        "timestamp": iso_timestamp,
                        "day_of_week": datetime.now().weekday(),  # 0=Monday, 6=Sunday
                        "hour": datetime.now().hour,
                        "minute": datetime.now().minute,
                        "second": datetime.now().second
                    }
                    extracted_data.append(garage_data)
        return extracted_data
    except requests.exceptions.RequestException as e:
        logging.error(f"Fetch error: {e}")
        return None

# Function to save data as JSONL (each line = one JSON object)
def save_to_jsonl(data):
    if not data:
        return
    
    # Only save on weekdays (Mon=0 ... Sun=6)
    today = datetime.now().weekday()
    if today >= 5:
        print("Weekend detected — skipping data save.")
        logging.info("Weekend detected — no data saved.")
        return

    # Build daily filename inside the 'data' folder
    date_str = datetime.now().strftime("%Y%m%d")  # e.g., 20250918
    filename = os.path.join(DATA_DIR, f"parking_data_{date_str}.jsonl")  # <-- modified

    fetch_time = datetime.now().isoformat()
    
    with open(filename, 'a') as jsonl_file:
        for entry in data:
            # Write each garage as a separate JSON line
            json.dump(entry, jsonl_file)
            jsonl_file.write('\n')
    
    logging.info(f"Data appended to {filename} at {fetch_time} ({len(data)} garages)")

# Main loop: Fetch every 120 seconds
while True:
    data = fetch_parking_data()
    if data:
        print(f"Data fetched at {datetime.now().isoformat()}:")
        print(f"{'Name':<12} {'Available':<8} {'Occupied':<8} {'Total':<6} {'Rate':<8}")
        print("-" * 50)
        for garage in data:
            print(f"{garage['name']:<12} {garage['available']:<8} {garage['occupied']:<8} {garage['total']:<6} {garage['occupancy_rate']:<8}")
        print()
        save_to_jsonl(data)
    else:
        print("No data retrieved")
    
    time.sleep(120)
