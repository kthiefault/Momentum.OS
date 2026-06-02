import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  Bot,
  Workflow,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Sparkles,
  ArrowUpRight,
  Circle,
  Search,
  Play,
  Pause,
  ChevronRight,
  X,
  Command,
  Plus,
  ChevronLeft,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  RefreshCw,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = "command" | "pipeline" | "agents" | "workflows";

interface Deal {
  id: string;
  company: string;
  value: number;
  owner: string;
  ownerInitials: string;
  priority: "high" | "medium" | "low";
  lastActivity: string;
  stage: string;
  notes: string;
  timeline: { date: string; event: string }[];
}

interface ActivityItem {
  id: string;
  dot: "ember" | "ice" | "green" | "red";
  text: string;
  t: string;
}

interface AgentEntry {
  id: string;
  name: string;
  role: string;
  status: "running" | "idle";
  tasksToday: number;
  lastAction: string;
  color: string;
}

interface WorkflowEntry {
  id: string;
  name: string;
  trigger: string;
  lastRun: string;
  nextRun: string;
  status: "active" | "paused";
  runCount: number;
  description: string;
  steps: string[];
}

interface LogEntry {
  id: string;
  ts: string;
  agent: string;
  action: string;
  outcome: string;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetId: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const sparklinePath = (values: number[], w: number, h: number) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = w / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

const TREND = [12, 18, 15, 22, 28, 24, 35, 32, 40, 38, 47, 52, 49, 58, 64];
const TREND_PATH = sparklinePath(TREND, 280, 72);

const PIPELINE_COLUMNS: { stage: string; count: number; value: string; raw: number }[] = [
  { stage: "Discover", count: 38, value: "$420K", raw: 420000 },
  { stage: "Qualify", count: 21, value: "$310K", raw: 310000 },
  { stage: "Propose", count: 14, value: "$280K", raw: 280000 },
  { stage: "Negotiate", count: 9, value: "$210K", raw: 210000 },
  { stage: "Close", count: 5, value: "$118K", raw: 118000 },
];

const ALL_DEALS: Deal[] = [
  {
    id: "d1", stage: "Discover", company: "Helix Capital", value: 48000, owner: "Sarah Chen", ownerInitials: "SC",
    priority: "high", lastActivity: "2h ago",
    notes: "Atlas flagged as high-fit based on ARR growth. Next step: discovery call Thursday.",
    timeline: [
      { date: "May 20", event: "Lead enriched by Atlas" },
      { date: "May 19", event: "Inbound form submitted" },
    ],
  },
  {
    id: "d2", stage: "Discover", company: "Vantage Labs", value: 32000, owner: "Jake Torres", ownerInitials: "JT",
    priority: "medium", lastActivity: "1d ago",
    notes: "Series B startup, ops team of 40. Strong ICP match.",
    timeline: [
      { date: "May 18", event: "Email opened 3x" },
      { date: "May 17", event: "Added from LinkedIn outreach" },
    ],
  },
  {
    id: "d3", stage: "Discover", company: "Orbit Systems", value: 61000, owner: "Sarah Chen", ownerInitials: "SC",
    priority: "low", lastActivity: "3d ago",
    notes: "Warm intro via Marcus at Baseline VC.",
    timeline: [{ date: "May 15", event: "Intro call booked" }],
  },
  {
    id: "d4", stage: "Qualify", company: "NorthWind Solutions", value: 82000, owner: "Marcus Reed", ownerInitials: "MR",
    priority: "high", lastActivity: "30m ago",
    notes: "Budget confirmed $80-100K. Decision maker: CRO Dana Park. Timeline: Q3.",
    timeline: [
      { date: "May 21", event: "Budget call completed" },
      { date: "May 19", event: "Champion identified" },
      { date: "May 16", event: "Discovery call" },
    ],
  },
  {
    id: "d5", stage: "Qualify", company: "Finvera Group", value: 55000, owner: "Jake Torres", ownerInitials: "JT",
    priority: "medium", lastActivity: "4h ago",
    notes: "CFO involved. Evaluating 3 vendors including us.",
    timeline: [
      { date: "May 21", event: "Sent comparison doc" },
      { date: "May 18", event: "Qualify call" },
    ],
  },
  {
    id: "d6", stage: "Qualify", company: "Stratos Media", value: 41000, owner: "Sarah Chen", ownerInitials: "SC",
    priority: "low", lastActivity: "2d ago",
    notes: "Good fit but slow moving. Follow up next week.",
    timeline: [{ date: "May 19", event: "Initial qualify call" }],
  },
  {
    id: "d7", stage: "Propose", company: "Apex Dynamics", value: 120000, owner: "Marcus Reed", ownerInitials: "MR",
    priority: "high", lastActivity: "45m ago",
    notes: "Proposal sent. Legal reviewing MSA. Atlas drafted exec summary overnight.",
    timeline: [
      { date: "May 22", event: "Proposal delivered" },
      { date: "May 20", event: "Demo with exec team" },
      { date: "May 17", event: "Technical eval passed" },
    ],
  },
  {
    id: "d8", stage: "Propose", company: "Luminary Health", value: 95000, owner: "Jake Torres", ownerInitials: "JT",
    priority: "high", lastActivity: "2h ago",
    notes: "Strong champion. Competing with legacy CRM.",
    timeline: [
      { date: "May 21", event: "Proposal review call" },
      { date: "May 19", event: "Security questionnaire sent" },
    ],
  },
  {
    id: "d9", stage: "Negotiate", company: "Cascade Ventures", value: 74000, owner: "Sarah Chen", ownerInitials: "SC",
    priority: "high", lastActivity: "1h ago",
    notes: "Down from $82K ask. Holding on implementation fee. Legal on final round.",
    timeline: [
      { date: "May 22", event: "Counter-offer submitted" },
      { date: "May 20", event: "Pricing call" },
      { date: "May 18", event: "Proposal accepted in principle" },
    ],
  },
  {
    id: "d10", stage: "Negotiate", company: "Redwood Partners", value: 58000, owner: "Marcus Reed", ownerInitials: "MR",
    priority: "medium", lastActivity: "3h ago",
    notes: "Multi-year discount requested. VP of Ops championing internally.",
    timeline: [
      { date: "May 21", event: "Multi-year proposal sent" },
      { date: "May 19", event: "Negotiation started" },
    ],
  },
  {
    id: "d11", stage: "Close", company: "Summit Analytics", value: 68000, owner: "Jake Torres", ownerInitials: "JT",
    priority: "high", lastActivity: "10m ago",
    notes: "Contract out for signature. Atlas monitoring DocuSign. Expected close today.",
    timeline: [
      { date: "May 22", event: "DocuSign sent" },
      { date: "May 21", event: "Final approval received" },
      { date: "May 20", event: "MSA finalized" },
    ],
  },
  {
    id: "d12", stage: "Close", company: "BlueArch Technologies", value: 50000, owner: "Sarah Chen", ownerInitials: "SC",
    priority: "medium", lastActivity: "1h ago",
    notes: "PO in procurement. ETA 48h.",
    timeline: [
      { date: "May 22", event: "PO submitted" },
      { date: "May 21", event: "Legal signed off" },
    ],
  },
];

const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: "a1", dot: "ember", text: "Atlas closed Helix Capital · $48K", t: "now" },
  { id: "a2", dot: "ice", text: "Workflow ‹Onboarding-v3› auto-fired", t: "1m" },
  { id: "a3", dot: "green", text: "Renewal signal · NorthWind high", t: "4m" },
  { id: "a4", dot: "ember", text: "Vesta drafted Q3 forecast", t: "8m" },
  { id: "a5", dot: "ice", text: "Mercury cleared 14 ops tickets", t: "12m" },
  { id: "a6", dot: "green", text: "Deal score updated · Apex +18pts", t: "15m" },
];

