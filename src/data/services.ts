import { Service, ServiceStatus } from "@/types/service";
export type { Service, ServiceStatus };

export const mockServices: Service[] = [
  {
    id: "srv-01",
    name: "Hospitality Operations Advisory",
    slug: "hospitality-operations-advisory",
    shortDescription: "End-to-end operational diagnostic reviews, efficiency optimization, and standard operating procedures implementation.",
    category: "Operations",
    displayOrder: 1,
    status: "active",
    featured: true,
    heroLabel: "OPERATIONS / STRATEGY",
    description: "Our core advisory service is designed to audit, refine, and elevate hospitality operations. THEDCO evaluates guest journey flows, back-of-house logistics, centralized procurement, and F&B cost dynamics to identify bottlenecks and implement sustainable, standardized solutions. We work alongside on-property general managers to implement custom operational playbooks that improve guest satisfaction while controlling overhead.",
    keyPoints: [
      "Operational Diagnostic Audit",
      "Standard Operating Procedures (SOP) Formulation",
      "Centralized Procurement Frameworks",
      "Guest Satisfaction Index Optimization"
    ],
    updatedAt: "22 Aug 2026"
  },
  {
    id: "srv-02",
    name: "Financial & Cost Management",
    slug: "financial-cost-management",
    shortDescription: "Strategic pricing modeling, prime cost analysis, food cost control systems, and bottom-line margin expansion.",
    category: "Finance",
    displayOrder: 2,
    status: "active",
    featured: true,
    heroLabel: "FINANCIAL ADVISORY",
    description: "We help properties stabilize cash flow, control prime costs (COGS + labor), and build robust forecasting models. THEDCO designs custom financial reporting dashboards that give ownership clear visibility into department yields, ADR trends, and capital expenditure effectiveness. Our interventions aim to lower operational break-even thresholds and protect profitability margins.",
    keyPoints: [
      "Prime Cost Diagnostic (COGS & Labor)",
      "Dynamic Room and Cover Pricing Models",
      "Monthly Operational Forecast Dashboards",
      "Department Yield Analysis & Audits"
    ],
    updatedAt: "20 Aug 2026"
  },
  {
    id: "srv-03",
    name: "Restaurant Consulting",
    slug: "restaurant-consulting",
    shortDescription: "Concept development, restaurant turnarounds, dining floor choreography, and guest journey mapping.",
    category: "Restaurant Advisory",
    displayOrder: 3,
    status: "active",
    featured: false,
    heroLabel: "CONCEPT & RESTAURANT ADVISORY",
    description: "THEDCO coordinates restaurant turnarounds and new launch concepts from flow mapping to menu diagnostics. We analyze covers patterns, optimize table turnover speed, and fine-tune front-of-house service choreography to create unforgettable dining experiences. We bridge the gap between back-of-house kitchen realities and front-of-house hospitality standards.",
    keyPoints: [
      "F&B Concept Blueprinting",
      "Dining Room Layout and Flow Optimization",
      "Table Turnover Performance Audits",
      "Service Choreography Cross-Training"
    ],
    updatedAt: "19 Aug 2026"
  },
  {
    id: "srv-04",
    name: "Hotel & Resort Development",
    slug: "hotel-resort-development",
    shortDescription: "Market feasibility studies, product concept mapping, operator selection, and owner coordination.",
    category: "Development",
    displayOrder: 4,
    status: "active",
    featured: true,
    heroLabel: "DEVELOPMENT & FEASIBILITY",
    description: "Navigating new hotel and resort builds requires strict data validation. THEDCO provides market feasibility blueprints, product definition advisory (ADR modeling, key count plans), and coordinates developer-operator select negotiations. We act as owners' representatives to protect the project's long-term commercial yield and capital value.",
    keyPoints: [
      "Market Feasibility blueprints",
      "ADR & Key Count Yield Projections",
      "Operator Selection Pitch Coordination",
      "Technical Advisory for Project Planners"
    ],
    updatedAt: "18 Aug 2026"
  },
  {
    id: "srv-05",
    name: "Menu Engineering & Cost Control",
    slug: "menu-engineering-cost-control",
    shortDescription: "Menu pricing matrix diagnostics, recipe costing logs, and food waste reduction frameworks.",
    category: "Restaurant Advisory",
    displayOrder: 5,
    status: "active",
    featured: false,
    heroLabel: "MENU DESIGN & COST CONTROL",
    description: "We help F&B operators build menu cards that maximize profitability. THEDCO performs detailed recipe costing analyses and uses the Star/Plowhorse performance matrix to identify high-margin dishes. We rewrite layout flow, adjust portion logs, and streamline ingredient commonality to drive food waste percentage down.",
    keyPoints: [
      "Recipe Costing and Margin Diagnostics",
      "Menu Engineering Matrix Placement",
      "Portion Standardization & Control Logs",
      "F&B Waste Tracking Implementations"
    ],
    updatedAt: "15 Aug 2026"
  },
  {
    id: "srv-06",
    name: "Branding & Marketing Strategy",
    slug: "branding-marketing-strategy",
    shortDescription: "Consultancy for brand narrative development, customer acquisition campaigns, and direct bookings channels.",
    category: "Brand & Marketing",
    displayOrder: 6,
    status: "active",
    featured: false,
    heroLabel: "BRAND ARCHITECTURE & MARKETING",
    description: "Shift away from high-commission third-party OTA dependence. THEDCO builds premium marketing strategies focused on high-yield direct reservations, local corporate accounts, and seasonal experience packages. We refine brand storytelling, launch direct-booking campaigns, and optimize digital channel conversions.",
    keyPoints: [
      "Direct Booking Channel Strategies",
      "Brand Narrative and Storytelling Audits",
      "Corporate Account Acquisition Strategy",
      "OTA Commission Cost Reduction Blueprints"
    ],
    updatedAt: "12 Aug 2026"
  },
  {
    id: "srv-07",
    name: "Staffing & Training",
    slug: "staffing-training",
    shortDescription: "Customer service training, retention planning, and performance management implementation.",
    category: "People & Operations",
    displayOrder: 7,
    status: "active",
    featured: false,
    heroLabel: "PEOPLE & TRAINING SYSTEMS",
    description: "The foundation of hospitality is human capital. THEDCO coordinates service standards training and helps design employee onboarding/retention structures to stabilize staff turnover. We introduce key performance metrics (KPIs) to align kitchen, reception, and banquet teams with ownership's service standards.",
    keyPoints: [
      "Service Standards Training Programs",
      "Employee Retention & Onboarding Blueprints",
      "Kitchen/Front-of-House KPI Audits",
      "Team Management Restructuring"
    ],
    updatedAt: "10 Aug 2026"
  },
  {
    id: "srv-08",
    name: "Revenue Growth Strategy",
    slug: "revenue-growth-strategy",
    shortDescription: "Yield management systems audit, occupancy rate stabilization, and package structure engineering.",
    category: "Business Strategy",
    displayOrder: 8,
    status: "draft",
    featured: false,
    heroLabel: "REVENUE OPTIMIZATION",
    description: "Maximize RevPAR and GOPPAR across all seasonal market cycles. THEDCO audits current yield management processes, designs customized occupancy stabilization packages, and implements ancillary upsell pathways. We help properties capture untapped demand segments through targeted, margin-resilient pricing strategies.",
    keyPoints: [
      "RevPAR and GOPPAR Growth Diagnostics",
      "Off-season Occupancy Stabilization Programs",
      "Ancillary Upsell Revenue Strategies",
      "Demand Segment Market Audits"
    ],
    updatedAt: "08 Aug 2026"
  }
];
