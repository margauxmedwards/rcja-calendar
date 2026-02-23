const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
const express = require("express");
const morgan = require("morgan");
const ical = require("ical-generator");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const { stateConfigs } = require("./stateConfig");
dotenv.config();

let cachedStates = null;
let cachedEvents = null;

const app = express();
app.set('trust proxy', true);
app.set('case sensitive routing', false);

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

app.use(express.static(path.join(__dirname, 'public')));

morgan.token('statusColor', (req, res, args) => {
  var status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent)
      ? res.statusCode
      : undefined

  // get status color
  var color = status >= 500 ? 31 // red
      : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
      : status >= 200 ? 32 // green
      : 0; // no color

  return '\x1b[' + color + 'm' + status + '\x1b[0m';
});
app.use(morgan(':statusColor :method :url - :response-time ms - :req[x-Forwarded-For] :remote-user'));

// State RCJ title mapping information, will fall back to "RCJA" if no mapping is found
const stateTitleMapping = {
  "VIC": "RCJV",
  "NSW": "RCJNSW",
  "QLD": "RCJQ",
  "SA": "RCJSA",
  "WA": "RCJWA",
  "NT": "RCJNT",
  "ACT": "RCJACT",
  "TAS": "RCJTAS",
  "NAT": "RCJA",
  "NZ": "RCJNZ",
}

// All state codes for australian events (excludes NZ)
const ausStateCodes = ["VIC", "NSW", "QLD", "SA", "WA", "NT", "ACT", "TAS", "NAT"];

// Background task to fetch events from the RCJA Entry System API and store them in a local cache
// This is to avoid having to make a request to the API every time a user requests a calendar file
const fetchEvents = async () => {
  try {
    const { data: states } = await axios.get(
      "https://enter.robocupjunior.org.au/api/v1/public/states/"
    );
    
    let stateCodes = states.map(state => state.abbreviation);
    let events = {};
    stateCodes.forEach(key => events[key] = []);
    
    for (const state of states) {
      const { data: stateEvents } = await axios.get(
        `https://enter.robocupjunior.org.au/api/v1/public/states/${state.abbreviation}/allEventsDetailed`
      );
      stateEvents.forEach(event => event.realStateAbbr = state.abbreviation);
      events[state.abbreviation] = stateEvents;
    }
    
    cachedStates = states;
    cachedEvents = events;
  } catch (error) {
    console.error(`Error fetching events: ${error}`);
  }
};

setInterval(fetchEvents, process.env.FETCH_INTERVAL || 3600000); // 1 hour
fetchEvents();