const RANDOM_ACTIVITIES = [
  { dot: "ember" as const, text: "Atlas prioritized 3 new leads from Helix intro" },
  { dot: "ice" as const, text: "Mercury auto-resolved billing discrepancy" },
  { dot: "green" as const, text: "Workflow ‹Lead-Score-Update› completed — 41 records" },
  { dot: "ember" as const, text: "Atlas sent follow-up to Cascade Ventures" },
  { dot: "ice" as const, text: "Onboarding-v3 triggered for Summit Analytics" },
  { dot: "green" as const, text: "Vesta flagged renewal risk · Redwood Partners" },
  { dot: "ember" as const, text: "Slack-Deal-Alert fired · Apex stage → Negotiate" },
  { dot: "red" as const, text: "Agent escalation: Luminary Health legal review" },
  { dot: "ice" as const, text: "Mercury synced 22 Salesforce records" },
  { dot: "green" as const, text: "Deal closed · BlueArch Technologies $50K" },
];

const AGENTS: AgentEntry[] = [
  {
    id: "atlas", name: "Atlas", role: "Sales", status: "running",
    tasksToday: 47, lastAction: "Enriched 3 inbound leads from Helix Capital referral",
    color: "hsl(221 79% 48%)",
  },
  {
    id: "mercury", name: "Mercury", role: "Ops", status: "running",
    tasksToday: 31, lastAction: "Cleared 14 open ops tickets, synced Salesforce",
    color: "hsl(192 90% 70%)",
  },
  {
    id: "vesta", name: "Vesta", role: "Finance", status: "idle",
    tasksToday: 12, lastAction: "Drafted Q3 revenue forecast — awaiting CFO review",
    color: "hsl(140 70% 55%)",
  },
];

const INITIAL_LOG: LogEntry[] = [
  { id: "l1", ts: "09:47", agent: "Atlas", action: "Lead enrichment · 3 contacts", outcome: "Completed" },
  { id: "l2", ts: "09:31", agent: "Mercury", action: "Ops ticket batch · 14 items", outcome: "Completed" },
  { id: "l3", ts: "09:15", agent: "Vesta", action: "Q3 forecast draft", outcome: "Awaiting review" },
  { id: "l4", ts: "08:58", agent: "Atlas", action: "Email follow-up · Cascade Ventures", outcome: "Sent" },
  { id: "l5", ts: "08:44", agent: "Mercury", action: "Salesforce sync · 22 records", outcome: "Completed" },
  { id: "l6", ts: "08:30", agent: "Atlas", action: "Deal score update · 8 accounts", outcome: "Completed" },
  { id: "l7", ts: "08:17", agent: "Vesta", action: "Invoice reconciliation · June", outcome: "Completed" },
  { id: "l8", ts: "07:55", agent: "Mercury", action: "Onboarding checklist · Summit", outcome: "In progress" },
  { id: "l9", ts: "07:40", agent: "Atlas", action: "Renewal alert · Redwood Partners", outcome: "Flagged" },
  { id: "l10", ts: "07:22", agent: "Vesta", action: "Budget variance report · Q2", outcome: "Completed" },
];

