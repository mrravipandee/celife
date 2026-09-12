export type InquiryStatus = "new" | "in-review" | "contacted" | "closed";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: string;
  message: string;
  date: string;
  time: string;
  status: InquiryStatus;
}

export const mockInquiries: Inquiry[] = [
  {
    id: "inq-01",
    name: "Raj Mehta",
    email: "raj.mehta@hospitalitygroup.in",
    phone: "+91 98765 43210",
    company: "Raj Hospitality Group",
    type: "Hotel Development",
    message: "We are planning a new luxury boutique hotel in Udaipur and would like to discuss advisory support for feasibility studies, operator search, and asset management structure.",
    date: "22 Aug 2026",
    time: "10:42 AM",
    status: "new",
  },
  {
    id: "inq-02",
    name: "Ankit Sharma",
    email: "sharma.a@bitesrestaurants.com",
    phone: "+91 91234 56789",
    company: "Bites Restaurant Ventures",
    type: "Restaurant Turnaround",
    message: "Our fine dining restaurant brand in Mumbai is facing dropping margins. We need an operational audit, menu engineering advice, and assistance with standard operating procedures to improve profitability.",
    date: "21 Aug 2026",
    time: "03:15 PM",
    status: "in-review",
  },
  {
    id: "inq-03",
    name: "Priya Patel",
    email: "ppatel@luxuryresortscapes.com",
    phone: "+91 88888 77777",
    company: "Luxury Resortscapes India",
    type: "Resort Development",
    message: "Planning a 150-key eco-resort development in Goa. We require concept development, project master planning coordination, and financial forecasting from a hospitality advisory partner.",
    date: "20 Aug 2026",
    time: "09:05 AM",
    status: "new",
  },
  {
    id: "inq-04",
    name: "Amit Shah",
    email: "ashah@auracapital.com",
    phone: "+91 99999 88888",
    company: "Aura Private Equity Capital",
    type: "Hospitality Investment",
    message: "Our fund is evaluating acquisitions of mid-scale hotel assets across Western India. We want to engage THEDCO to perform commercial due diligence and market intelligence research.",
    date: "19 Aug 2026",
    time: "05:50 PM",
    status: "contacted",
  },
  {
    id: "inq-05",
    name: "Vikram Malhotra",
    email: "v.malhotra@themalhotragroup.co.uk",
    phone: "+44 20 7946 0958",
    company: "The Malhotra Estates",
    type: "Brand & Marketing",
    message: "We own a heritage hotel property in Jaipur and want to reposition it as a high-end luxury wellness retreat. Looking for advisory support regarding brand positioning, identity, and soft launch marketing strategies.",
    date: "17 Aug 2026",
    time: "02:10 PM",
    status: "contacted",
  },
  {
    id: "inq-06",
    name: "Sanjay Sen",
    email: "sanjay.sen@palacehotels.co.in",
    phone: "+91 77777 66666",
    company: "Heritage Palace Hotels",
    type: "Operations Advisory",
    message: "We need an evaluation of our current food & beverage operations and guest experience ratings across our 3 palace hotels in Rajasthan. We are looking to align them with global five-star service standards.",
    date: "15 Aug 2026",
    time: "11:30 AM",
    status: "in-review",
  },
  {
    id: "inq-07",
    name: "Nisha Rao",
    email: "nisha.rao@coffeetableventures.com",
    phone: "+91 87654 32109",
    company: "Coffee Table Cafe Brands",
    type: "New Hospitality Venture",
    message: "We are developing a new premium chain of specialty coffee bistros. We require operational blueprints, supply chain audits, and franchisee expansion packages for pan-India execution.",
    date: "12 Aug 2026",
    time: "04:45 PM",
    status: "new",
  },
  {
    id: "inq-08",
    name: "Rohit Verma",
    email: "verma.rohit@grandvistas.com",
    phone: "+91 94444 33333",
    company: "Grand Vistas Hotels Group",
    type: "Restaurant Consulting",
    message: "We are seeking a partner to audit food waste and labor costs at our primary convention resort hotel. The audit must provide actionable operational recommendations.",
    date: "10 Aug 2026",
    time: "10:15 AM",
    status: "closed",
  },
];
