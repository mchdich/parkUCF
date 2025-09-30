import json
import requests
import os
import time
import logging

logging.basicConfig(filename='extract.log',
					level=logging.INFO,
					format='%(asctime)s - %(levelname)s - %(message)s')

def extract():
	try:
		response = requests.get("https://secure.parking.ucf.edu/GarageCounter/GetOccupancy")
		response.raise_for_status()
		data = response.json()
		if data:
			filtered = [
			    {
                    "name": garage['location']['counts']['location_name'],
                    "available": garage['location']['counts']['available'],
                    "occupied": garage['location']['counts']['occupied'],
                    "total": garage['location']['counts']['total'],
					"occupancy_rate": round(garage['location']['counts']['occupied']/garage['location']['counts']['total'], 3),
					"event_reserved": garage['location']['counts']['event_reserved'],
                    "event_name": garage['location']['counts']['event_name'],
                    "timestamp": garage['location']['counts']['timestamp'],
                }
				for garage in data
		        if garage['location']['counts']['location_name'][7] in 'ABCDH'
            ]	
			return filtered
	except requests.exceptions.RequestsException as e:
		logging.error(f"Fetch error: {e}")

def save(counts):
	if counts:
		filename = os.path.join("data", "raw", "parking_data.json")
		try:
			with open(filename, 'r') as f:
				cumulative_data = json.load(f)
		except json.JSONDecodeError:
			cumulative_data = []
		cumulative_data.extend(counts)
		with open(filename, 'w') as f:
			json.dump(cumulative_data, f, indent=2)
		logging.info(f"Successfully saved data for {len(counts)} garages")
		
while True:
	counts = extract()
	if (counts):
		save(counts)
	time.sleep(120)