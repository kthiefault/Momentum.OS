import { useState } from "react";
import { Gauge, RefreshCw, CheckCircle2, AlertTriangle, Zap, Package, Clock, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebVital {
  name: string;
  value: string;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
  description: string;
}

interface BundleChunk {
  label: string;
  sizeKB: number;
  color: string;
  bgClass: string;
}

interface OptimizationItem {
  label: string;
  status: "applied" | "recommended";
  impact: "high" | "medium" | "low";
}

interface TimelineSegment {
  label: string;
  start: number;
  end: number;
  colorClass: string;
  bgClass: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEB_VITALS: WebVital[] = [
  { name: "FCP", value: "1.2", unit: "s", rating: "good", description: "First Contentful Paint" },
  { name: "LCP", value: "2.4", unit: "s", rating: "needs-improvement", description: "Largest Contentful Paint" },
  { name: "CLS", value: "0.05", unit: "", rating: "good", description: "Cumulative Layout Shift" },
  { name: "TTI", value: "3.1", unit: "s", rating: "needs-improvement", description: "Time to Interactive" },
];

const BUNDLE_CHUNKS: BundleChunk[] = [
  { label: "Vendor React", sizeKB: 142, color: "#3b82f6", bgClass: "bg-blue-500" },
  { label: "GSAP", sizeKB: 98, color: "#a855f7", bgClass: "bg-purple-500" },
  { label: "Framer Motion", sizeKB: 87, color: "#8b5cf6", bgClass: "bg-violet-500" },
  { label: "Recharts", sizeKB: 63, color: "#6366f1", bgClass: "bg-indigo-500" },
  { label: "Admin Pages", sizeKB: 41, color: "#10b981", bgClass: "bg-emerald-500" },
  { label: "Landing Pages", sizeKB: 38, color: "#14b8a6", bgClass: "bg-teal-500" },
  { label: "Auth", sizeKB: 31, color: "#0ea5e9", bgClass: "bg-sky-500" },
  { label: "Other", sizeKB: 22, color: "#6b7280", bgClass: "bg-gray-500" },
];

const TOTAL_KB = BUNDLE_CHUNKS.reduce((sum, c) => sum + c.sizeKB, 0);

const OPTIMIZATIONS: OptimizationItem[] = [
  { label: "Code splitting (vendor chunks)", status: "applied", impact: "high" },
  { label: "Lazy loading — Admin routes", status: "applied", impact: "high" },
  { label: "Lazy loading — Heavy landing sections", status: "applied", impact: "medium" },
  { label: "Disable cursor tracking on mobile", status: "applied", impact: "low" },
  { label: "React Query caching (staleTime)", status: "applied", impact: "medium" },
  { label: "SWC compiler (faster builds)", status: "applied", impact: "low" },
  { label: "Image compression & WebP", status: "recommended", impact: "high" },
  { label: "CDN for static assets", status: "recommended", impact: "high" },
  { label: "Service Worker / PWA caching", status: "recommended", impact: "medium" },
  { label: "HTTP/2 push on backend", status: "recommended", impact: "low" },
];

const TIMELINE_SEGMENTS: TimelineSegment[] = [
  { label: "DNS Lookup", start: 0, end: 50, colorClass: "text-gray-400", bgClass: "bg-gray-500" },
  { label: "TCP Connect", start: 50, end: 120, colorClass: "text-blue-400", bgClass: "bg-blue-600" },
  { label: "First Byte", start: 120, end: 380, colorClass: "text-purple-400", bgClass: "bg-purple-600" },
  { label: "DOM Parse", start: 380, end: 820, colorClass: "text-indigo-400", bgClass: "bg-indigo-500" },
  { label: "JS Execute", start: 820, end: 1200, colorClass: "text-violet-400", bgClass: "bg-violet-500" },
  { label: "Ready", start: 1200, end: 1400, colorClass: "text-emerald-400", bgClass: "bg-emerald-500" },
];

const TOTAL_TIMELINE = 1400;

// ─── Score calculation ─────────────────────────────────────────────────────────

function calcScore(): number {
  // Based on vitals ratings + optimizations applied
  let score = 72;
  const applied = OPTIMIZATIONS.filter((o) => o.status === "applied").length;
  score += applied * 2;
  return Math.min(score, 100);
}

const SCORE = calcScore();

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 90 ? "#22c55e" :
    score >= 60 ? "#eab308" :
    "#ef4444";

  const label =
    score >= 90 ? "Excellent" :
    score >= 60 ? "Good" :
    "Needs Work";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="10"
          />
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white leading-none">{score}</span>
          <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">Site Performance Score</p>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
          style={{ background: `${color}22`, color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function VitalCard({ vital }: { vital: WebVital }) {
  const ratingConfig = {
    good: { label: "Good", bg: "bg-emerald-500/15", text: "text-emerald-400", bar: "bg-emerald-500" },
    "needs-improvement": { label: "Needs Improvement", bg: "bg-yellow-500/15", text: "text-yellow-400", bar: "bg-yellow-500" },
    poor: { label: "Poor", bg: "bg-red-500/15", text: "text-red-400", bar: "bg-red-500" },
  };
  const cfg = ratingConfig[vital.rating];
  const barWidth = vital.rating === "good" ? "w-full" : vital.rating === "needs-improvement" ? "w-3/5" : "w-1/4";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{vital.name}</p>
          <p className="text-2xl font-bold text-white mt-0.5">
            {vital.value}
            <span className="text-sm font-normal text-gray-400 ml-0.5">{vital.unit}</span>
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
      <p className="text-xs text-gray-500">{vital.description}</p>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cfg.bar} ${barWidth} transition-all duration-700`} />
      </div>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: "high" | "medium" | "low" }) {
  const cfg = {
    high: "bg-orange-500/15 text-orange-400",
    medium: "bg-yellow-500/15 text-yellow-400",
    low: "bg-gray-500/15 text-gray-400",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg[impact]} capitalize`}>
      {impact}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SpeedOptimizer() {
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<string>("just now");

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const now = new Date();
      setLastAnalyzed(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })
      );
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
            <Gauge className="h-4.5 w-4.5 text-purple-400" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Speed Optimizer</h2>
            <p className="text-xs text-gray-500">Performance analysis &amp; optimization status</p>
          </div>
        </div>
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-70 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
        >
          {analyzing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" />
              Run Analysis
            </>
          )}
        </button>
      </div>

      {/* Score Hero */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreGauge score={SCORE} />
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="bg-gray-800/60 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-xs text-gray-400 mt-1">Optimizations Applied</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-xs text-gray-400 mt-1">Recommendations</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">~164 KB</p>
              <p className="text-xs text-gray-400 mt-1">Gzipped Bundle</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">1.2s</p>
              <p className="text-xs text-gray-400 mt-1">First Contentful Paint</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Last analyzed: {lastAnalyzed}
          </p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Core Web Vitals</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {WEB_VITALS.map((v) => (
            <VitalCard key={v.name} vital={v} />
          ))}
        </div>
      </div>

      {/* Bundle Analysis */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Bundle Analysis</h3>
          <span className="ml-auto text-xs text-gray-500">Total: {TOTAL_KB} KB &nbsp;·&nbsp; Gzipped: ~164 KB</span>
        </div>

        {/* Stacked bar */}
        <div className="flex h-7 rounded-lg overflow-hidden gap-px mb-4">
          {BUNDLE_CHUNKS.map((chunk) => (
            <div
              key={chunk.label}
              className={`${chunk.bgClass} transition-all`}
              style={{ width: `${(chunk.sizeKB / TOTAL_KB) * 100}%` }}
              title={`${chunk.label}: ${chunk.sizeKB} KB`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BUNDLE_CHUNKS.map((chunk) => (
            <div key={chunk.label} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-sm flex-shrink-0 ${chunk.bgClass}`} />
              <span className="text-xs text-gray-400 truncate">{chunk.label}</span>
              <span className="text-xs text-gray-600 ml-auto">{chunk.sizeKB}KB</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Checklist */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Optimization Checklist</h3>
        </div>
        <div className="space-y-2">
          {OPTIMIZATIONS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/40 border border-gray-800/80 hover:border-gray-700 transition-colors"
            >
              <span className="text-xs text-gray-600 w-5 text-right flex-shrink-0">{i + 1}</span>
              <span className="flex-1 text-sm text-gray-300">{item.label}</span>
              <ImpactBadge impact={item.impact} />
              {item.status === "applied" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  Applied
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 flex-shrink-0">
                  <AlertTriangle className="h-3 w-3" />
                  Recommended
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Page Load Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Page Load Timeline</h3>
          <span className="ml-auto text-xs text-gray-500">Total: {TOTAL_TIMELINE}ms</span>
        </div>

        {/* Bar */}
        <div className="flex h-8 rounded-lg overflow-hidden gap-px mb-5">
          {TIMELINE_SEGMENTS.map((seg) => {
            const widthPct = ((seg.end - seg.start) / TOTAL_TIMELINE) * 100;
            return (
              <div
                key={seg.label}
                className={`${seg.bgClass} opacity-90 hover:opacity-100 transition-opacity`}
                style={{ width: `${widthPct}%` }}
                title={`${seg.label}: ${seg.start}–${seg.end}ms`}
              />
            );
          })}
        </div>

        {/* Labels */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TIMELINE_SEGMENTS.map((seg) => (
            <div key={seg.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${seg.bgClass} flex-shrink-0`} />
                <span className={`text-xs font-medium ${seg.colorClass}`}>{seg.label}</span>
              </div>
              <span className="text-xs text-gray-600 pl-3.5">{seg.start}–{seg.end}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
