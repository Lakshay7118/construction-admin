export type ProjectType = "Residential" | "Commercial" | "Industrial" | "Infrastructure";
export type ProjectStatus = "completed" | "ongoing";

export interface City {
  slug: string;
  name: string;
  state: string;
  coverImage: string;
  description: string;
  totalSqft: number; // in lakh sq.ft, for the "quick stats" hover
}

export interface TimelineEntry {
  phase: string;
  date: string;
  description: string;
}

export interface Project {
  slug: string;
  citySlug: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  heroImage: string;
  description: string;
  scopeOfWork: string;
  materials: string[];
  sqft: number;
  units?: number;
  client: string;
  year: string;
  gallery: { url: string; caption: string }[];
  beforeAfter?: { beforeUrl: string; afterUrl: string; label: string }[];
  timeline: TimelineEntry[];
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capabilities: string[];
  image: string;
}

export interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  author: string;
  date: string;
  category: string;
}

export interface Testimonial {
  name: string;
  role: string;
  message: string;
  rating: number;
}

export interface CareerPost {
  slug: string;
  title: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
}

export interface Award {
  year: string;
  title: string;
  issuer: string;
}

export const cities: City[] = [
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    coverImage:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop",
    description:
      "Our largest active market — high-rise residential towers and Grade-A commercial parks across the capital region.",
    totalSqft: 42,
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    coverImage:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1600&auto=format&fit=crop",
    description:
      "Coastal high-rises and mixed-use developments engineered for density, salinity and seismic load.",
    totalSqft: 58,
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    coverImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
    description:
      "IT-corridor campuses and township-scale residential communities in the Pune metropolitan belt.",
    totalSqft: 31,
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    coverImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop",
    description:
      "Heritage-sensitive commercial builds using local stone alongside modern structural cores.",
    totalSqft: 18,
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    coverImage:
      "https://images.unsplash.com/photo-1622015663084-307d19eabbbf?q=80&w=1600&auto=format&fit=crop",
    description:
      "Industrial parks and logistics infrastructure serving Gujarat's manufacturing corridor.",
    totalSqft: 26,
  },
];

