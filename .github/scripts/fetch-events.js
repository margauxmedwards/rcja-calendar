const https = require('https');
const fs = require('fs');
const path = require('path');

const states = ['QLD', 'NSW', 'VIC', 'SA', 'WA', 'TAS', 'ACT', 'NT', 'NAT'];
const dataDir = path.join(__dirname, '../../docs/data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function fetchEvents(state) {
  return new Promise((resolve, reject) => {
    const url = `https://enter.robocupjunior.org.au/api/v1/public/states/${state.toLowerCase()}/allEventsDetailed/`;
    
    console.log(`Fetching events for ${state}...`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const events = JSON.parse(data);
          const filePath = path.join(dataDir, `${state.toLowerCase()}-events.json`);
          fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
          console.log(`✓ Saved ${events.length} events for ${state} to ${filePath}`);
          resolve(events.length);
        } catch (err) {
          console.error(`✗ Error parsing data for ${state}:`, err.message);
          reject(err);
        }
      });
    }).on('error', (err) => {
      console.error(`✗ Error fetching ${state}:`, err.message);
      reject(err);
    });
  });
}

async function main() {
  try {
    const results = {};
    for (const state of states) {
      try {
        results[state] = await fetchEvents(state);
      } catch (err) {
        console.error(`Failed to fetch ${state}:`, err.message);
        results[state] = 0;
      }
    }
    
    console.log('\n✓ Event fetching complete:', results);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