// Query Parameters:
// - regions: The regions abbreviation(s) to filter by (e.g. "VIC" or "VIC,NSW")
// - hide: The event type(s) to hide (e.g. "competitions" or "workshops", cannot be both)
app.get("/file", async (req, res) => {
  if (!cachedEvents) {
    res.status(503).send({ error: "Events cache is not yet populated, please try again shortly." });
    return;
  }
  try {
    let events = [];
    
    let stateCodes = Object.keys(cachedEvents);
    let requestedStateCodes = req.query.regions ? req.query.regions.split(",") : stateCodes;

    // make sure all requestedStateCodes match stateCodes
    if (requestedStateCodes.some(state => !stateCodes.includes(state))) {
      res.status(400).send({ error: "Invalid state code(s) provided." });
      return;
    }

    // if at least one state provided is an Australian state,
    // and NAT has not already been requested, include NAT events in the response as well
    if (
      requestedStateCodes.some(state => ausStateCodes.includes(state)) 
      && !requestedStateCodes.includes("NAT")
    ) {
      requestedStateCodes.push("NAT");
    }

    requestedStateCodes.forEach(state => {
      if (req.query.hide !== "competitions") events = events.concat(cachedEvents[state].filter(event => event.eventType === "competition"));
      if (req.query.hide !== "workshops") events = events.concat(cachedEvents[state].filter(event => event.eventType === "workshop"));
    });

    const calendar = ical({
      domain: "rcja.app/calendar",
      name: `RoboCup Junior Australia: Calendar`,
      timezone: "Australia/Melbourne",
    });
    
    events.forEach((event) => {
      const eventDescription = `${event.name} (${event.realStateAbbr})`
                        + `\n\nEvent type: ${event.eventType.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase())}`
                        + `\n\nStart date: ${event.startDate}`
                        + `\nEnd date: ${event.endDate}`
                        + `\nRegistrations open: ${event.registrationsOpenDate}`
                        + `\nRegistrations close: ${event.registrationsCloseDate}`
                        + `\n\nDirect enquiries to: ${event.directEnquiriesTo.fullName} (${event.directEnquiriesTo.email})`
                        + `\nAvailable divisions: ${event.availabledivisions.map(division => division.name).join(", ")}`
                        + `\n\n${event.bleachedEventDetails}`
                        + `\n\n\n${event.registrationURL}`;

      calendar.createEvent({
        start: new Date(event.startDate),
        end: new Date(new Date(event.endDate).setDate(new Date(event.endDate).getDate() + 1)),
        summary: `${stateTitleMapping[event.realStateAbbr] || "RCJA"} ${event.name} (${event.realStateAbbr})`, 
        description: eventDescription,
        allDay: true,
        location: event.venue ? event.venue.name + ", " + event.venue.address : "",
        url: `https://enter.robocupjunior.org.au/events/${event.id}`,
      });
    });

    res.set("Content-Type", "text/calendar");
    res.set("Content-Disposition", 'attachment; filename="calendar.ics"');
    res.send(calendar.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/events/json", async (req, res) => {
  if (!cachedEvents) {
    res.status(503).send({ error: "Events cache is not yet populated, please try again shortly." });
    return;
  }
  try {
    let events = [];
    
    let stateCodes = Object.keys(cachedEvents);
    let requestedStateCodes = req.query.regions ? req.query.regions.split(",") : stateCodes;

    // make sure all requestedStateCodes match stateCodes
    if (requestedStateCodes.some(state => !stateCodes.includes(state))) {
      res.status(400).send({ error: "Invalid state code(s) provided." });
      return;
    }

    requestedStateCodes.forEach(state => {
      if (req.query.hide !== "competitions") events = events.concat(cachedEvents[state].filter(event => event.eventType === "competition"));
      if (req.query.hide !== "workshops") events = events.concat(cachedEvents[state].filter(event => event.eventType === "workshop"));
    });

    let eventsReturn = [];
    events.forEach(event => {
      const eventDescription = `${event.name} (${event.realStateAbbr})`
                        + `\n\nEvent type: ${event.eventType.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase())}`
                        + `\n\nStart date: ${event.startDate}`
                        + `\nEnd date: ${event.endDate}`
                        + `\nRegistrations open: ${event.registrationsOpenDate}`
                        + `\nRegistrations close: ${event.registrationsCloseDate}`
                        + `\n\nDirect enquiries to: ${event.directEnquiriesTo.fullName} (${event.directEnquiriesTo.email})`
                        + `\nAvailable divisions: ${event.availabledivisions.map(division => division.name).join(", ")}`
                        + `\n\n${event.bleachedEventDetails}`
                        + `\n\n\n${event.registrationURL}`;

      eventsReturn.push({
        id: event.id,
        title: `${event.name} (${event.realStateAbbr})`,
        registrationsOpenDate: event.registrationsOpenDate,
        registrationsCloseDate: event.registrationsCloseDate,
        startDate: event.startDate,
        endDate: event.endDate,
        start: new Date(event.startDate).toISOString(),
        end: new Date(new Date(event.endDate).setDate(new Date(event.endDate).getDate() + 1)).toISOString(),
        enquiries: `${event.directEnquiriesTo.fullName} (${event.directEnquiriesTo.email})`,
        availableDivisions: event.availabledivisions.map(division => division.name).join(", "),
        venue: event.venue ? event.venue.name + ", " + event.venue.address : "",
        state: event.realStateAbbr,
        eventType: event.eventType,
        registrationURL: event.registrationURL,
        bleachedEventDetails: event.bleachedEventDetails,
        allDay: true,
      });
    });

    res.send(eventsReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/regions", async (req, res) => {
  if (!cachedStates) {
    res.status(503).send({ error: "States cache is not yet populated, please try again shortly." });
    return;
  }
  try {
    res.send(cachedStates);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});


// Generic function to categorize events into sub-regions based on state config
function categorizeEvent(event, stateConfig) {
  const searchText = (
    event.name + " " + (event.venue ? event.venue.name + " " + event.venue.address : "")
  ).toLowerCase();

  for (const [key, region] of Object.entries(stateConfig.subRegions)) {
    if (region.keywords.some(kw => searchText.includes(kw.toLowerCase()))) {
      return key;
    }
  }
  // State / National events default to configured default region
  if (searchText.includes("state") || searchText.includes("national")) {
    return stateConfig.defaultRegion;
  }
  return null;
}

// Generic function to build regions for any state
function buildStateRegions(stateCode) {
  const config = stateConfigs[stateCode];
  if (!config || !config.enabled) return null;
  if (!cachedEvents || !cachedEvents[stateCode]) return null;

  const now = new Date();
  const result = {};

  // Initialize result object with all regions
  for (const [key, region] of Object.entries(config.subRegions)) {
    result[key] = { title: region.title, events: [] };
  }

  // Include state events and NAT (national) events
  const stateEvents = [...cachedEvents[stateCode], ...(cachedEvents["NAT"] || [])];

  stateEvents.forEach(event => {
    const startDate = new Date(event.startDate);
    if (startDate < now) return;

    const regionKey = categorizeEvent(event, config);
    if (!regionKey || !result[regionKey]) return;

    const isHighlight = event.name.toLowerCase().includes("state") || event.name.toLowerCase().includes("national");

    result[regionKey].events.push({
      date: startDate.toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
      name: event.name,
      desc: event.venue ? event.venue.name + ", " + event.venue.address : "TBC",
      highlight: isHighlight,
      registrationURL: event.registrationURL || "",
      startDate: event.startDate,
      endDate: event.endDate,
    });
  });

  // Sort events within each region by date
  for (const region of Object.values(result)) {
    region.events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  return result;
}

// Deprecated: kept for backwards compatibility
const qldSubRegions = stateConfigs["QLD"] ? stateConfigs["QLD"].subRegions : {};
function categorizeQldEvent(event) {
  return categorizeEvent(event, stateConfigs["QLD"]);
}
function buildQldRegions() {
  return buildStateRegions("QLD");
}

// Generic API endpoint for any state's regions
app.get("/api/:stateCode/regions", (req, res) => {
  const stateCode = req.params.stateCode.toUpperCase();
  
  if (!cachedEvents) {
    res.status(503).send({ error: "Events cache is not yet populated, please try again shortly." });
    return;
  }

  const config = stateConfigs[stateCode];
  if (!config || !config.enabled) {
    res.status(404).send({ error: `Regional page not available for state: ${stateCode}` });
    return;
  }

  try {
    const data = buildStateRegions(stateCode);
    if (!data) {
      res.status(503).send({ error: `${stateCode} events are not yet available, please try again shortly.` });
      return;
    }
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

// Get state configuration (metadata, region order, etc.)
app.get("/api/:stateCode/config", (req, res) => {
  const stateCode = req.params.stateCode.toUpperCase();
  const config = stateConfigs[stateCode];
  
  if (!config || !config.enabled) {
    res.status(404).send({ error: `Regional page not available for state: ${stateCode}` });
    return;
  }

  // Send config without keywords (don't expose internal logic to frontend)
  const publicConfig = {
    title: config.title,
    year: new Date().getFullYear().toString(),
    regionOrder: config.regionOrder,
    regionTitles: Object.fromEntries(
      Object.entries(config.subRegions).map(([key, region]) => [key, region.title])
    )
  };

  res.send(publicConfig);
});

// Generic page route for any state
app.get("/:stateCode", (req, res, next) => {
  const rawCode = req.params.stateCode;
  const stateCode = rawCode.toUpperCase();
  const config = stateConfigs[stateCode];
  
  // Check if it's a state code or another route
  if (config && config.enabled) {
    // Redirect to uppercase URL if the request used lowercase letters
    if (rawCode !== stateCode) {
      return res.redirect(301, `/${stateCode}`);
    }
    return res.sendFile(path.join(__dirname, "public/state.html"));
  }
  
  // Not a state route, continue to next handler
  next();
});

app.get("/sync", (req, res) => {
  res.sendFile(path.join(__dirname, "public/sync.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/calendar.html"));
});

if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

app.listen(process.env.HTTP_PORT, () => {
  console.log(`Calendar server listening on port ${process.env.HTTP_PORT}`);
});