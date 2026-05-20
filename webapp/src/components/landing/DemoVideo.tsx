import { useState, useEffect, useRef, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Custom Hooks ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number = 1200, active: boolean = true): number {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    setValue(0);
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setValue(Math.round((target * current) / steps));
      if (current >= steps) {
        clearInterval(timer);
        setValue(target);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return value;
}

function useTypewriter(text: string, speed: number = 30, active: boolean = true): string {
  const [displayed, setDisplayed] = useState<string>("");

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, active]);

  return displayed;
}

// ─── Scene Sub-components ────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function PulsingDot({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      animate={{ scale: [1, 1.35, 1], opacity: [1, 0.7, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function MetricCard({
  label,
  value,
  change,
  active,
}: {
  label: string;
  value: string;
  change: string;
  active: boolean;
}) {
  const isPositive = change.startsWith("+") || change === "✓";
  return (
    <motion.div variants={itemVariants} className="bg-gray-800 border border-gray-700/50 rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className={`text-xs mt-1 font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {change}
      </div>
    </motion.div>
  );
}

// Scene 1: Command Center
function Scene1({ active }: { active: boolean }) {
  const agents = [
    { name: "Lead Qualifier", status: "Running", note: "Scored 14 leads", color: "#10B981" },
    { name: "Onboarding Bot", status: "Running", note: "3 clients active", color: "#10B981" },
    { name: "Email Composer", status: "Idle", note: "Next: 9:00 AM", color: "#F59E0B" },
    { name: "Deal Tracker", status: "Running", note: "2 deals updated", color: "#10B981" },
  ];
  const emailsSent = useCountUp(2847, 1200, active);
  const activeDeals = useCountUp(34, 1200, active);
  const tasksDone = useCountUp(891, 1200, active);

  return (
    <motion.div
      key={active ? "s1-active" : "s1"}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full"
    >
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Agents</div>
        {agents.map((a) => (
          <motion.div
            key={a.name}
            variants={itemVariants}
            className="bg-gray-800 border border-gray-700/50 rounded-lg px-3 py-2.5 flex items-center gap-3"
          >
            <PulsingDot color={a.color} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{a.name}</div>
              <div className="text-xs text-gray-400">{a.note}</div>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: a.color + "22",
                color: a.color,
              }}
            >
              {a.status}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 content-start">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 col-span-2">
          Live Metrics
        </div>
        <MetricCard label="Emails Sent" value={emailsSent.toLocaleString()} change="+18%" active={active} />
        <MetricCard label="Active Deals" value={String(activeDeals)} change="+12%" active={active} />
        <MetricCard label="Tasks Done" value={tasksDone.toLocaleString()} change="+24%" active={active} />
        <MetricCard label="Response Time" value="<2 min" change="✓" active={active} />
      </div>
    </motion.div>
  );
}

// Scene 2: Lead Automation
function Scene2({ active }: { active: boolean }) {
  const hotLeads = useCountUp(12, 1000, active);
  const warmLeads = useCountUp(28, 1000, active);
  const nurturing = useCountUp(47, 1000, active);

  const sources = [
    { label: "Website Form", icon: "🌐" },
    { label: "LinkedIn", icon: "💼" },
    { label: "Webinar", icon: "🎙️" },
    { label: "Events", icon: "📅" },
  ];

  return (
    <motion.div
      key={active ? "s2-active" : "s2"}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3 h-full"
    >
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead Sources</div>
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <motion.div
            key={s.label}
            variants={itemVariants}
            className="bg-gray-800 border border-gray-700/50 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm text-gray-300"
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="flex justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-400">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-lg px-4 py-3 text-center font-semibold text-white text-sm"
        style={{ background: "linear-gradient(135deg, #7C3AED, #6366F1)" }}
      >
        AI Scoring Engine
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-400">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        <motion.div variants={itemVariants} className="bg-gray-800 border border-red-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{hotLeads}</div>
          <div className="text-xs text-gray-400 mt-1">Hot Leads</div>
          <div className="text-xs text-gray-500 mt-0.5">Score 85+</div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-gray-800 border border-yellow-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{warmLeads}</div>
          <div className="text-xs text-gray-400 mt-1">Warm Leads</div>
          <div className="text-xs text-gray-500 mt-0.5">Score 60-84</div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-gray-800 border border-blue-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{nurturing}</div>
          <div className="text-xs text-gray-400 mt-1">Nurturing</div>
          <div className="text-xs text-gray-500 mt-0.5">Score &lt;60</div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center text-xs text-gray-400 pt-1">
        <span className="text-emerald-400 font-medium">&lt;2 min response</span>
        <span>·</span>
        <span className="text-purple-400 font-medium">3.2× conversion lift</span>
        <span>·</span>
        <span className="text-blue-400 font-medium">100% capture rate</span>
      </motion.div>
    </motion.div>
  );
}

// Scene 3: Client Onboarding
const timelineSteps = [
  { time: "0:00", label: "Contract Signed", status: "done" },
  { time: "+0:01 min", label: "Welcome Sequence Triggered", status: "done" },
  { time: "+0:02 min", label: "Workspace Created", status: "done" },
  { time: "+0:03 min", label: "Team Notified", status: "done" },
  { time: "+0:05 min", label: "Meeting Scheduled", status: "active" },
  { time: "+0:10 min", label: "Access Granted", status: "upcoming" },
];

function Scene3({ active }: { active: boolean }) {
  const [revealed, setRevealed] = useState<number>(0);

  useEffect(() => {
    if (!active) { setRevealed(0); return; }
    setRevealed(0);
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setRevealed(count);
      if (count >= timelineSteps.length) clearInterval(timer);
    }, 220);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <motion.div
      key={active ? "s3-active" : "s3"}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"
    >
      <div className="md:col-span-2 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Onboarding Timeline</div>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-700" />
          {timelineSteps.map((step, i) => {
            const isVisible = i < revealed;
            const isActive = step.status === "active";
            const isDone = step.status === "done";
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -8 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-start gap-3 pb-4"
              >
                <div
                  className="absolute -left-4 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: isDone ? "#10B981" : isActive ? "#3B82F6" : "#374151",
                    border: `2px solid ${isDone ? "#10B981" : isActive ? "#3B82F6" : "#4B5563"}`,
                  }}
                >
                  {isDone ? (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isActive ? (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-blue-300"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : null}
                </div>
                <div>
                  <div className="text-xs text-gray-500">{step.time}</div>
                  <div className={`text-sm font-medium ${isDone ? "text-white" : isActive ? "text-blue-300" : "text-gray-500"}`}>
                    {step.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 justify-center">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Results</div>
        {[
          { value: "92%", label: "faster onboarding", color: "#10B981" },
          { value: "0", label: "manual steps", color: "#8B5CF6" },
          { value: "100%", label: "completion rate", color: "#3B82F6" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="bg-gray-800 border border-gray-700/50 rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Scene 4: Operations Engine
function Scene4({ active }: { active: boolean }) {
  const columns = [
    {
      title: "Recurring",
      color: "#8B5CF6",
      tasks: [
        { icon: "📊", title: "Weekly reports", meta: "Every Mon 8AM" },
        { icon: "💳", title: "Invoice reminders", meta: "Net-30 trigger" },
        { icon: "📡", title: "Status updates", meta: "Daily 5PM" },
        { icon: "🔄", title: "Data sync", meta: "Every 6 hours" },
      ],
    },
    {
      title: "Escalations",
      color: "#F59E0B",
      tasks: [
        { icon: "💰", title: "Approval >$5k", meta: "Pending CFO" },
        { icon: "🚨", title: "High priority SLA", meta: "2hrs remaining" },
      ],
    },
    {
      title: "Completed",
      color: "#10B981",
      tasks: [
        { icon: "✅", title: "Q3 forecast deck", meta: "Done" },
        { icon: "✅", title: "Partner invoices", meta: "Done" },
        { icon: "✅", title: "Team standup", meta: "Done" },
        { icon: "✅", title: "Lead handoffs", meta: "Done" },
        { icon: "✅", title: "CRM sync", meta: "Done" },
      ],
    },
  ];

  return (
    <motion.div
      key={active ? "s4-active" : "s4"}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3 h-full"
    >
      <div className="grid grid-cols-3 gap-3 flex-1">
        {columns.map((col) => (
          <motion.div key={col.title} variants={itemVariants} className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: col.color }}>
              {col.title} <span className="text-gray-500">({col.tasks.length})</span>
            </div>
            {col.tasks.map((task, i) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: active ? i * 0.07 + 0.2 : 0, duration: 0.25 }}
                className="bg-gray-800 border border-gray-700/50 rounded-md px-2.5 py-2"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{task.icon}</span>
                  <span className="text-xs font-medium text-white truncate">{task.title}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 pl-5">{task.meta}</div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-2.5">
        <div className="text-xs text-gray-400 mb-1.5">Smart Routing Rules</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-gray-900 border border-gray-700 rounded px-2 py-0.5 text-gray-300">
            Amount &gt; $5k → <span className="text-purple-400">CFO</span>
          </span>
          <span className="bg-gray-900 border border-gray-700 rounded px-2 py-0.5 text-gray-300">
            Priority: High → <span className="text-yellow-400">Lead</span>
          </span>
          <span className="bg-gray-900 border border-gray-700 rounded px-2 py-0.5 text-gray-300">
            SLA breach → <span className="text-red-400">Manager</span>
          </span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-4 justify-center text-xs">
        <span className="text-emerald-400 font-medium">99.2% on-time</span>
        <span className="text-gray-600">·</span>
        <span className="text-purple-400 font-medium">40 hrs/week saved</span>
      </motion.div>
    </motion.div>
  );
}

// Scene 5: Communication AI
const emailBody = `Hi Sarah,

Following our call yesterday, I've prepared a custom proposal for Atlas Group's Q3 needs. Based on your team's current challenges with lead response time and manual reporting, I believe Momentum.OS can deliver immediate ROI within the first 30 days.

I'd love to walk you through the implementation plan.

Best regards,
Alex`;

function Scene5({ active }: { active: boolean }) {
  const typed = useTypewriter(emailBody, 22, active);

  return (
    <motion.div
      key={active ? "s5-active" : "s5"}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full"
    >
      <div className="md:col-span-2 flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Email Composer</div>
        <motion.div variants={itemVariants} className="bg-gray-800 border border-gray-700/50 rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="border-b border-gray-700/50 px-3 py-2 space-y-1.5">
            {[
              { label: "From", value: "alex@momentum.os" },
              { label: "To", value: "sarah@atlasgroup.com" },
              { label: "Subject", value: "Custom Q3 Proposal for Atlas Group" },
            ].map((row) => (
              <div key={row.label} className="flex gap-2 text-xs">
                <span className="text-gray-500 w-12 shrink-0">{row.label}:</span>
                <span className="text-gray-300">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-3 flex-1">
            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
              {typed}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-3 bg-purple-400 align-middle ml-0.5"
              />
            </pre>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-2 flex-wrap">
          {["Tone: Professional", "Context: Post-Call", "Personalized"].map((chip) => (
            <span
              key={chip}
              className="text-xs px-2.5 py-1 rounded-full border border-purple-500/40 text-purple-300 bg-purple-900/20"
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="flex flex-col gap-3 justify-center">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">AI Performance</div>
        {[
          { value: "98%", label: "response accuracy", color: "#10B981" },
          { value: "8 hrs", label: "saved per week", color: "#8B5CF6" },
          { value: "4.9★", label: "satisfaction score", color: "#F59E0B" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="bg-gray-800 border border-gray-700/50 rounded-lg p-3 text-center"
          >
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Scene 6: Revenue Intelligence
const barHeights = [35, 48, 42, 58, 65, 80];
const barMonths = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

function Scene6({ active }: { active: boolean }) {
  const revenue = useCountUp(847, 1200, active);
  const pipeline = useCountUp(24, 1200, active);
  const winRate = useCountUp(34, 1200, active);
  const churn = useCountUp(21, 1200, active);
  const [barsVisible, setBarsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!active) { setBarsVisible(false); return; }
    const t = setTimeout(() => setBarsVisible(true), 400);
    return () => clearTimeout(t);
  }, [active]);

  const kpis = [
    { label: "Revenue", value: `$${revenue}K`, change: "+23%", color: "#10B981" },
    { label: "Pipeline", value: `$${pipeline / 10}M`, change: "+18%", color: "#3B82F6" },
    { label: "Win Rate", value: `${winRate}%`, change: "+7%", color: "#8B5CF6" },
    { label: "Churn Risk", value: `${churn / 10}%`, change: "-0.8%", color: "#10B981" },
  ];

  return (
    <motion.div
      key={active ? "s6-active" : "s6"}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3 h-full"
    >
      <div className="grid grid-cols-4 gap-2">
        {kpis.map((k) => (
          <motion.div
            key={k.label}
            variants={itemVariants}
            className="bg-gray-800 border border-gray-700/50 rounded-lg p-2.5"
          >
            <div className="text-xs text-gray-400">{k.label}</div>
            <div className="text-lg font-bold text-white mt-0.5">{k.value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: k.color }}>{k.change}</div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-gray-800 border border-gray-700/50 rounded-lg p-3">
        <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Predictive Insights</div>
        <div className="space-y-1.5">
          <div className="text-xs text-gray-300">
            📈 Enterprise segment outperforming by <span className="text-emerald-400 font-semibold">31%</span>
          </div>
          <div className="text-xs text-gray-300">
            ⚡ Q4 forecast: <span className="text-purple-400 font-semibold">$1.2M</span> — 94% confidence
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gray-800 border border-gray-700/50 rounded-lg p-3 flex-1">
        <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Monthly Revenue Trend</div>
        <div className="flex items-end gap-2 h-20">
          {barHeights.map((h, i) => (
            <div key={barMonths[i]} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-sm"
                style={{ background: "linear-gradient(to top, #7C3AED, #6366F1)" }}
                initial={{ height: 0 }}
                animate={{ height: barsVisible ? `${h}%` : 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />
              <span className="text-xs text-gray-500">{barMonths[i]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Scene Registry ──────────────────────────────────────────────────────────

const SCENES = [
  {
    id: 1,
    title: "Command Center",
    subtitle: "One dashboard. Every signal.",
    Component: Scene1,
  },
  {
    id: 2,
    title: "Lead Automation",
    subtitle: "Capture. Score. Convert — automatically.",
    Component: Scene2,
  },
  {
    id: 3,
    title: "Client Onboarding",
    subtitle: "Zero-touch. 92% faster.",
    Component: Scene3,
  },
  {
    id: 4,
    title: "Operations Engine",
    subtitle: "40 hours saved. Every week.",
    Component: Scene4,
  },
  {
    id: 5,
    title: "Communication AI",
    subtitle: "AI writes it. You approve it.",
    Component: Scene5,
  },
  {
    id: 6,
    title: "Revenue Intelligence",
    subtitle: "Predict. Act. Win.",
    Component: Scene6,
  },
];

const SCENE_DURATION = 4000;

// ─── Browser Chrome ───────────────────────────────────────────────────────────

function BrowserChrome({ children, progress }: { children: React.ReactNode; progress: number }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-2xl shadow-purple-900/20 overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 bg-gray-800 rounded-md px-3 py-1 flex items-center gap-2 min-w-0">
          <svg className="w-3 h-3 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs text-gray-400 truncate">app.momentum.os/dashboard</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-800">
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(to right, #7C3AED, #6366F1)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Content */}
      <div className="p-4 min-h-[360px] md:min-h-[400px]">{children}</div>
    </div>
  );
}

// ─── Scene Controls ───────────────────────────────────────────────────────────

function SceneControls({
  total,
  current,
  playing,
  title,
  onSelect,
  onPrev,
  onNext,
  onTogglePlay,
}: {
  total: number;
  current: number;
  playing: boolean;
  title: string;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 mt-5">
      <div className="flex items-center gap-4 w-full justify-between">
        <button
          onClick={onPrev}
          className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
        >
          ◀ Prev
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className="transition-all duration-200"
            >
              <motion.div
                animate={{
                  width: i === current ? 20 : 8,
                  backgroundColor: i === current ? "#8B5CF6" : "#374151",
                }}
                className="h-2 rounded-full"
              />
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
        >
          Next ▶
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-800"
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <span className="text-sm text-gray-400">
          <span className="text-white font-medium">{title}</span>
          <span className="text-gray-600 mx-2">·</span>
          <span>
            {current + 1} / {total}
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DemoVideo() {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const startTimers = () => {
    clearTimers();
    setProgress(0);

    const tickMs = 50;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + (100 / (SCENE_DURATION / tickMs));
        return next >= 100 ? 100 : next;
      });
    }, tickMs);

    intervalRef.current = setInterval(() => {
      setCurrentScene((s) => (s + 1) % SCENES.length);
      setProgress(0);
    }, SCENE_DURATION);
  };

  useEffect(() => {
    if (playing) {
      startTimers();
    } else {
      clearTimers();
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const goTo = (index: number) => {
    setCurrentScene(index);
    setProgress(0);
    if (playing) {
      clearTimers();
      startTimers();
    }
  };

  const goNext = () => goTo((currentScene + 1) % SCENES.length);
  const goPrev = () => goTo((currentScene - 1 + SCENES.length) % SCENES.length);

  const scene = SCENES[currentScene];
  const SceneComponent = scene.Component;

  return (
    <section className="bg-gray-950 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-4"
          >
            Product Demo
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            See Momentum.OS in Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Watch how teams automate, scale, and compound results in 90 days
          </motion.p>
        </div>

        {/* Glow */}
        <div className="relative">
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-2xl"
            style={{ background: "radial-gradient(ellipse at 50% 80%, #7C3AED 0%, #3B82F6 50%, transparent 80%)" }}
          />

          {/* Browser */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <BrowserChrome progress={progress}>
              {/* Scene header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-lg font-bold text-white">{scene.title}</div>
                  <div className="text-sm text-gray-400">{scene.subtitle}</div>
                </div>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded border border-gray-700 hover:border-gray-600 flex items-center gap-1.5"
                >
                  {playing ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play
                    </>
                  )}
                </button>
              </div>

              {/* Animated scene */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <SceneComponent active={true} />
                </motion.div>
              </AnimatePresence>
            </BrowserChrome>
          </motion.div>

          {/* Controls */}
          <SceneControls
            total={SCENES.length}
            current={currentScene}
            playing={playing}
            title={scene.title}
            onSelect={goTo}
            onPrev={goPrev}
            onNext={goNext}
            onTogglePlay={() => setPlaying((p) => !p)}
          />
        </div>
      </div>
    </section>
  );
}
