// Configuration for state regional pages
// Each state can define its own sub-regions with keywords for event categorization

const stateConfigs = {
  "QLD": {
    enabled: true,
    title: "RCJQ – Queensland Regional Calendar",
    subRegions: {
      "seq": { 
        title: "South East QLD", 
        keywords: ["brisbane", "redland", "gold coast", "sunshine coast", "ipswich", "logan", "moreton", "springfield", "ormiston"] 
      },
      "wide-bay": { 
        title: "Wide Bay & Central", 
        keywords: ["bundaberg", "gladstone", "rockhampton", "mackay", "hervey bay", "maryborough"] 
      },
      "downs": { 
        title: "Darling Downs", 
        keywords: ["darling downs", "toowoomba", "warwick", "stanthorpe"] 
      },
      "fnq": { 
        title: "Far North QLD", 
        keywords: ["cairns", "fnq", "townsville", "far north"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "seq", // Where uncategorized state events default to
    regionOrder: ["seq", "wide-bay", "downs", "fnq", "nationals"]
  },
  
  "VIC": {
    enabled: true,
    title: "RCJV – Victoria Regional Calendar",
    subRegions: {
      "metro": { 
        title: "Melbourne Metro", 
        keywords: ["melbourne", "metro", "city", "collingwood", "footscray", "richmond", "carlton"] 
      },
      "regional": { 
        title: "Regional Victoria", 
        keywords: ["geelong", "ballarat", "bendigo", "shepparton", "warrnambool", "gippsland"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "metro",
    regionOrder: ["metro", "regional", "nationals"]
  },

  "NSW": {
    enabled: true,
    title: "RCJNSW – New South Wales Regional Calendar",
    subRegions: {
      "sydney": { 
        title: "Greater Sydney", 
        keywords: ["sydney", "parramatta", "penrith", "liverpool", "campbelltown", "blacktown"] 
      },
      "hunter": { 
        title: "Hunter & Newcastle", 
        keywords: ["newcastle", "hunter", "maitland", "port stephens"] 
      },
      "illawarra": { 
        title: "Illawarra & South Coast", 
        keywords: ["wollongong", "illawarra", "shellharbour", "nowra", "south coast"] 
      },
      "regional": { 
        title: "Regional NSW", 
        keywords: ["dubbo", "wagga", "albury", "tamworth", "orange", "bathurst", "central west"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "sydney",
    regionOrder: ["sydney", "hunter", "illawarra", "regional", "nationals"]
  },

  "SA": {
    enabled: true,
    title: "RCJSA – South Australia Regional Calendar",
    subRegions: {
      "metro": { 
        title: "Adelaide Metro", 
        keywords: ["adelaide", "metro", "city", "port adelaide", "glenelg", "modbury"] 
      },
      "regional": { 
        title: "Regional SA", 
        keywords: ["regional", "mount gambier", "port lincoln", "whyalla", "murray bridge"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "metro",
    regionOrder: ["metro", "regional", "nationals"]
  },

  "WA": {
    enabled: true,
    title: "RCJWA – Western Australia Regional Calendar",
    subRegions: {
      "perth": { 
        title: "Perth Metro", 
        keywords: ["perth", "metro", "fremantle", "joondalup", "rockingham", "mandurah"] 
      },
      "regional": { 
        title: "Regional WA", 
        keywords: ["regional", "bunbury", "albany", "geraldton", "kalgoorlie", "broome"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "perth",
    regionOrder: ["perth", "regional", "nationals"]
  },

  "ACT": {
    enabled: true,
    title: "RCJACT – Australian Capital Territory Regional Calendar",
    subRegions: {
      "canberra": { 
        title: "Canberra & ACT", 
        keywords: ["canberra", "act", "belconnen", "tuggeranong", "woden", "gungahlin"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "canberra",
    regionOrder: ["canberra", "nationals"]
  },

  "NT": {
    enabled: true,
    title: "RCJNT – Northern Territory Regional Calendar",
    subRegions: {
      "darwin": { 
        title: "Darwin & NT", 
        keywords: ["darwin", "palmerston", "alice springs", "katherine", "northern territory"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "darwin",
    regionOrder: ["darwin", "nationals"]
  },

  "NZ": {
    enabled: true,
    title: "RCJNZ – New Zealand Regional Calendar",
    subRegions: {
      "north-island": { 
        title: "North Island", 
        keywords: ["auckland", "wellington", "hamilton", "tauranga", "palmerston north", "napier", "hastings", "rotorua", "whangarei"] 
      },
      "south-island": { 
        title: "South Island", 
        keywords: ["christchurch", "dunedin", "invercargill", "nelson", "queenstown", "timaru"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "north-island",
    regionOrder: ["north-island", "south-island", "nationals"]
  },

  "TAS": {
    enabled: true,
    title: "RCJTAS – Tasmania Regional Calendar",
    subRegions: {
      "hobart": { 
        title: "Hobart & South", 
        keywords: ["hobart", "kingston", "huonville", "sorell"] 
      },
      "regional": { 
        title: "Regional Tasmania", 
        keywords: ["launceston", "devonport", "burnie", "north", "northwest"] 
      },
      "nationals": { 
        title: "Nationals", 
        keywords: ["national", "nationals"] 
      },
    },
    defaultRegion: "hobart",
    regionOrder: ["hobart", "regional", "nationals"]
  },
};

module.exports = { stateConfigs };
