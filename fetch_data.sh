#!/bin/bash

STATES=("qld" "nsw" "vic" "sa" "wa" "tas" "act" "nt" "nz" "nat")
DATA_DIR="docs/data"

echo "Fetching event data from RCJA API..."

for state in "${STATES[@]}"; do
  echo -n "Fetching $state... "
  response=$(curl -s "https://enter.robocupjunior.org.au/api/v1/public/states/$state/allEventsDetailed/" 2>/dev/null)
  
  if [ ! -z "$response" ] && [ "$response" != "[]" ]; then
    echo "$response" > "$DATA_DIR/$state-events.json"
    count=$(echo "$response" | grep -o '"name"' | wc -l)
    echo "✓ Fetched $count events"
  else
    echo "✗ Empty response, keeping placeholder"
  fi
done

echo "Done!"