export const projects: Project[] = [
  {
    slug: "skyline-towers",
    citySlug: "mumbai",
    title: "Skyline Towers",
    type: "Residential",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
    description:
      "A 38-storey twin-tower residential development on reclaimed coastal land, built to withstand seismic zone III loads and monsoon-grade waterproofing standards.",
    scopeOfWork:
      "Full turnkey delivery: piling and deep foundation, RCC superstructure, MEP, facade glazing, and landscaped podium.",
    materials: ["M60 grade concrete", "High-tensile rebar", "Double-glazed curtain wall", "Waterproof membrane system"],
    sqft: 620000,
    units: 412,
    client: "Confidential — private developer",
    year: "2024",
    gallery: [
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop", caption: "Twin-tower facade, west elevation" },
      { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop", caption: "Podium-level landscaped courtyard" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop", caption: "Lobby interior, ground floor" },
      { url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1200&auto=format&fit=crop", caption: "Typical floor plate during fit-out" },
    ],
    beforeAfter: [
      {
        beforeUrl: "https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=1200&auto=format&fit=crop",
        afterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        label: "Site clearance to completed facade",
      },
    ],
    timeline: [
      { phase: "Site mobilization & piling", date: "Jan 2021", description: "Deep foundation work and soil stabilization on reclaimed land." },
      { phase: "Superstructure", date: "Mar 2022", description: "RCC frame completed to 38th floor." },
      { phase: "Facade & MEP", date: "Aug 2023", description: "Curtain wall installation and services fit-out." },
      { phase: "Handover", date: "Feb 2024", description: "OC received, units handed over to owners." },
    ],
  },
  {
    slug: "harborview-residency",
    citySlug: "mumbai",
    title: "Harborview Residency",
    type: "Residential",
    status: "ongoing",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    description:
      "A mid-rise premium residency overlooking the harbor, currently in facade and interior fit-out stage.",
    scopeOfWork: "Structure, facade, and interior fit-out with premium sanitaryware and modular kitchens.",
    materials: ["Precast facade panels", "Vitrified tiling", "Aluminium composite panelling"],
    sqft: 210000,
    units: 168,
    client: "Confidential — private developer",
    year: "2025 (ongoing)",
    gallery: [
      { url: "https://images.unsplash.com/photo-1590725175106-59d1ce633abc?q=80&w=1200&auto=format&fit=crop", caption: "Structure at 22nd floor" },
      { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop", caption: "Facade panel installation" },
    ],
    timeline: [
      { phase: "Foundation", date: "Jun 2023", description: "Raft foundation completed." },
      { phase: "Structure", date: "Ongoing", description: "RCC frame at 22 of 30 floors." },
    ],
  },
  {
    slug: "capital-business-park",
    citySlug: "delhi",
    title: "Capital Business Park",
    type: "Commercial",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    description:
      "A Grade-A commercial park with 1.2 million sq. ft. of leasable office space across four towers, LEED Gold certified.",
    scopeOfWork: "Design-build delivery including structure, facade, central AC plant, and IBMS integration.",
    materials: ["Structural steel core", "Low-E glazing", "Raised access flooring"],
    sqft: 1200000,
    client: "National REIT",
    year: "2023",
    gallery: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", caption: "Tower atrium" },
      { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop", caption: "Central plaza, evening" },
      { url: "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=1200&auto=format&fit=crop", caption: "Office floor plate, unfurnished" },
    ],
    timeline: [
      { phase: "Enabling works", date: "Feb 2020", description: "Site clearance and shoring." },
      { phase: "Structure", date: "Nov 2021", description: "All four towers topped out." },
      { phase: "LEED certification", date: "Jul 2023", description: "LEED Gold awarded post-handover audit." },
    ],
  },
  {
    slug: "site-a-transit-hub",
    citySlug: "delhi",
    title: "Site A — Transit Interchange",
    type: "Infrastructure",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop",
    description:
      "A multi-modal transit interchange integrating metro, bus rapid transit, and pedestrian skywalks.",
    scopeOfWork: "Civil structure, skywalk fabrication, and passenger amenity fit-out.",
    materials: ["Post-tensioned concrete deck", "Weathering steel skywalk", "Anti-skid paving"],
    sqft: 340000,
    client: "State Transit Authority",
    year: "2022",
    gallery: [
      { url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop", caption: "Skywalk connecting platforms" },
    ],
    timeline: [
      { phase: "Foundation & piers", date: "Sep 2019", description: "Deep pile foundations for elevated deck." },
      { phase: "Deck & skywalk", date: "Dec 2021", description: "Post-tensioned deck and skywalk fabrication." },
      { phase: "Commissioning", date: "May 2022", description: "Handed over to transit authority." },
    ],
  },
  {
    slug: "site-b-residential-enclave",
    citySlug: "delhi",
    title: "Site B — Residential Enclave",
    type: "Residential",
    status: "ongoing",
    heroImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    description: "A gated low-rise enclave of 96 villas currently at structure stage.",
    scopeOfWork: "Full turnkey villa construction with common landscaped amenities.",
    materials: ["AAC blocks", "RCC frame", "Terracotta roof tiling"],
    sqft: 145000,
    units: 96,
    client: "Confidential — private developer",
    year: "2025 (ongoing)",
    gallery: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop", caption: "Villa cluster under construction" },
    ],
    timeline: [{ phase: "Structure", date: "Ongoing", description: "62 of 96 villas at roof-slab stage." }],
  },
  {
    slug: "site-c-institutional-campus",
    citySlug: "delhi",
    title: "Site C — Institutional Campus",
    type: "Commercial",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
    description: "An educational institution campus spanning academic blocks, hostels, and a central library.",
    scopeOfWork: "Campus masterplanning execution, academic block construction, and landscaping.",
    materials: ["Exposed brick facade", "RCC frame", "Skylight roofing"],
    sqft: 280000,
    client: "Private educational trust",
    year: "2021",
    gallery: [
      { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop", caption: "Central library block" },
    ],
    timeline: [{ phase: "Handover", date: "Aug 2021", description: "Campus handed over ahead of academic year." }],
  },
  {
    slug: "riverside-it-campus",
    citySlug: "pune",
    title: "Riverside IT Campus",
    type: "Commercial",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    description: "A riverside IT park with three office blocks and a central amphitheater for 8,000 seats.",
    scopeOfWork: "Structure, facade, landscaping, and STP/ETP infrastructure.",
    materials: ["Structural glazing", "Precast columns", "Solar-ready roofing"],
    sqft: 540000,
    client: "IT Park Developer Consortium",
    year: "2023",
    gallery: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", caption: "Amphitheater plaza" },
    ],
    timeline: [{ phase: "Handover", date: "Mar 2023", description: "All three blocks delivered on schedule." }],
  },
  {
    slug: "heritage-square",
    citySlug: "jaipur",
    title: "Heritage Square",
    type: "Commercial",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop",
    description:
      "A retail and hospitality development finished in local Dholpur stone, sensitive to the surrounding heritage district.",
    scopeOfWork: "Structure and stone facade cladding, working within municipal heritage-zone guidelines.",
    materials: ["Dholpur sandstone cladding", "RCC frame", "Traditional jaali screening"],
    sqft: 95000,
    client: "Municipal redevelopment board",
    year: "2022",
    gallery: [
      { url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop", caption: "Stone facade with jaali screens" },
    ],
    timeline: [{ phase: "Handover", date: "Oct 2022", description: "Approved by heritage conservation committee." }],
  },
  {
    slug: "gujarat-logistics-park",
    citySlug: "ahmedabad",
    title: "Gujarat Logistics Park",
    type: "Industrial",
    status: "completed",
    heroImage:
      "https://images.unsplash.com/photo-1615472695660-828ec2c00c6a?q=80&w=1600&auto=format&fit=crop",
    description: "A 900,000 sq. ft. warehousing and logistics park with dedicated heavy-vehicle access roads.",
    scopeOfWork: "Pre-engineered building structures, dock leveling systems, and internal road network.",
    materials: ["Pre-engineered steel structure", "PU-coated roofing", "Reinforced dock aprons"],
    sqft: 900000,
    client: "Logistics REIT",
    year: "2024",
    gallery: [
      { url: "https://images.unsplash.com/photo-1615472695660-828ec2c00c6a?q=80&w=1200&auto=format&fit=crop", caption: "Warehouse block exterior" },
    ],
    timeline: [{ phase: "Handover", date: "Jan 2024", description: "First phase of three delivered." }],
  },
];

export const services: Service[] = [
  {
    slug: "residential",
    name: "Residential",
    tagline: "Towers, enclaves, and villas built for the long term.",
    description:
      "From high-rise coastal towers to gated villa enclaves, our residential practice covers full turnkey delivery — foundation to handover — with a focus on structural longevity and livability.",
    capabilities: ["High-rise towers", "Gated villa communities", "Redevelopment & retrofits", "Amenity & landscape design execution"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "commercial",
    name: "Commercial",
    tagline: "Grade-A office parks and retail built for tenants and investors.",
    description:
      "We deliver LEED-ready commercial developments — office parks, retail, and institutional campuses — engineered for long-term asset value and tenant experience.",
    capabilities: ["Grade-A office parks", "Retail & hospitality", "Institutional campuses", "LEED / green-building certification support"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "industrial",
    name: "Industrial",
    tagline: "Warehousing and manufacturing infrastructure at scale.",
    description:
      "Pre-engineered and conventional industrial structures — warehousing, logistics parks, and manufacturing facilities — built to operational timelines that manufacturing clients can't move.",
    capabilities: ["Warehousing & logistics parks", "Manufacturing facilities", "Pre-engineered steel structures", "Heavy-load flooring & dock systems"],
    image: "https://images.unsplash.com/photo-1615472695660-828ec2c00c6a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "infrastructure",
    name: "Infrastructure",
    tagline: "Public infrastructure built to civic timelines and civic scrutiny.",
    description:
      "Transit interchanges, skywalks, and civic infrastructure delivered in partnership with municipal and state transit authorities.",
    capabilities: ["Transit interchanges & skywalks", "Civic & public works", "Bridges & elevated decks", "Public-private partnership delivery"],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Rohan Malhotra",
    role: "Homeowner, Skyline Towers",
    message:
      "What stood out was the transparency — we could see the construction timeline and materials at every stage before we moved in.",
    rating: 5,
  },
  {
    name: "Ar. Neha Kulkarni",
    role: "Principal Architect, Kulkarni & Associates",
    message:
      "Their site documentation is unusually thorough for a contractor. Made collaboration on the facade detailing straightforward.",
    rating: 5,
  },
  {
    name: "Vikram Singhania",
    role: "Director, National REIT",
    message:
      "Delivered Capital Business Park on schedule with LEED Gold intact. That combination is rarer than it should be.",
    rating: 4,
  },
];

export const awards: Award[] = [
  { year: "2024", title: "Best Residential Development — Mumbai", issuer: "CREDAI Real Estate Awards" },
  { year: "2023", title: "LEED Gold Certification — Capital Business Park", issuer: "US Green Building Council" },
  { year: "2022", title: "Excellence in Heritage-Sensitive Construction", issuer: "Rajasthan Urban Development Authority" },
  { year: "2021", title: "Safety Excellence Award", issuer: "National Safety Council of India" },
];

export const blogs: Blog[] = [
  {
    slug: "reading-a-construction-timeline",
    title: "How to Read a Construction Timeline Before You Buy",
    excerpt: "A short guide to the phases every serious construction project should document — and the red flags when they don't.",
    coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    author: "Editorial Team",
    date: "2026-05-12",
    category: "Buyer Guide",
    content: [
      "Most buyers only see a construction project at two points: the brochure stage and the handover. Everything in between is a black box — which is exactly where delays and quality shortcuts tend to hide.",
      "A transparent developer will document at minimum four stages: foundation and site mobilization, structural framing, facade and MEP fit-out, and final handover with occupancy certification. Ask to see dated photographs at each stage, not just renders.",
      "Materials matter as much as milestones. Grade of concrete, type of rebar, and waterproofing systems used should be disclosed, not just implied by marketing language like 'premium quality.'",
    ],
  },
  {
    slug: "why-city-context-changes-structural-design",
    title: "Why the Same Building Looks Different in Mumbai and Jaipur",
    excerpt: "Soil, seismic zoning, and heritage regulation quietly shape every structural decision long before the facade is chosen.",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    author: "Editorial Team",
    date: "2026-04-02",
    category: "Engineering",
    content: [
      "A tower in coastal Mumbai and one in landlocked Jaipur may look superficially similar, but the engineering underneath answers to entirely different constraints.",
      "Coastal sites demand higher-grade waterproofing and corrosion-resistant rebar due to salinity, along with seismic zone III detailing. Heritage districts like parts of Jaipur instead impose material and height restrictions that shape the facade before a single structural calculation is made.",
      "Understanding local context isn't a compliance exercise — it's what determines whether a building is still standing cleanly in thirty years.",
    ],
  },
  {
    slug: "life-of-a-pre-engineered-warehouse",
    title: "Inside the Build: A Pre-Engineered Warehouse, Start to Finish",
    excerpt: "From steel fabrication to dock-leveler commissioning — what actually happens on an industrial site.",
    coverImage: "https://images.unsplash.com/photo-1615472695660-828ec2c00c6a?q=80&w=1200&auto=format&fit=crop",
    author: "Editorial Team",
    date: "2026-02-18",
    category: "Industrial",
    content: [
      "Pre-engineered steel buildings move faster than conventional RCC structures, but the sequencing still matters — foundation bolts are set to fabrication-drawing tolerances well before steel arrives on site.",
      "Once the primary frame is erected, roofing and cladding follow, then internal works: reinforced dock aprons, dock levelers, and fire-rated compartmentation. This is where most warehouse timelines slip if drawings and fabrication weren't coordinated early.",
      "A well-run industrial handover includes load testing of flooring and dock systems, not just a visual walkthrough.",
    ],
  },
];

export const careers: CareerPost[] = [
  {
    slug: "senior-site-engineer-mumbai",
    title: "Senior Site Engineer",
    location: "Mumbai",
    type: "Full-time",
    description: "Lead on-site execution for high-rise residential projects, coordinating with structural consultants and subcontractors.",
    responsibilities: [
      "Supervise day-to-day site execution against approved drawings",
      "Coordinate with structural and MEP consultants",
      "Maintain quality and safety compliance records",
    ],
  },
  {
    slug: "project-manager-delhi",
    title: "Project Manager",
    location: "Delhi NCR",
    type: "Full-time",
    description: "Own project delivery timelines and budgets across commercial and infrastructure sites.",
    responsibilities: [
      "Manage multi-site delivery schedules and budgets",
      "Report progress to leadership and client stakeholders",
      "Resolve on-site delays and resourcing conflicts",
    ],
  },
  {
    slug: "quantity-surveyor-pune",
    title: "Quantity Surveyor",
    location: "Pune",
    type: "Full-time",
    description: "Prepare and monitor cost estimates, BOQs, and material reconciliation for ongoing commercial projects.",
    responsibilities: [
      "Prepare bills of quantities and cost estimates",
      "Track material procurement against budget",
      "Support contract administration and vendor billing",
    ],
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function getProjectsByCity(citySlug: string) {
  return projects.filter((p) => p.citySlug === citySlug);
}

export function getProject(citySlug: string, projectSlug: string) {
  return projects.find((p) => p.citySlug === citySlug && p.slug === projectSlug);
}

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getBlog(slug: string) {
  return blogs.find((b) => b.slug === slug);
}

export function getCareer(slug: string) {
  return careers.find((c) => c.slug === slug);
}
