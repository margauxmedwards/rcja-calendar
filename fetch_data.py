#!/usr/bin/env python3
import urllib.request
import json
import os

states = ['qld', 'nsw', 'vic', 'sa', 'wa']
base_url = "https://enter.robocupjunior.org.au/api/v1/public/states"
output_dir = "docs/data"

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

for state in states:
    try:
        url = f"{base_url}/{state}/allEventsDetailed/"
        print(f"Fetching {state}...", end=" ")
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            output_file = f"{output_dir}/{state}-events.json"
            with open(output_file, 'w') as f:
                json.dump(data, f)
            
            print(f"✓ Saved {len(data) if isinstance(data, list) else len(data.get('events', []))} events")
    except Exception as e:
        print(f"✗ Error: {e}")

print("Done!")
