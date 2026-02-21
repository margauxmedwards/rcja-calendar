# State Regional Calendar Configuration

This system allows each state to have its own customizable regional calendar page.

## How It Works

Each state can have a regional calendar page at `/{STATE_CODE}` (e.g., `/QLD`, `/VIC`, `/NSW`).

The page automatically:
- Determines the current year dynamically (no need to update yearly)
- Categorizes events into sub-regions based on keywords
- Displays events in an interactive sidebar layout
- Highlights state and national events
- Includes registration links when available

## Adding or Customizing a State

Edit `stateConfig.js` to add or customize states:

```javascript
"STATE_CODE": {
  enabled: true,  // Set to false to disable the page
  title: "RCJSTATE – Full State Name Regional Calendar",
  subRegions: {
    "region-key": {
      title: "Region Display Name",
      keywords: ["keyword1", "keyword2", ...]  // Used to match events to regions
    },
    // Add more regions...
  },
  defaultRegion: "region-key",  // Where state/national events go if no keyword matches
  regionOrder: ["region-key", ...]  // Order regions appear in the sidebar
}
```

## Example: Adding a New State

```javascript
"TAS": {
  enabled: true,
  title: "RCJTAS – Tasmania Regional Calendar",
  subRegions: {
    "south": {
      title: "Southern Tasmania",
      keywords: ["hobart", "kingston", "huonville", "southern"]
    },
    "north": {
      title: "Northern Tasmania",
      keywords: ["launceston", "northern", "devonport", "burnie"]
    },
  },
  defaultRegion: "south",
  regionOrder: ["south", "north"]
}
```

## How Event Categorization Works

Events are automatically categorized into sub-regions by matching keywords against:
- Event name
- Venue name
- Venue address

If multiple keywords match, the first matching region (in order defined) wins.

Special cases:
- Events containing "state" or "national" automatically go to the `defaultRegion`
- Events with no keyword matches are not displayed in any region

## URLs

- **Regional page**: `/{STATE_CODE}` (e.g., `/QLD`, `/VIC`)
- **API endpoint**: `/api/{STATE_CODE}/regions` (returns event data)
- **Config endpoint**: `/api/{STATE_CODE}/config` (returns page configuration)

## Customizing Keywords

Make keywords as specific as possible to avoid miscategorization:
- Use suburb/city names: `"brisbane"`, `"melbourne"`, `"sydney"`
- Use region identifiers: `"metro"`, `"regional"`, `"northern"`
- Use venue names if known: `"convention centre"`, `"showgrounds"`
- Keywords are case-insensitive
- Partial matches work (e.g., `"bris"` matches "Brisbane")

## Disabling a State

Set `enabled: false` in the state's configuration to temporarily disable its regional calendar page while keeping the configuration.

## Testing

1. Add/modify configuration in `stateConfig.js`
2. Restart the server
3. Visit `/{STATE_CODE}` to see the regional page
4. Check `/api/{STATE_CODE}/config` to verify configuration
5. Check `/api/{STATE_CODE}/regions` to verify event categorization
