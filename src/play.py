import json
import requests

def ingest():
    response = requests.get("https://secure.parking.ucf.edu/GarageCounter/GetOccupancy")
    raw_json = response.text
    dicts = json.loads(raw_json)
    print(dicts)

ingest()