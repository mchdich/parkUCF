import requests # get API response
import json # dump into jsonl; only one class but standard to import json
import time # loop 
from datetime import datetime # only need one class
import logging
import os  # access data folder

# Set up logging
logging.basicConfig(filename='parking_scraper.log',
                    level=logging.INFO,#from INFO->CRITICAL, no DEBUG 
                    format='%(asctime)s - %(levelname)s - %(message)s')
# you can call APIs to send/get data
# this is API endpoint (URL from which we access API)
URL = "https://secure.parking.ucf.edu/GarageCounter/GetOccupancy"

# Ensure the data folder exists
DATA_DIR = "data" #constants are UPPERCASE
os.makedirs(DATA_DIR, exist_ok=True)#make data dir if not already existent

def fetch_parking_data():
    try:# always be prepared for errors
        response = requests.get(URL)# HTTP GET request to endpoint
        response.raise_for_status()# HTTP status code 2xx ok, 4xx/5xx->except
        data = response.json()#converts JSON array to python list for manip.
        
        extracted_data = []#init list, holds garage_data dicts
        for garage in data:#init garage var for loop
            counts = garage.get("location").get("counts")#get counts and ignore location
            if counts:#if it worked
                location_name = counts.get("location_name", "")
                if location_name.startswith("Garage ") and location_name[7] in 'ABCDH':
                    available = int(counts.get("available"))
                    occupied = int(counts.get("occupied"))
                    total = int(counts.get("total"))
                    occupancy_rate = round(occupied / total, 3)#3 decimal places
                    timestamp = counts.get("timestamp")
                    
                    garage_data = { #dict, key value pairs
                        "name": location_name,
                        "available": available,
                        "occupied": occupied,
                        "total": total,
                        "occupancy_rate": occupancy_rate,
                        "timestamp": timestamp,
                    }
                    extracted_data.append(garage_data)
        return extracted_data
    except requests.exceptions.RequestException as e:
        logging.error(f"Fetch error: {e}")
        return None

def save_to_jsonl(data):
    if not data:
        return

    filename = os.path.join(DATA_DIR, f"parking_data.json")

    # Load existing data if file exists
    if os.path.exists(filename):
        try:
            with open(filename, 'r') as f:
                cumulative_data = json.load(f)
        except json.JSONDecodeError:
            cumulative_data = []
    else:
        cumulative_data = []

    # Append new data
    cumulative_data.extend(data)

    # Write back the full cumulative data
    with open(filename, 'w') as f:
        json.dump(cumulative_data, f, indent=2)
    
    fetch_time = datetime.now()
    logging.info(f"Data appended to {filename} at {fetch_time} ({len(data)} garages)")

# Main loop: Fetch every 120 seconds
while True:
    data = fetch_parking_data()
    if data:
        print(f"Data fetched at {datetime.now()}:")
        print(f"{'Name':<12} {'Available':<8} {'Occupied':<8} {'Total':<6} {'Rate':<8}")
        print("-" * 50)
        for garage in data:
            print(f"{garage['name']:<12} {garage['available']:<8} {garage['occupied']:<8} {garage['total']:<6} {garage['occupancy_rate']:<8}")
        print()
        save_to_jsonl(data)
    else:
        print("No data retrieved")
    
    time.sleep(120)