const WORKFLOWS: WorkflowEntry[] = [
  {
    id: "wf1", name: "Onboarding-v3", trigger: "Deal Closed", lastRun: "Today 09:47", nextRun: "On trigger",
    status: "active", runCount: 284,
    description: "Fires when a deal reaches Closed-Won. Provisions workspace, sends welcome kit, and schedules onboarding calls.",
    steps: ["Create workspace in Momentum", "Send welcome email sequence", "Assign CSM from round-robin", "Schedule kickoff call", "Notify #new-customers Slack"],
  },
  {
    id: "wf2", name: "Renewal-Signal", trigger: "90d Before Renewal", lastRun: "Today 06:00", nextRun: "Tomorrow 06:00",
    status: "active", runCount: 119,
    description: "Detects accounts 90 days from renewal. Vesta scores churn risk and Atlas schedules QBR.",
    steps: ["Score churn risk (Vesta)", "Tag account in CRM", "Alert CSM via Slack", "Schedule QBR email", "Generate renewal proposal draft"],
  },
  {
    id: "wf3", name: "Lead-Score-Update", trigger: "Daily 6:00 AM", lastRun: "Today 06:00", nextRun: "Tomorrow 06:00",
    status: "active", runCount: 412,
    description: "Atlas re-scores all active leads every morning using latest intent signals and firmographic data.",
    steps: ["Pull intent data from Bombora", "Run lead scoring model", "Update scores in CRM", "Flag top 10 for outreach", "Send daily digest to sales team"],
  },
  {
    id: "wf4", name: "Slack-Deal-Alert", trigger: "Stage Change", lastRun: "Today 08:30", nextRun: "On trigger",
    status: "active", runCount: 891,
    description: "Posts a Slack message to #deal-updates whenever a deal advances or retreats a stage.",
    steps: ["Detect stage change event", "Fetch deal context", "Format Slack message", "Post to #deal-updates", "Log to activity feed"],
  },
  {
    id: "wf5", name: "Ops-Ticket-Triage", trigger: "New Ticket", lastRun: "Today 09:31", nextRun: "On trigger",
    status: "active", runCount: 1204,
    description: "Mercury auto-triages incoming ops tickets: categorizes, assigns, and resolves common issues.",
    steps: ["Parse ticket content", "Classify category + priority", "Auto-resolve if known issue", "Assign to team member", "Update ticket status"],
  },
  {
    id: "wf6", name: "Proposal-Generator", trigger: "Propose Stage Entry", lastRun: "Yesterday 14:22", nextRun: "On trigger",
    status: "active", runCount: 67,
    description: "Atlas drafts a custom proposal doc using deal context, ICP data, and win-story templates.",
    steps: ["Pull deal + account data", "Select matching win story", "Generate proposal draft", "Attach pricing table", "Notify rep via email"],
  },
  {
    id: "wf7", name: "Invoice-Reconcile", trigger: "Monthly — 1st", lastRun: "May 1", nextRun: "Jun 1",
    status: "active", runCount: 24,
    description: "Vesta reconciles all invoices against the GL and flags discrepancies for CFO review.",
    steps: ["Pull invoices from billing system", "Match against GL entries", "Flag discrepancies > $500", "Generate reconciliation report", "Email CFO with summary"],
  },
  {
    id: "wf8", name: "Churn-Intervention", trigger: "Health Score < 40", lastRun: "May 19", nextRun: "On trigger",
    status: "paused", runCount: 18,
    description: "Triggers intervention sequence when account health score drops below threshold.",
    steps: ["Detect health score drop", "Pause renewal workflow", "Alert CSM + account exec", "Schedule emergency QBR", "Escalate to VP if no response in 3d"],
  },
];

const TOUR_STEPS: TourStep[] = [
  {
    id: "t1",
    title: "Command Center",
    description: "Everything your team needs in one view — pipeline, agents, workflows, and live activity. No more tab-switching.",
    targetId: "tour-kpis",
  },
  {
    id: "t2",
    title: "Live Activity Feed",
    description: "Every agent action, workflow run, and deal update streams here in real time. Atlas just closed a deal — you'd know instantly.",
    targetId: "tour-activity",
  },
  {
    id: "t3",
    title: "Revenue Velocity",
    description: "This chart tracks weekly revenue momentum. Up 64% in 30 days. Your AI agents are working while you sleep.",
    targetId: "tour-chart",
  },
  {
    id: "t4",
    title: "Agents Running 24/7",
    description: "Atlas, Mercury, and Vesta are your always-on workforce. They close deals, clear tickets, and file reports — autonomously.",
    targetId: "tour-agents-sidebar",
  },
];

