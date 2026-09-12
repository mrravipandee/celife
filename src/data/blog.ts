export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string;
  content: string;
  featuredImage?: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: "blog-01",
    title: "Hospitality Trends Shaping India's Emerging Markets",
    slug: "hospitality-trends-shaping-indias-emerging-markets",
    excerpt: "An in-depth analysis of structural shifts in guest expectations, tourism corridors, and hotel asset developments within Tier-2 and Tier-3 Indian cities in 2026.",
    category: "Hospitality",
    author: "Manav Chandak",
    status: "published",
    publishedAt: "22 Aug 2026",
    updatedAt: "22 Aug 2026",
    content: "The landscape of Indian hospitality is undergoing a seismic migration. While Tier-1 metropolitan hubs continue to display robust average daily rates (ADR) and occupancies, the real growth vectors have shifted towards Tier-2 and Tier-3 markets. Driven by infrastructure connectivity, rising middle-class disposable income, and corporate decentralization, cities like Jaipur, Nagpur, Indore, and Coimbatore are observing double-digit increases in hotel brand signings.\n\nDeveloping assets in these emerging markets, however, requires a distinct advisory playbook. Feasibility analysis must account for local seasonality, local corporate contracts, and banquet-heavy revenue distributions. In this article, we outline the primary commercial factors advisory boards must analyze before signing operator agreements in regional Indian markets.",
  },
  {
    id: "blog-02",
    title: "How Hotels Can Improve Operational Profitability",
    slug: "how-hotels-can-improve-operational-profitability",
    excerpt: "Practical operations strategies targeting GOPPAR improvement through technology integrations, energy conservation audits, and staff cross-training models.",
    category: "Operations",
    author: "Manav Chandak",
    status: "published",
    publishedAt: "18 Aug 2026",
    updatedAt: "19 Aug 2026",
    content: "In an era of rising inflation, hotel operators are facing tightening profit margins despite record-high occupancies. Improving Gross Operating Profit Per Available Room (GOPPAR) demands an uncompromising focus on operational efficiency.\n\nKey areas of optimization include:\n1. Tech integrations for automated check-in and check-out to streamline front-desk labor cost.\n2. Preventive maintenance and energy management sensors to lower mechanical, electrical, and plumbing (MEP) expenditures.\n3. Smart cross-training where food & F&B servers are trained in banqueting layouts, increasing labor elasticity during high-occupancy cycles.",
  },
  {
    id: "blog-03",
    title: "The Importance of Cost Control in Restaurants",
    slug: "importance-of-cost-control-in-restaurants",
    excerpt: "Menu engineering hacks, waste tracking routines, and raw material supply chain audits that can save up to 4-6% in prime cost for fine dining venues.",
    category: "Restaurant",
    author: "Ankit Sharma",
    status: "draft",
    publishedAt: null,
    updatedAt: "21 Aug 2026",
    content: "Cost control is the absolute baseline of restaurant survival. Prime cost—which combines Cost of Goods Sold (COGS) and labor cost—should ideally remain below 60% of total sales. Yet, many owners struggle to map where their raw materials vanish.\n\nWe recommend implementing automated ingredient weight logging, daily yield tracking of high-value proteins, and strict menu engineering audits where underperforming items are systematically priced up or removed.",
  },
  {
    id: "blog-04",
    title: "Building a Strong Hospitality Brand",
    slug: "building-a-strong-hospitality-brand",
    excerpt: " Repositioning heritage assets and boutique hotels to establish visual credibility, charge premium occupancy rates, and secure brand loyalty.",
    category: "Marketing",
    author: "Vikram Malhotra",
    status: "published",
    publishedAt: "15 Aug 2026",
    updatedAt: "15 Aug 2026",
    content: "Repositioning historical estates or boutique concepts into high-yielding luxury assets depends on a singular, unified brand narrative. Hospitality assets are not merely spaces; they are curated experiences.\n\nRepositioning involves designing a cohesive sensory profile, configuring unique guest rituals (such as cultural tea programs or legacy tours), and marketing distinct narratives across global luxury networks rather than depending purely on generic OTAs.",
  },
  {
    id: "blog-05",
    title: "From Concept to Opening: A Hospitality Roadmap",
    slug: "concept-to-opening-hospitality-roadmap",
    excerpt: "A structured advisory blueprint outlining pre-opening operations checklist, project management milestones, and operational simulation tests.",
    category: "Hospitality",
    author: "Manav Chandak",
    status: "published",
    publishedAt: "12 Aug 2026",
    updatedAt: "12 Aug 2026",
    content: "Opening a hotel asset requires managing thousands of dependencies across construction, engineering, licenses, staffing, and pre-opening marketing. Without a strict timeline playbook, launch delays can drain capital reserves quickly.\n\nOur advisory roadmap segments the pre-opening timeline into four distinct phases: Market Feasibility, Construction Coordination, Operational Readiness (hiring and simulator guest testing), and Soft/Grand Launches.",
  },
  {
    id: "blog-06",
    title: "Why Guest Experience Drives Long-Term Revenue",
    slug: "why-guest-experience-drives-long-term-revenue",
    excerpt: "Understanding guest sentiment indices, repeat visit metrics, and high-end service standards that reduce marketing costs.",
    category: "Operations",
    author: "Vikram Malhotra",
    status: "published",
    publishedAt: "08 Aug 2026",
    updatedAt: "08 Aug 2026",
    content: "Customer acquisition costs in hospitality are at an all-time high. Generating long-term asset value relies on repeat business, which is fueled entirely by customized guest experiences.\n\nAdvisory audits of guest experience touchpoints show that small operational upgrades—such as personalized pre-arrival coordination, high-end in-room amenities, and proactive service recovery—have an exponential impact on positive Tripadvisor reviews and direct website bookings.",
  },
  {
    id: "blog-07",
    title: "Restaurant Turnaround: Where Owners Should Start",
    slug: "restaurant-turnaround-where-owners-should-start",
    excerpt: "A diagnostic outline mapping food waste, labor schedules, guest reviews, and local marketing strategies for struggling venues.",
    category: "Restaurant",
    author: "Ankit Sharma",
    status: "draft",
    publishedAt: null,
    updatedAt: "05 Aug 2026",
    content: "When restaurant performance begins to slip, owners often panic and change the menu or run steep discounts. This rarely works. A turnaround requires a cold, data-driven diagnostic.\n\nWe start by auditing the kitchen yield, optimizing labor schedules against hourly sales data, analyzing negative guest reviews for common kitchen/service failure points, and focusing marketing efforts exclusively within a 3-kilometer radius of the venue.",
  },
  {
    id: "blog-08",
    title: "Hospitality Opportunities Beyond Metro Cities",
    slug: "hospitality-opportunities-beyond-metro-cities",
    excerpt: "Evaluating greenfield resort developments and luxury wellness retreats in leisure destinations and historical corridors.",
    category: "Resort",
    author: "Manav Chandak",
    status: "published",
    publishedAt: "01 Aug 2026",
    updatedAt: "01 Aug 2026",
    content: "Leisure travel is the fastest-growing sector of Indian tourism. Urban residents are seeking destination retreats, mountain lodges, and wellness spas away from crowded cities.\n\nThis trend creates unique opportunities for greenfield developers. The capital cost of land is substantially lower, permitting expansive architectural plans, private villas, and low-density luxury structures that command exceptional rates.",
  },
];
