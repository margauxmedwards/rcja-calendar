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

## Embedding into State Websites

The regional calendar pages are designed to be embedded into state RoboCup websites using iframes.

### Basic Embed Code

```html
<iframe 
  src="https://rcja.app/calendar/qld" 
  width="100%" 
  height="700" 
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>
```

Replace `qld` with your state code (e.g., `vic`, `nsw`, `sa`, `wa`).

### Responsive Embed

For a responsive embed that adjusts to the page width:

```html
<div style="position: relative; width: 100%; max-width: 1000px; margin: 20px auto;">
  <iframe 
    src="https://rcja.app/calendar/qld" 
    width="100%" 
    height="700" 
    frameborder="0"
    style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  </iframe>
</div>
```

### WordPress Embed

For WordPress sites, you can use the HTML block and paste the embed code directly, or use this shortcode approach:

```html
<!-- Add this to your page in HTML mode -->
<iframe src="https://rcja.app/calendar/qld" width="100%" height="700" frameborder="0"></iframe>
```

### Considerations

- **Height**: Adjust the `height` attribute based on your needs (700-900px recommended)
- **Mobile**: The embedded page is fully responsive and works on mobile devices
- **Updates**: The calendar automatically updates every 5 minutes, so embedded pages always show current data
- **No Background**: The page includes its own background image, so it looks good when embedded
- **Sync Link**: Users can click "Sync to Calendar" within the embed to add events to their personal calendar

### Example URLs

- Queensland: `https://rcja.app/calendar/qld`
- Victoria: `https://rcja.app/calendar/vic`
- New South Wales: `https://rcja.app/calendar/nsw`
- South Australia: `https://rcja.app/calendar/sa`
- Western Australia: `https://rcja.app/calendar/wa`

### Custom Styling (Optional)

If you want the embed to blend better with your site, wrap it in a container:

```html
<div class="rcja-calendar-embed">
  <iframe 
    src="https://rcja.app/calendar/qld" 
    width="100%" 
    height="700" 
    frameborder="0"
    style="border: none;">
  </iframe>
</div>

<style>
.rcja-calendar-embed {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}
</style>
```

## Testing

1. Add/modify configuration in `stateConfig.js`
2. Restart the server
3. Visit `/{STATE_CODE}` to see the regional page
4. Check `/api/{STATE_CODE}/config` to verify configuration
5. Check `/api/{STATE_CODE}/regions` to verify event categorization