const COMMAND_ACTIONS = [
  { label: "New deal", icon: Plus, section: "Quick Actions" },
  { label: "Run agent", icon: Bot, section: "Quick Actions" },
  { label: "Create workflow", icon: Workflow, section: "Quick Actions" },
  { label: "View pipeline", icon: TrendingUp, section: "Quick Actions" },
  { label: "Atlas closed Helix Capital", icon: Activity, section: "Recent" },
  { label: "Onboarding-v3 fired", icon: Workflow, section: "Recent" },
  { label: "NorthWind renewal signal", icon: AlertCircle, section: "Recent" },
];

// ─── Small helper components ───────────────────────────────────────────────────

function PulsingDot({ color = "green" }: { color?: "green" | "ember" | "ice" | "red" }) {
  const colorMap = {
    green: "bg-[hsl(140_70%_55%)] shadow-[0_0_8px_hsl(140_70%_55%)]",
    ember: "bg-ember shadow-[0_0_8px_hsl(221_79%_48%)]",
    ice: "bg-ice shadow-[0_0_8px_hsl(192_90%_70%)]",
    red: "bg-red-500 shadow-[0_0_8px_hsl(0_80%_60%)]",
  };
  return (
    <span className={cn("inline-block h-2 w-2 rounded-full animate-pulse", colorMap[color])} />
  );
}

function ActivityDot({ dot }: { dot: ActivityItem["dot"] }) {
  const map = {
    ember: "bg-ember shadow-[0_0_8px_hsl(221_79%_48%)]",
    ice: "bg-ice shadow-[0_0_8px_hsl(192_90%_70%)]",
    green: "bg-[hsl(140_70%_55%)] shadow-[0_0_8px_hsl(140_70%_55%)]",
    red: "bg-red-500 shadow-[0_0_8px_hsl(0_80%_60%)]",
  };
  return <span className={cn("mt-1 h-1.5 w-1.5 flex-none rounded-full", map[dot])} />;
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  if (priority === "high") return (
    <span className="inline-flex items-center gap-1 rounded-full border border-ember/30 bg-ember/10 px-1.5 py-0.5 font-mono text-[9px] text-ember">
      <Sparkles className="h-2.5 w-2.5" /> AI High
    </span>
  );
  if (priority === "medium") return (
    <span className="inline-flex items-center gap-1 rounded-full border border-ice/30 bg-ice/10 px-1.5 py-0.5 font-mono text-[9px] text-ice">
      AI Med
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
      AI Low
    </span>
  );
}

function OwnerAvatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <span className={cn("inline-flex items-center justify-center rounded-full bg-ember/20 border border-ember/30 font-mono font-medium text-ember", sz)}>
      {initials}
    </span>
  );
}

// ─── Command Palette ───────────────────────────────────────────────────────────

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState<string>("");

  const filtered = COMMAND_ACTIONS.filter(
    (a) => query === "" || a.label.toLowerCase().includes(query.toLowerCase())
  );
  const sections = ["Quick Actions", "Recent"];

  function handleSelect(label: string) {
    toast.success(`Executing: ${label}`);
    onClose();
    setQuery("");
  }

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg p-0 bg-[hsl(230_20%_6%)] border border-border/60 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground flex-none" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions, deals, agents..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {sections.map((section) => {
            const items = filtered.filter((a) => a.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section} className="px-2 pb-1">
                <p className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  {section}
                </p>
                {items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.label)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/85 hover:bg-secondary/60 hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground flex-none" />
                    {item.label}
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/50" />
                  </button>
                ))}
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No results for "{query}"</p>
          ) : null}
        </div>
        <div className="border-t border-border/60 px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground/60 font-mono">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Guided Tour ───────────────────────────────────────────────────────────────

function GuidedTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = TOUR_STEPS[step];
  const total = TOUR_STEPS.length;

  const advance = useCallback(() => {
    if (step < total - 1) {
      setStep((s) => s + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [step, total, onClose]);

  useEffect(() => {
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    const interval = 50;
    const totalTime = 5000;
    let elapsed = 0;

    progressRef.current = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min((elapsed / totalTime) * 100, 100));
    }, interval);

    timerRef.current = setTimeout(() => {
      if (progressRef.current) clearInterval(progressRef.current);
      advance();
    }, totalTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [step, advance]);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/60 pointer-events-none" />
      {/* Highlight ring on target */}
      <TourHighlight targetId={currentStep.targetId} />
      {/* Tooltip card */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="rounded-xl border border-border/80 bg-[hsl(230_20%_7%)] p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground">Step {step + 1} of {total}</span>
              <h3 className="mt-0.5 text-base font-medium text-foreground">{currentStep.title}</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.description}</p>
          {/* Progress bar */}
          <div className="mt-4 h-0.5 w-full rounded-full bg-border/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-ember transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => { if (step > 0) { setStep(s => s - 1); setProgress(0); } }}
              disabled={step === 0}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Prev
            </Button>
            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Close tour
            </button>
            <Button
              size="sm"
              className="h-7 text-xs bg-ember hover:bg-ember/90 text-white"
              onClick={advance}
            >
              {step === total - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

function TourHighlight({ targetId }: { targetId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect(r);
    }
  }, [targetId]);

  if (!rect) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none rounded-xl ring-2 ring-ember ring-offset-2 ring-offset-transparent animate-pulse"
      style={{
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }}
    />
  );
}

