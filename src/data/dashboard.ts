export interface StatItem {
  id: string;
  label: string;
  value: string;
  change: string;
}

export type InquiryStatus = "NEW" | "REVIEW" | "CONTACTED";

export interface InquiryItem {
  id: string;
  name: string;
  type: string;
  timeAgo: string;
  status: InquiryStatus;
}

export type ProjectStatus = "ACTIVE" | "IN PROGRESS" | "PLANNING";

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  category: string;
  status: ProjectStatus;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export const mockStats: StatItem[] = [
  {
    id: "active-projects",
    label: "Active Projects",
    value: "12",
    change: "+3 this month",
  },
  {
    id: "total-clients",
    label: "Total Clients",
    value: "24",
    change: "+2 this month",
  },
  {
    id: "new-inquiries",
    label: "New Inquiries",
    value: "08",
    change: "4 pending review",
  },
  {
    id: "blog-posts",
    label: "Blog Posts",
    value: "18",
    change: "2 published this week",
  },
];

export const mockInquiries: InquiryItem[] = [
  {
    id: "inq-1",
    name: "Raj Mehta",
    type: "New Hotel Project",
    timeAgo: "Today",
    status: "NEW",
  },
  {
    id: "inq-2",
    name: "Ankit Sharma",
    type: "Restaurant Turnaround",
    timeAgo: "Yesterday",
    status: "REVIEW",
  },
  {
    id: "inq-3",
    name: "Priya Patel",
    type: "Resort Development",
    timeAgo: "2 days ago",
    status: "NEW",
  },
  {
    id: "inq-4",
    name: "Amit Shah",
    type: "Hospitality Investment",
    timeAgo: "3 days ago",
    status: "CONTACTED",
  },
];

export const mockProjects: ProjectItem[] = [
  {
    id: "proj-1",
    index: "01",
    name: "Panchavati Hospitality",
    category: "Hotel Operations",
    status: "ACTIVE",
  },
  {
    id: "proj-2",
    index: "02",
    name: "Restaurant Growth Initiative",
    category: "Restaurant",
    status: "IN PROGRESS",
  },
  {
    id: "proj-3",
    index: "03",
    name: "New Hospitality Venture",
    category: "Hotel / Resort",
    status: "PLANNING",
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "act-1",
    message: "New consultation inquiry received",
    timestamp: "Today · 2 hours ago",
  },
  {
    id: "act-2",
    message: "Case study updated",
    timestamp: "Yesterday · 4:30 PM",
  },
  {
    id: "act-3",
    message: "Blog article published",
    timestamp: "Yesterday · 11:20 AM",
  },
  {
    id: "act-4",
    message: "Project status updated",
    timestamp: "2 days ago",
  },
];

export const mockTrendPoints: TrendPoint[] = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 45 },
  { label: "Mar", value: 35 },
  { label: "Apr", value: 70 },
  { label: "May", value: 60 },
  { label: "Jun", value: 85 },
];
