import json
import requests
import logging
import boto3
from datetime import datetime

logging.basicConfig(filename='extract.log',
					level=logging.INFO,
					format='%(asctime)s - %(levelname)s - %(message)s')

URL = "https://secure.parking.ucf.edu/GarageCounter/GetOccupancy"

def extract():
    try:
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()
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
            if garage['location']['counts']['location_name'][7] in 'ABCDHI'
        ]
        return filtered
    except requests.exceptions.RequestException as e:
        raise

def save(data):
    bucket_name = "parkucfdatalake"
    file_name = datetime.now().strftime("%Y%m%d_%H%M%S") + ".json"
    s3_path = "raw/" + file_name
    s3 = boto3.resource("s3")
    s3.Bucket(bucket_name).put_object(
        Key=s3_path,
        Body=json.dumps(data).encode('UTF-8'),
        ContentType='application/json'
    )
    

def lambda_handler(event, context):
    try:
        data = extract()
        save(data)
        return {
            'statusCode': 200,
            'body': 'Extraction & save complete'
        }
    except Exception as e:
        logging.error(f"Execution failed: {e}")
        return {
            'statusCode': 500,
            'body': f'Execution failed: {e}'
        }