// ─── Deal Sheet ───────────────────────────────────────────────────────────────

function DealSheet({ deal, onClose }: { deal: Deal | null; onClose: () => void }) {
  return (
    <Sheet open={deal !== null} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md bg-[hsl(230_20%_5%)] border-border/60 overflow-y-auto">
        {deal ? (
          <>
            <SheetHeader className="pb-4 border-b border-border/60">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-lg font-medium">{deal.company}</SheetTitle>
                  <p className="mt-1 text-2xl font-medium tracking-tight text-foreground">
                    ${(deal.value / 1000).toFixed(0)}K
                  </p>
                </div>
                <PriorityBadge priority={deal.priority} />
              </div>
            </SheetHeader>
            <div className="py-4 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Stage", value: deal.stage },
                  { label: "Owner", value: deal.owner },
                  { label: "Last activity", value: deal.lastActivity },
                  { label: "Value", value: `$${(deal.value / 1000).toFixed(0)}K` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-border/60 bg-card/30 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">{label}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border/60 bg-card/30 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-2">AI Notes</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{deal.notes}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">Timeline</p>
                <div className="relative pl-4 space-y-3">
                  <div className="absolute left-1.5 top-1 bottom-1 w-px bg-border/60" />
                  {deal.timeline.map((t, i) => (
                    <div key={i} className="relative flex gap-3">
                      <div className="absolute -left-[11px] top-1 h-2 w-2 rounded-full border-2 border-ember bg-background" />
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground">{t.date}</p>
                        <p className="text-sm text-foreground/85">{t.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                className="w-full bg-ember hover:bg-ember/90 text-white"
                onClick={() => { toast.success(`Opening full deal record for ${deal.company}`); onClose(); }}
              >
                Open Full Record
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

// ─── Workflow Sheet ────────────────────────────────────────────────────────────

function WorkflowSheet({ workflow, onClose }: { workflow: WorkflowEntry | null; onClose: () => void }) {
  return (
    <Sheet open={workflow !== null} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md bg-[hsl(230_20%_5%)] border-border/60 overflow-y-auto">
        {workflow ? (
          <>
            <SheetHeader className="pb-4 border-b border-border/60">
              <SheetTitle className="text-lg font-medium">{workflow.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
            </SheetHeader>
            <div className="py-4 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Trigger", value: workflow.trigger },
                  { label: "Status", value: workflow.status },
                  { label: "Last Run", value: workflow.lastRun },
                  { label: "Total Runs", value: workflow.runCount.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-border/60 bg-card/30 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">{label}</p>
                    <p className={cn("mt-1 text-sm font-medium capitalize", value === "active" && "text-[hsl(140_70%_55%)]", value === "paused" && "text-muted-foreground")}>{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">Action Steps</p>
                <ol className="space-y-2">
                  {workflow.steps.map((step, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/20 px-3 py-2.5">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-ember/20 font-mono text-[10px] text-ember">{i + 1}</span>
                      <span className="text-sm text-foreground/85">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

// ─── Tab: Command ──────────────────────────────────────────────────────────────

function CommandTab({ activity, onCmdK }: { activity: ActivityItem[]; onCmdK: () => void }) {
  const kpis = [
    { label: "Pipeline value", val: "$1.84M", delta: "+12.4%", icon: DollarSign },
    { label: "Win rate", val: "38.2%", delta: "+4.1pt", icon: TrendingUp },
    { label: "Active deals", val: "127", delta: "+8", icon: Users },
    { label: "Hours reclaimed", val: "412", delta: "this wk", icon: Zap },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col flex-none border-r border-border/60 p-3 space-y-3 overflow-y-auto">
        <div className="rounded-xl border border-border/60 bg-background/40 p-3">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Today</p>
          {[
            { label: "Inbox triage", count: 24, dot: "bg-ember" },
            { label: "Pipeline review", count: 7, dot: "bg-ice" },
            { label: "Renewals due", count: 3, dot: "bg-[hsl(140_70%_55%)]" },
            { label: "Agent escalations", count: 1, dot: "bg-red-500" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => toast.info(`Opening ${item.label}`)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-foreground/80 transition-colors hover:bg-secondary/60"
            >
              <span className="flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", item.dot)} />
                {item.label}
              </span>
              <span className="font-mono text-muted-foreground">{item.count}</span>
            </button>
          ))}
        </div>
        <div id="tour-agents-sidebar" className="rounded-xl border border-border/60 bg-background/40 p-3">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Agents online</p>
          {AGENTS.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs">
              <span className="flex items-center gap-2 text-foreground/80">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                {a.name} / {a.role}
              </span>
              <span className={cn("font-mono text-[10px]", a.status === "running" ? "text-[hsl(140_70%_55%)]" : "text-muted-foreground")}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={onCmdK}
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <Command className="h-3.5 w-3.5" />
          <span>Command palette</span>
          <kbd className="ml-auto font-mono text-[10px] border border-border rounded px-1">⌘K</kbd>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* KPIs */}
        <div id="tour-kpis" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {kpis.map((k, idx) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className="rounded-xl border border-border/60 bg-background/40 p-4 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(0_0%_0%/0.3)] transition-all cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">{k.label}</span>
                <k.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-medium tracking-tight">{k.val}</p>
                <span className="font-mono text-[10px] text-[hsl(140_70%_60%)]">{k.delta}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {/* Sparkline */}
          <motion.div
            id="tour-chart"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="col-span-1 lg:col-span-3 rounded-xl border border-border/60 bg-background/40 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  Revenue velocity · 30d
                </p>
                <p className="mt-1 text-xl font-medium tracking-tight">
                  $384,210 <span className="text-sm text-muted-foreground">/ week</span>
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-[hsl(140_70%_55%)]/30 bg-[hsl(140_70%_55%)]/10 px-2 py-0.5 font-mono text-[10px] text-[hsl(140_70%_60%)]">
                <ArrowUpRight className="h-3 w-3" /> +64%
              </span>
            </div>
            <div className="relative mt-4 h-[80px] w-full overflow-hidden">
              <svg viewBox="0 0 280 72" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="dg1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(221 79% 48%)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="hsl(221 79% 48%)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="dg2" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="hsl(221 79% 48%)" />
                    <stop offset="100%" stopColor="hsl(192 90% 70%)" />
                  </linearGradient>
                </defs>
                <path d={`${TREND_PATH} L 280,72 L 0,72 Z`} fill="url(#dg1)" />
                <path d={TREND_PATH} fill="none" stroke="url(#dg2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="280" cy="8" r="3" fill="hsl(221 79% 48%)">
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground/60">
              {["w-30", "w-28", "w-26", "w-24", "w-22", "now"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </motion.div>

          {/* Activity feed */}
          <motion.div
            id="tour-activity"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="col-span-1 lg:col-span-2 rounded-xl border border-border/60 bg-background/40 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Live activity</p>
              <PulsingDot color="green" />
            </div>
            <ul className="space-y-2.5 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {activity.slice(0, 6).map((row) => (
                  <motion.li
                    key={row.id}
                    initial={{ opacity: 0, y: -16, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-start gap-2.5 text-xs"
                  >
                    <ActivityDot dot={row.dot} />
                    <span className="flex-1 text-foreground/85">{row.text}</span>
                    <span className="font-mono text-[10px] text-muted-foreground/70 flex-none">{row.t}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>

        {/* Pipeline bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="rounded-xl border border-border/60 bg-background/40 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Pipeline · weighted</p>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              <Sparkles className="h-2.5 w-2.5 text-ember" /> AI-prioritized
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {PIPELINE_COLUMNS.map((s, idx) => {
              const pct = Math.round((s.raw / 420000) * 70);
              return (
                <div key={s.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono uppercase tracking-[0.15em] text-muted-foreground/70">{s.stage}</span>
                    <span className="font-mono text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="relative h-14 overflow-hidden rounded-md border border-border/60 bg-secondary/30">
                    <motion.div
                      className="absolute inset-x-0 bottom-0"
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: 0.5 + idx * 0.08, duration: 0.7, ease: "easeOut" }}
                      style={{ background: "linear-gradient(180deg, hsl(221 79% 48% / 0.55), hsl(221 79% 48% / 0.15))" }}
                    />
                  </div>
                  <p className="text-xs font-medium">{s.value}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Tab: Pipeline ─────────────────────────────────────────────────────────────

function PipelineTab() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-header */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 flex-none">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">Total weighted pipeline</p>
          <span className="text-xl font-medium tracking-tight text-foreground">$1.84M</span>
          <span className="flex items-center gap-1 rounded-full border border-border bg-muted/20 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            <Sparkles className="h-2.5 w-2.5 text-ember" /> AI-prioritized
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Filter className="h-3 w-3" /> Filter
          </Button>
          <Button size="sm" className="h-7 text-xs gap-1.5 bg-ember hover:bg-ember/90 text-white">
            <Plus className="h-3 w-3" /> New Deal
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-3 p-4 min-w-max">
          {PIPELINE_COLUMNS.map((col) => {
            const deals = ALL_DEALS.filter((d) => d.stage === col.stage);
            return (
              <div key={col.stage} className="flex flex-col w-56 flex-none">
                {/* Column header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{col.stage}</span>
                    <p className="text-sm font-medium mt-0.5">{col.value}</p>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/60 font-mono text-[10px] text-muted-foreground">
                    {col.count}
                  </span>
                </div>
                {/* Cards */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {deals.map((deal, i) => (
                    <motion.button
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -2, boxShadow: "0 8px 24px hsl(0 0% 0% / 0.4)" }}
                      onClick={() => setSelectedDeal(deal)}
                      className="w-full text-left rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-border/80"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-medium leading-tight">{deal.company}</p>
                        <PriorityBadge priority={deal.priority} />
                      </div>
                      <p className="text-lg font-medium tracking-tight">${(deal.value / 1000).toFixed(0)}K</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <OwnerAvatar initials={deal.ownerInitials} />
                          <span className="font-mono text-[10px] text-muted-foreground">{deal.lastActivity}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DealSheet deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
    </div>
  );
}

// ─── Tab: Agents ───────────────────────────────────────────────────────────────

function AgentsTab() {
  const [agents, setAgents] = useState<AgentEntry[]>(AGENTS);
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [running, setRunning] = useState<string | null>(null);
  const runTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (runTimeout.current) {
        window.clearTimeout(runTimeout.current);
      }
    };
  }, []);

  function handleRunNow(agent: AgentEntry) {
    if (runTimeout.current) {
      window.clearTimeout(runTimeout.current);
    }
    setRunning(agent.id);
    toast.loading(`Running ${agent.name}...`, { id: `run-${agent.id}` });
    runTimeout.current = window.setTimeout(() => {
      runTimeout.current = null;
      setRunning(null);
      const newEntry: LogEntry = {
        id: `l-${Date.now()}`,
        ts: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        agent: agent.name,
        action: `Manual run triggered`,
        outcome: "Completed",
      };
      setLog((prev) => [newEntry, ...prev]);
      setAgents((prev) => prev.map((a) => a.id === agent.id ? { ...a, tasksToday: a.tasksToday + 1, lastAction: "Manual run completed" } : a));
      toast.success(`${agent.name} completed successfully`, { id: `run-${agent.id}` });
    }, 2200);
  }

  const running2 = agents.filter((a) => a.status === "running").length;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 flex-none">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">Agent Console</p>
          <span className="flex items-center gap-1.5 rounded-full border border-[hsl(140_70%_55%)]/30 bg-[hsl(140_70%_55%)]/10 px-2 py-0.5 font-mono text-[10px] text-[hsl(140_70%_60%)]">
            <PulsingDot color="green" /> {running2}/3 running
          </span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
          <Settings className="h-3 w-3" /> Configure
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border/60 bg-background/40 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60"
                    style={{ background: `${agent.color}20` }}
                  >
                    <Bot className="h-4 w-4" style={{ color: agent.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <Badge variant="outline" className="mt-0.5 h-4 px-1.5 font-mono text-[10px]">{agent.role}</Badge>
                  </div>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] border", agent.status === "running" ? "border-[hsl(140_70%_55%)]/30 bg-[hsl(140_70%_55%)]/10 text-[hsl(140_70%_60%)]" : "border-border text-muted-foreground bg-muted/20")}>
                  {agent.status === "running" ? <PulsingDot color="green" /> : <Circle className="h-1.5 w-1.5 fill-current" />}
                  {agent.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tasks today</span>
                  <span className="font-mono font-medium">{agent.tasksToday}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-0.5">Last action</span>
                  <span className="text-foreground/80 text-[11px] leading-snug">{agent.lastAction}</span>
                </div>
              </div>
              <Button
                size="sm"
                className={cn("w-full h-7 text-xs gap-1.5", running === agent.id ? "bg-muted text-muted-foreground" : "bg-ember hover:bg-ember/90 text-white")}
                onClick={() => handleRunNow(agent)}
                disabled={running !== null}
              >
                {running === agent.id ? (
                  <><RefreshCw className="h-3 w-3 animate-spin" /> Running...</>
                ) : (
                  <><Play className="h-3 w-3" /> Run Now</>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Log table */}
        <div className="rounded-xl border border-border/60 bg-background/40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Recent Agent Actions</p>
            <span className="font-mono text-[10px] text-muted-foreground">{log.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40">
                  {["Time", "Agent", "Action", "Outcome"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {log.slice(0, 10).map((entry) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, backgroundColor: "hsl(221 79% 48% / 0.15)" }}
                      animate={{ opacity: 1, backgroundColor: "transparent" }}
                      transition={{ duration: 0.6 }}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{entry.ts}</td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-md border border-border/60 bg-muted/20 px-1.5 py-0.5 font-mono text-[10px]">{entry.agent}</span>
                      </td>
                      <td className="px-4 py-2.5 text-foreground/85">{entry.action}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("font-mono text-[10px]", entry.outcome === "Completed" || entry.outcome === "Sent" ? "text-[hsl(140_70%_60%)]" : entry.outcome === "In progress" ? "text-ice" : "text-muted-foreground")}>
                          {entry.outcome}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Workflows ────────────────────────────────────────────────────────────

function WorkflowsTab() {
  const [workflows, setWorkflows] = useState<WorkflowEntry[]>(WORKFLOWS);
  const [selected, setSelected] = useState<WorkflowEntry | null>(null);

  function toggleStatus(id: string) {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w
      )
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 flex-none">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">Workflows</p>
          <span className="font-mono text-[10px] text-muted-foreground">
            {workflows.filter((w) => w.status === "active").length} active · {workflows.length} total
          </span>
        </div>
        <Button
          size="sm"
          className="h-7 text-xs gap-1.5 bg-ember hover:bg-ember/90 text-white"
          onClick={() => toast.info("Coming soon in your environment")}
        >
          <Plus className="h-3 w-3" /> New Workflow
        </Button>
      </div>

      <div className="p-4">
        <div className="rounded-xl border border-border/60 bg-background/40 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_140px_150px_150px_80px_60px] gap-3 px-4 py-2.5 border-b border-border/40">
            {["Workflow", "Trigger", "Last Run", "Next Run", "Runs", ""].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-border/30">
            {workflows.map((wf, i) => (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col md:grid md:grid-cols-[1fr_140px_150px_150px_80px_60px] gap-2 md:gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => setSelected(wf)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("h-2 w-2 rounded-full flex-none", wf.status === "active" ? "bg-[hsl(140_70%_55%)]" : "bg-muted-foreground/40")} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{wf.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate md:hidden">{wf.trigger}</p>
                  </div>
                </div>
                <span className="hidden md:block text-xs text-muted-foreground self-center">{wf.trigger}</span>
                <span className="hidden md:block font-mono text-[11px] text-muted-foreground self-center">{wf.lastRun}</span>
                <span className="hidden md:block font-mono text-[11px] text-muted-foreground self-center">{wf.nextRun}</span>
                <span className="hidden md:block font-mono text-xs text-foreground/80 self-center">{wf.runCount.toLocaleString()}</span>
                <div
                  className="flex items-center self-center"
                  onClick={(e) => { e.stopPropagation(); toggleStatus(wf.id); }}
                >
                  <Switch
                    checked={wf.status === "active"}
                    onCheckedChange={() => toggleStatus(wf.id)}
                    className="data-[state=checked]:bg-[hsl(140_70%_45%)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <WorkflowSheet workflow={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─── Top Bar ───────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "command", label: "Command", icon: Activity },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "workflows", label: "Workflows", icon: Workflow },
];

// ─── Main Demo Page ────────────────────────────────────────────────────────────

export default function Demo() {
  const [activeTab, setActiveTab] = useState<TabId>("command");
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [tourActive, setTourActive] = useState<boolean>(false);
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  // ⌘K listener
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === "Escape") setCmdOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Live activity feed updates
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.hidden) return;

      const rand = RANDOM_ACTIVITIES[Math.floor(Math.random() * RANDOM_ACTIVITIES.length)];
      const newItem: ActivityItem = {
        id: `a-${Date.now()}`,
        dot: rand.dot,
        text: rand.text,
        t: "now",
      };
      setActivity((prev) => {
        const updated = prev.map((a, i) => {
          if (a.t === "now") return { ...a, t: "1m" };
          if (a.t === "1m") return { ...a, t: "4m" };
          if (a.t === "4m") return { ...a, t: "8m" };
          if (a.t === "8m") return { ...a, t: "12m" };
          return a;
        });
        return [newItem, ...updated.slice(0, 5)];
      });
    }, 8000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex items-center border-b border-border/60 bg-[hsl(230_20%_4%)] px-4 h-12 flex-none z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6 flex-none">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ember">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-medium text-sm tracking-tight">Momentum OS</span>
        </div>

        {/* Tab nav */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 h-8 text-xs transition-colors flex-none",
                activeTab === tab.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {activeTab === tab.id ? (
                <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_6px_hsl(221_79%_48%)]" />
              ) : null}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-none ml-4">
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/20 px-2.5 h-7 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <Command className="h-3 w-3" />
            <span>⌘K</span>
          </button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5"
            onClick={() => { setActiveTab("command"); setTourActive(true); }}
          >
            <Sparkles className="h-3 w-3 text-ember" />
            <span className="hidden sm:inline">Guided Tour</span>
          </Button>
          <span className="flex items-center gap-1.5 rounded-full border border-[hsl(140_70%_55%)]/30 bg-[hsl(140_70%_55%)]/10 px-2.5 h-6 font-mono text-[10px] text-[hsl(140_70%_60%)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(140_70%_55%)] animate-pulse shadow-[0_0_6px_hsl(140_70%_55%)]" />
            Production
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 overflow-hidden"
          >
            {activeTab === "command" ? (
              <CommandTab activity={activity} onCmdK={() => setCmdOpen(true)} />
            ) : activeTab === "pipeline" ? (
              <PipelineTab />
            ) : activeTab === "agents" ? (
              <AgentsTab />
            ) : (
              <WorkflowsTab />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Status bar */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between border-t border-border/40 bg-[hsl(230_20%_4%)] px-4 h-7 z-20">
          <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1.5">
              <Circle className="h-1.5 w-1.5 fill-[hsl(140_70%_55%)] text-[hsl(140_70%_55%)]" />
              All systems nominal
            </span>
            <span>·</span>
            <span>17 workflows · 3 agents · 4 integrations</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-muted-foreground/60">Momentum AI</span>
            <Sparkles className="h-3 w-3 text-ember" />
            <span className="text-foreground/60">Ready</span>
          </div>
        </div>
      </div>

      {/* ── Modals / Overlays ── */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <AnimatePresence>
        {tourActive ? (
          <GuidedTour onClose={() => setTourActive(false)} />
        ) : null}
      </AnimatePresence>

      {/* Subtle scanline */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute inset-x-0 h-40 animate-scan opacity-[0.03]"
          style={{ background: "linear-gradient(180deg, transparent, hsl(192 90% 70%), transparent)" }}
        />
      </div>
    </div>
  );
}
