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
    },
    defaultRegion: "seq", // Where state/national events default to
    regionOrder: ["seq", "wide-bay", "downs", "fnq"]
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
    },
    defaultRegion: "metro",
    regionOrder: ["metro", "regional"]
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
    },
    defaultRegion: "sydney",
    regionOrder: ["sydney", "hunter", "illawarra", "regional"]
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
    },
    defaultRegion: "metro",
    regionOrder: ["metro", "regional"]
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
    },
    defaultRegion: "perth",
    regionOrder: ["perth", "regional"]
  },
};

module.exports = { stateConfigs };
