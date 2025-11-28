import json
import os

def process():
	raw_file = os.path.join("data", "raw", "parking_data.json")

	with open(raw_file, 'r') as f:
		data = json.load(f)
	
	processed = [
		{
			"name": garage['name'],
			"occupancy_rate": garage['occupancy_rate'],
			"timestamp": garage['timestamp']
		}
		for garage in data
	]
	
	return processed;

def save(processed):
	processed_file = os.path.join("data", "processed", "parking_data.json")

	with open(processed_file, 'w') as f:
		json.dump(processed, f, indent=2)
		

if __name__ == '__main__':
	processed = process()
	save(processed)
