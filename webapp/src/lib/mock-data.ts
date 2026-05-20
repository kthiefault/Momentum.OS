export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  triggerType: "manual" | "scheduled" | "webhook" | "form";
  category: "automation" | "ai" | "crm" | "notification" | "custom";
  runCount: number;
  lastRunAt: string | null;
  createdAt: string;
  steps: { name: string; type: "trigger" | "condition" | "action" }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "lost";
  notes?: string;
  createdAt: string;
}

const initialWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Lead Qualification Pipeline",
    description: "Automatically scores and routes new leads based on engagement and fit criteria.",
    status: "active",
    triggerType: "form",
    category: "crm",
    runCount: 247,
    lastRunAt: "2026-05-19T14:32:00Z",
    createdAt: "2026-01-10T09:00:00Z",
    steps: [
      { name: "Form Submit", type: "trigger" },
      { name: "Score Lead", type: "condition" },
      { name: "Route to Rep", type: "action" },
      { name: "Send Email", type: "action" },
    ],
  },
  {
    id: "wf-2",
    name: "Weekly Performance Report",
    description: "Compiles KPIs from all connected sources and emails the report every Monday morning.",
    status: "active",
    triggerType: "scheduled",
    category: "automation",
    runCount: 52,
    lastRunAt: "2026-05-18T08:00:00Z",
    createdAt: "2026-01-15T10:00:00Z",
    steps: [
      { name: "Schedule Trigger", type: "trigger" },
      { name: "Fetch Metrics", type: "action" },
      { name: "Generate Report", type: "action" },
      { name: "Send Email", type: "action" },
    ],
  },
  {
    id: "wf-3",
    name: "AI-Powered Email Follow-up",
    description: "Uses GPT-4 to craft personalized follow-up emails based on lead behavior and history.",
    status: "active",
    triggerType: "webhook",
    category: "ai",
    runCount: 891,
    lastRunAt: "2026-05-19T16:45:00Z",
    createdAt: "2026-02-01T11:00:00Z",
    steps: [
      { name: "Webhook Receive", type: "trigger" },
      { name: "Fetch Lead History", type: "action" },
      { name: "AI Draft Email", type: "action" },
      { name: "Send & Log", type: "action" },
    ],
  },
  {
    id: "wf-4",
    name: "New User Onboarding",
    description: "Kicks off a 7-step onboarding sequence the moment a new user signs up.",
    status: "active",
    triggerType: "webhook",
    category: "automation",
    runCount: 1204,
    lastRunAt: "2026-05-20T09:12:00Z",
    createdAt: "2025-12-01T08:00:00Z",
    steps: [
      { name: "Signup Event", type: "trigger" },
      { name: "Create Profile", type: "action" },
      { name: "Send Welcome", type: "action" },
      { name: "Schedule Check-in", type: "action" },
    ],
  },
  {
    id: "wf-5",
    name: "Deal Close Notification",
    description: "Notifies the team on Slack and logs the deal in the CRM when a contract is signed.",
    status: "active",
    triggerType: "webhook",
    category: "notification",
    runCount: 338,
    lastRunAt: "2026-05-17T13:20:00Z",
    createdAt: "2026-01-20T09:00:00Z",
    steps: [
      { name: "Contract Signed", type: "trigger" },
      { name: "Post to Slack", type: "action" },
      { name: "Update CRM", type: "action" },
    ],
  },
  {
    id: "wf-6",
    name: "CRM Data Sync",
    description: "Bidirectional sync between Salesforce and internal database, running every 6 hours.",
    status: "paused",
    triggerType: "scheduled",
    category: "crm",
    runCount: 156,
    lastRunAt: "2026-05-12T06:00:00Z",
    createdAt: "2026-02-10T10:00:00Z",
    steps: [
      { name: "Schedule Trigger", type: "trigger" },
      { name: "Fetch Salesforce", type: "action" },
      { name: "Reconcile Records", type: "condition" },
      { name: "Write Changes", type: "action" },
    ],
  },
  {
    id: "wf-7",
    name: "Social Media Monitor",
    description: "Tracks brand mentions across Twitter and LinkedIn and flags high-priority conversations with AI.",
    status: "paused",
    triggerType: "scheduled",
    category: "ai",
    runCount: 89,
    lastRunAt: "2026-05-10T10:00:00Z",
    createdAt: "2026-03-01T09:00:00Z",
    steps: [
      { name: "Hourly Schedule", type: "trigger" },
      { name: "Scrape Mentions", type: "action" },
      { name: "AI Sentiment", type: "condition" },
      { name: "Alert Team", type: "action" },
    ],
  },
  {
    id: "wf-8",
    name: "Invoice Generation",
    description: "Auto-generates and sends PDF invoices when a subscription renews.",
    status: "draft",
    triggerType: "webhook",
    category: "automation",
    runCount: 0,
    lastRunAt: null,
    createdAt: "2026-05-15T14:00:00Z",
    steps: [
      { name: "Subscription Renew", type: "trigger" },
      { name: "Generate PDF", type: "action" },
      { name: "Email Invoice", type: "action" },
    ],
  },
  {
    id: "wf-9",
    name: "Competitor Price Watch",
    description: "Monitors competitor pricing pages daily and summarizes changes using AI.",
    status: "draft",
    triggerType: "scheduled",
    category: "ai",
    runCount: 0,
    lastRunAt: null,
    createdAt: "2026-05-18T11:00:00Z",
    steps: [
      { name: "Daily Schedule", type: "trigger" },
      { name: "Scrape Pages", type: "action" },
      { name: "AI Summarize", type: "action" },
      { name: "Send Digest", type: "action" },
    ],
  },
  {
    id: "wf-10",
    name: "Customer Feedback Loop",
    description: "Sends NPS surveys 14 days after onboarding and routes detractors to support.",
    status: "active",
    triggerType: "scheduled",
    category: "automation",
    runCount: 412,
    lastRunAt: "2026-05-19T10:00:00Z",
    createdAt: "2026-01-25T09:00:00Z",
    steps: [
      { name: "14-Day Trigger", type: "trigger" },
      { name: "Send NPS Survey", type: "action" },
      { name: "Score Response", type: "condition" },
      { name: "Route Detractors", type: "action" },
    ],
  },
];

const initialLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Marcus Holt",
    email: "marcus.holt@archbridge.io",
    phone: "+1 (415) 823-4901",
    source: "website",
    status: "qualified",
    notes: "Interested in enterprise plan, demo scheduled for next week.",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "lead-2",
    name: "Priya Nair",
    email: "p.nair@lumenventures.com",
    source: "LinkedIn",
    status: "contacted",
    notes: "Connected via cold outreach, replied positively.",
    createdAt: "2026-05-03T11:30:00Z",
  },
  {
    id: "lead-3",
    name: "Daniel Osei",
    email: "dosei@stackcraft.dev",
    phone: "+1 (332) 671-0022",
    source: "referral",
    status: "new",
    notes: "Referred by Marcus Holt.",
    createdAt: "2026-05-05T14:00:00Z",
  },
  {
    id: "lead-4",
    name: "Sofia Reyes",
    email: "sofia@delphic.ai",
    source: "demo request",
    status: "qualified",
    notes: "Requested a live walkthrough of the automation builder.",
    createdAt: "2026-05-06T10:15:00Z",
  },
  {
    id: "lead-5",
    name: "James Whitfield",
    email: "james.whitfield@veranova.co",
    phone: "+44 7700 900142",
    source: "email",
    status: "contacted",
    notes: "Responded to cold email campaign.",
    createdAt: "2026-05-07T08:45:00Z",
  },
  {
    id: "lead-6",
    name: "Aisha Kamara",
    email: "a.kamara@brightpathhr.com",
    source: "website",
    status: "new",
    createdAt: "2026-05-08T16:20:00Z",
  },
  {
    id: "lead-7",
    name: "Tom Lindqvist",
    email: "tom@nordicops.se",
    phone: "+46 70 123 4567",
    source: "cold outreach",
    status: "lost",
    notes: "Went with a competitor. Follow up in Q3.",
    createdAt: "2026-04-22T09:00:00Z",
  },
  {
    id: "lead-8",
    name: "Rachel Kim",
    email: "rkim@folio.works",
    source: "LinkedIn",
    status: "qualified",
    notes: "Director of Ops, needs workflow automation for 50-person team.",
    createdAt: "2026-05-09T13:00:00Z",
  },
  {
    id: "lead-9",
    name: "Carlos Mendes",
    email: "cmendes@orbitalfintech.com",
    phone: "+1 (646) 555-0178",
    source: "referral",
    status: "contacted",
    notes: "Referred by Rachel Kim.",
    createdAt: "2026-05-10T10:30:00Z",
  },
  {
    id: "lead-10",
    name: "Natalie Fuentes",
    email: "nfuentes@clarityhealthtech.com",
    source: "website",
    status: "new",
    createdAt: "2026-05-11T09:45:00Z",
  },
  {
    id: "lead-11",
    name: "Ben Okafor",
    email: "ben.okafor@quantumleap.io",
    phone: "+1 (212) 867-5309",
    source: "demo request",
    status: "qualified",
    notes: "CTO, evaluating for engineering automation.",
    createdAt: "2026-05-12T14:00:00Z",
  },
  {
    id: "lead-12",
    name: "Ingrid Svensson",
    email: "i.svensson@nordlabs.se",
    source: "email",
    status: "lost",
    notes: "Budget not approved for this quarter.",
    createdAt: "2026-04-15T11:00:00Z",
  },
  {
    id: "lead-13",
    name: "Kwame Asante",
    email: "kwame@pivotgrowth.co",
    phone: "+1 (305) 444-9211",
    source: "LinkedIn",
    status: "contacted",
    notes: "Replied to InMail, asked for pricing.",
    createdAt: "2026-05-13T09:00:00Z",
  },
  {
    id: "lead-14",
    name: "Mia Tanaka",
    email: "m.tanaka@syncwave.jp",
    source: "cold outreach",
    status: "new",
    createdAt: "2026-05-14T07:30:00Z",
  },
  {
    id: "lead-15",
    name: "Oliver Grant",
    email: "ogrant@meridianlogistics.com",
    phone: "+1 (503) 992-0034",
    source: "referral",
    status: "qualified",
    notes: "Needs CRM + automation bundle, decision expected by end of month.",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "lead-16",
    name: "Fatima Al-Hassan",
    email: "fatima@venturestride.ae",
    source: "website",
    status: "contacted",
    notes: "Submitted contact form, sent intro email.",
    createdAt: "2026-05-16T13:15:00Z",
  },
  {
    id: "lead-17",
    name: "Ryan Baxter",
    email: "ryan.baxter@crestlinetech.com",
    phone: "+1 (720) 331-8800",
    source: "demo request",
    status: "new",
    createdAt: "2026-05-17T15:00:00Z",
  },
  {
    id: "lead-18",
    name: "Elena Vasquez",
    email: "e.vasquez@solsticeanalytics.com",
    source: "LinkedIn",
    status: "contacted",
    notes: "Head of Data, exploring AI-powered automation workflows.",
    createdAt: "2026-05-18T11:45:00Z",
  },
];

let _workflows: Workflow[] = [...initialWorkflows];
let _leads: Lead[] = [...initialLeads];
const _listeners = new Set<() => void>();

export const mockStore = {
  getWorkflows: () => _workflows,
  getLeads: () => _leads,
  subscribe: (fn: () => void) => {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
  notify: () => _listeners.forEach((fn) => fn()),
  addWorkflow: (w: Workflow) => {
    _workflows = [w, ..._workflows];
    mockStore.notify();
  },
  updateWorkflow: (id: string, patch: Partial<Workflow>) => {
    _workflows = _workflows.map((w) => (w.id === id ? { ...w, ...patch } : w));
    mockStore.notify();
  },
  deleteWorkflow: (id: string) => {
    _workflows = _workflows.filter((w) => w.id !== id);
    mockStore.notify();
  },
  addLead: (l: Lead) => {
    _leads = [l, ..._leads];
    mockStore.notify();
  },
  updateLead: (id: string, patch: Partial<Lead>) => {
    _leads = _leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
    mockStore.notify();
  },
  deleteLead: (id: string) => {
    _leads = _leads.filter((l) => l.id !== id);
    mockStore.notify();
  },
};
