export type CaseStudyStatus = "draft" | "published";

export interface CaseStudyMetric {
  label: string;
  value: string;
  description?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  sector: string;
  location: string;
  client: string;
  status: CaseStudyStatus;
  challenge: string;
  approach: string;
  implementation: string;
  outcome: string;
  metrics: CaseStudyMetric[];
  publishedAt: string | null;
  updatedAt: string;
  featuredImage?: string;
}

export const mockCaseStudies: CaseStudy[] = [
  {
    id: "cs-01",
    title: "Panchavati Hospitality Operations Review",
    slug: "panchavati-hospitality-operations-review",
    shortDescription: "A comprehensive operational diagnostic and restructuring of F&B divisions and guest service protocols across a multi-property hotel brand in Maharashtra.",
    sector: "Hotel Operations",
    location: "Maharashtra",
    client: "Panchavati Hospitality Group",
    status: "published",
    challenge: "The properties were facing stagnant average daily rates (ADR) and rising food cost percentages (COGS reached 38% in F&B). Guest experience ratings had dropped due to inconsistencies in service response times and lack of defined operational protocols across their primary banquet facilities.",
    approach: "THEDCO conducted a complete diagnostic audit of F&B logistics, kitchen production schedules, and front-of-house service structures. We formulated a standard operating procedure (SOP) manual and introduced centralized procurement frameworks.",
    implementation: "Working closely with property general managers, we completed a 4-week staff cross-training program, integrated automated inventory logging, and rescheduled kitchen prep hours based on occupancy cycle trends.",
    outcome: "Successfully lowered F&B cost of goods sold and raised banquet yield, improving overall customer satisfaction index score from 3.4 to 4.7 stars.",
    metrics: [
      { label: "F&B COGS Reduction", value: "-6.5%", description: "Centralized buying impact" },
      { label: "Guest Satisfaction", value: "+38%", description: "Audited rating improvement" },
      { label: "GOPPAR Growth", value: "+14.2%", description: "Within 6 months of rollout" },
    ],
    publishedAt: "22 Aug 2026",
    updatedAt: "22 Aug 2026",
  },
  {
    id: "cs-02",
    title: "Restaurant Turnaround Programme",
    slug: "restaurant-turnaround-programme",
    shortDescription: "Diagnostic restructure of menu pricing, kitchen scheduling, and local marketing strategies for a declining fine-dining venue in Nashik.",
    sector: "Restaurant",
    location: "Nashik",
    client: "The Grapevine Kitchen",
    status: "published",
    challenge: "High overhead costs and declining covers on weekdays were threatening the restaurant's solvency. Prime costs (COGS + labor) had escalated to 68% of total revenue, and the venue suffered from high kitchen staff turnover.",
    approach: "THEDCO designed a turnaround plan focusing on menu engineering, hourly labor optimization, and targeted localized digital campaigns.",
    implementation: "We reduced menu items by 30% to streamline inventory, introduced flexible shift schedules based on hourly covers data, and trained servers on high-margin upselling.",
    outcome: "Significantly decreased food waste and stabilized prime costs below 55%, returning the venue to monthly operational profitability.",
    metrics: [
      { label: "Prime Cost reduction", value: "-13%", description: "Optimized labor and inventory" },
      { label: "Weekday Covers", value: "+22%", description: "Impact of local promo campaign" },
      { label: "Food Waste Reduction", value: "-25%", description: "Menu consolidation effect" },
    ],
    publishedAt: "18 Aug 2026",
    updatedAt: "19 Aug 2026",
  },
  {
    id: "cs-03",
    title: "Emerging Resort Development Strategy",
    slug: "emerging-resort-development-strategy",
    shortDescription: "Feasibility blueprint and operator selection coordination for a new 120-key luxury wellness eco-resort property.",
    sector: "Resort",
    location: "Maharashtra",
    client: "Vanya Resorts & Spas",
    status: "published",
    challenge: "The developers owned a prime 15-acre land parcel but lacked market positioning data and financial forecasts needed to secure operator interest and bank construction funding.",
    approach: "THEDCO performed a detailed market feasibility study, defined the product concept (luxury wellness eco-resort), created a 10-year pro-forma financial model, and organized operator selection pitch decks.",
    implementation: "We drafted the Request for Proposal (RFP) documentation, coordinated bid meetings with four international resort brands, and assisted the client in head-contract negotiations.",
    outcome: "Secured a favorable management contract with a top-tier global hospitality operator and finalized the bank funding agreement.",
    metrics: [
      { label: "Project IRR", value: "21.4%", description: "Estimated in 10-year pro-forma" },
      { label: "Operator Bids", value: "04", description: "Global resort brands pitched" },
      { label: "ADR Projections", value: "+30%", description: "Repositioning premium estimate" },
    ],
    publishedAt: "12 Aug 2026",
    updatedAt: "12 Aug 2026",
  },
  {
    id: "cs-04",
    title: "Highway Hospitality Business Review",
    slug: "highway-hospitality-business-review",
    shortDescription: "Standardization checklist and branding audit for a chain of highway food court complexes.",
    sector: "Highway Hospitality",
    location: "Maharashtra",
    client: "Highway Stops India",
    status: "draft",
    challenge: "Inconsistent service standards, high fuel cost supply chains, and poor brand recall were holding back franchise expansion goals across major expressways.",
    approach: "THEDCO conducted an F&B supply chain audit and developed a standard operational blueprint for franchise expansion.",
    implementation: "We optimized regional warehouse distribution routes and established a mobile mystery-auditor system for properties.",
    outcome: "Standardized food court layouts and paved the way for successful signings of three new highway franchise locations.",
    metrics: [
      { label: "Supply Chain Costs", value: "-9.2%", description: "Optimized logistics routes" },
      { label: "Service Speed", value: "+18%", description: "Mystery auditor impact" },
    ],
    publishedAt: null,
    updatedAt: "21 Aug 2026",
  },
  {
    id: "cs-05",
    title: "Boutique Hotel Brand Strategy",
    slug: "boutique-hotel-brand-strategy",
    shortDescription: "Repositioning and launch narrative for a heritage palace hotel property.",
    sector: "Boutique Hotel",
    location: "India",
    client: "Mandawa Heritage Hotels",
    status: "published",
    challenge: "The property suffered from low offseason occupancies (under 20%) and was overly reliant on low-margin third-party online travel agency packages.",
    approach: "THEDCO designed a comprehensive heritage-brand repositioning strategy, centered around private wellness retreats and bespoke local experience packages.",
    implementation: "We redesigned room pricing structures, launched direct-booking campaigns, and trained staff in cultural guest experiences.",
    outcome: "Offseason occupancy rose to 45% and average daily rate increased by 28% through high-value direct bookings.",
    metrics: [
      { label: "ADR Growth", value: "+28%", description: "Direct reservation bookings" },
      { label: "Offseason Occupancy", value: "+25%", description: "Wellness packages contribution" },
      { label: "OTA Commission Savings", value: "-15%", description: "Direct booking channel shift" },
    ],
    publishedAt: "05 Aug 2026",
    updatedAt: "06 Aug 2026",
  },
  {
    id: "cs-06",
    title: "Restaurant Cost Control & Menu Engineering",
    slug: "restaurant-cost-control-menu-engineering",
    shortDescription: "Menu engineering audit and waste reduction systems implementation.",
    sector: "Restaurant",
    location: "Maharashtra",
    client: "Olive Bistro Chain",
    status: "published",
    challenge: "Rising raw ingredient inflation was putting pressure on menu pricing. The bistro was struggling to maintain consistent profit margins across its four locations.",
    approach: "THEDCO executed a recipe costing audit and classified menu items using the Star/Plowhorse matrix to engineer a high-margin menu.",
    implementation: "We consolidated similar ingredients, adjusted recipe portion sizes, and updated menu card layouts.",
    outcome: "Reduced overall food costs by 5.2% without affecting guest satisfaction or portions.",
    metrics: [
      { label: "Food Costs COGS", value: "-5.2%", description: "Recipe costing adjustments" },
      { label: "Menu Profitability", value: "+8.4%", description: "Star items focus placement" },
    ],
    publishedAt: "01 Aug 2026",
    updatedAt: "01 Aug 2026",
  },
  {
    id: "cs-07",
    title: "New Hospitality Venture Advisory",
    slug: "new-hospitality-venture-advisory",
    shortDescription: "Commercial validation and development analysis for a premium luxury tent resort startup.",
    sector: "Hospitality Investment",
    location: "India",
    client: "Sands & Stars Resorts",
    status: "published",
    challenge: "The venture startup required commercial validation of a luxury glamping resort concept to raise seed equity from private hospitality investment funds.",
    approach: "THEDCO developed a business plan, performed a competitor analysis, and modeled financial projections.",
    implementation: "We coordinated the investor pitch decks and presented findings directly to the investment advisory board.",
    outcome: "Venture successfully raised seed equity, validating the luxury glamping financial model.",
    metrics: [
      { label: "Capital Raised", value: "₹45M", description: "Private hospitality fund equity" },
      { label: "Equity Closing Time", value: "90 Days", description: "Advisory-led pitch turnaround" },
    ],
    publishedAt: "28 Jul 2026",
    updatedAt: "28 Jul 2026",
  },
  {
    id: "cs-08",
    title: "Café Growth & Operational Improvement",
    slug: "cafe-growth-operational-improvement",
    shortDescription: "Franchising blueprints and operational diagnostic review for a specialty coffee roasters chain.",
    sector: "Café / QSR",
    location: "India",
    client: "Roasters Specialty Coffee",
    status: "draft",
    challenge: "Hiring inconsistencies, long service times during morning peak hours, and product wastage were blocking franchisee expansion goals.",
    approach: "THEDCO mapped counter service flows, optimized barista stations, and created standardization manuals.",
    implementation: "We rolled out barista cross-training and introduced daily waste logs across all retail venues.",
    outcome: "Decreased ticket times during peak morning rushes and standardized operations ready for franchise expansion.",
    metrics: [
      { label: "Service Ticket Times", value: "-45s", description: "Optimized counter workflows" },
      { label: "Barista Training Index", value: "+30%", description: "Cross-training manual impact" },
    ],
    publishedAt: null,
    updatedAt: "25 Jul 2026",
  },
];
