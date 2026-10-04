/**
 * Single source of truth for all portfolio content, persona information,
 * project case studies, skills, and configuration values.
 */

export const PERSONA = {
  name: "Aaron Shasankar Bishwakarma",
  firstName: "Aaron",
  lastName: "Bishwakarma",
  role: "Software Developer",
  location: "Lalitpur, Nepal",
  timezone: "Asia/Kathmandu",
  timeZoneLabel: "NPT / UTC+5:45",
  email: "aaronshasankar@gmail.com",
  availability: "Booking from November",
  bioHeadline: "Making interactive 3D, motion and WebGL.",
  bioSubhead: "Creative developer building fast apps, beautiful interfaces and robust servers.",
  copyrightYear: 2026,
};

export const NAVIGATION_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const HERO_CONTENT = {
  tagline: "Remote",
  line1: "AARON",
  line2: "Bishwakarma",
  lead: "Creative developer building fast apps, beautiful interfaces and robust servers",
  primaryCta: { label: "Explore Work", href: "#work" },
  secondaryCta: { label: "Get in Touch", href: "#contact" },
  scrollCue: "Scroll to explore",
};

export const MARQUEE_ROWS = {
  row1: [
    { text: "WebGL", outlined: false },
    { text: "Shaders", outlined: true },
    { text: "Three.js", outlined: false },
    { text: "Motion", outlined: true },
    { text: "Creative Code", outlined: false },
    { text: "Interaction", outlined: true },
  ],
  row2: [
    { text: "Prototyping", outlined: true },
    { text: "Real-time", outlined: false },
    { text: "Sound", outlined: true },
    { text: "Performance", outlined: false },
    { text: "Interaction", outlined: true },
    { text: "GLSL", outlined: false },
  ],
};

export const WORK_PROJECTS = [
  {
    id: "tidepool",
    title: "Tidepool",
    subtitle: "Live ocean-data instrument",
    description:
      "A real-time oceanographic telemetry instrument visualizing tidal shifts, wave dispersion frequencies, and sea-surface thermal anomalies via custom GPGPU compute shaders.",
    tags: ["WebGL", "GLSL", "D3"],
    year: "2026",
    url: null, // Add the verified demo or case-study URL.
    linkText: "Launch Instrument",
    metrics: "60 FPS • 120k Wave Particles",
    accentColor: "#5CE1E6",
    artworkType: "rings", // Concentric pulsing wave rings
  },
  {
    id: "halcyon",
    title: "Halcyon",
    subtitle: "Audio-reactive album site",
    description:
      "A sensory interactive listening companion for electronic artist Halcyon. Translates frequency spectra and stem transients into generative real-time geometric landscapes.",
    tags: ["Web Audio", "Three.js", "React"],
    year: "2025",
    url: null, // Add the verified demo or case-study URL.
    linkText: "Enter Experience",
    metrics: "Spatial Audio • Real-time FFT",
    accentColor: "#FF5C8A",
    artworkType: "equalizer", // Animated audio-bar equalizer
  },
  {
    id: "orbit-atlas",
    title: "Orbit Atlas",
    subtitle: "9,000 satellites map",
    description:
      "An interactive orbital cartography system tracking over 9,000 low-earth and geostationary orbital bodies. Offloads Keplerian ephemeris propagations to Web Workers.",
    tags: ["Three.js", "Web Workers"],
    year: "2025",
    url: null, // Add the verified demo or case-study URL.
    linkText: "Explore Orbitals",
    metrics: "9,000+ Bodies • Zero Main-Thread Lag",
    accentColor: "#7B61FF",
    artworkType: "orbit", // 3D orbiting rings with glowing core
  },
  {
    id: "fieldnotes",
    title: "Fieldnotes",
    subtitle: "Motion system & design quarterly",
    description:
      "Comprehensive digital editorial design and interactive motion framework for a European architecture and spatial theory periodical, featuring frictionless page transitions.",
    tags: ["GSAP", "Next.js"],
    year: "2024",
    url: null, // Add the verified demo or case-study URL.
    linkText: "Read Publication",
    metrics: "Custom Inertia • Fluid Typography",
    accentColor: "#FFC857",
    artworkType: "sheets", // Floating stacked 3D sheets
  },
];

export const ABOUT_CONTENT = {
  sectionTag: "About / Philosophy",
  statement:
    "I am a Web Developer with a strong foundation in computer science and software engineering. I specialize in crafting modern web applications, building custom APIs, and solving technical problems with clean, maintainable code.",
  extendedBio:
    "Based in Lalitpur, Nepal, I build web applications, APIs, and interactive interfaces with an emphasis on maintainable code, accessibility, and performance.",
  stats: [
    {
      value: 60,
      suffix: "",
      unit: "fps",
      label: "Target fidelity",
      sublabel: "Frame-budget conscious architecture",
    },
  ],
};

export const SKILLS_LIST = [
  "WebGL",
  "GLSL shaders",
  "Three.js",
  "Motion design",
  "React",
  "Prototyping",
  "Performance",
  "Web Audio",
];

export const CONTACT_CONTENT = {
  headline: "Let's make something that moves.",
  subhead:
    "Available for select creative development engagements, interactive exhibitions, shader prototyping, and full-stack experiential web projects.",
  email: PERSONA.email,
  // Add only verified personal profile URLs.
  socials: [],
  locationName: PERSONA.location,
  officeTimezone: PERSONA.timezone,
};
