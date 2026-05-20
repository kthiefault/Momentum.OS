import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GitBranch, Users, TrendingUp, Activity, ArrowRight, Play, Clock } from "lucide-react";
import { mockStore, type Workflow, type Lead } from "../../lib/mock-data";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  paused: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  draft: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  new: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  contacted: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  qualified: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/15 text-red-400 border-red-500/20",
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function WorkflowRow({ wf }: { wf: Workflow }) {
  const timeAgo = wf.lastRunAt
    ? new Date(wf.lastRunAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Never";

  return (
    <tr className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-sm text-white font-medium">{wf.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[wf.status] ?? statusColors.draft}`}>
          {wf.status}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Play className="h-3 w-3" />
          {wf.runCount} runs
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </div>
      </td>
    </tr>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  return (
    <tr className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm text-white font-medium">{lead.name}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-400">{lead.email}</p>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-gray-500 capitalize">{lead.source}</span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[lead.status] ?? statusColors.new}`}>
          {lead.status}
        </span>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockStore.getWorkflows());
  const [leads, setLeads] = useState<Lead[]>(mockStore.getLeads());

  useEffect(() => {
    const unsub = mockStore.subscribe(() => {
      setWorkflows(mockStore.getWorkflows());
      setLeads(mockStore.getLeads());
    });
    return () => { unsub(); };
  }, []);

  const totalWorkflows = workflows.length;
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const recentWorkflows = workflows.slice(0, 5);
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Workflows"
          value={totalWorkflows}
          icon={GitBranch}
          color="bg-purple-500/15 text-purple-400"
        />
        <StatCard
          label="Active Workflows"
          value={activeWorkflows}
          icon={Activity}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <StatCard
          label="Total Leads"
          value={totalLeads}
          icon={Users}
          color="bg-blue-500/15 text-blue-400"
        />
        <StatCard
          label="New Leads"
          value={newLeads}
          icon={TrendingUp}
          color="bg-orange-500/15 text-orange-400"
        />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workflows */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Recent Workflows</h2>
            <Link
              to="/admin/workflows"
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Runs</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Last Run</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkflows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-600">No workflows yet</td>
                </tr>
              ) : (
                recentWorkflows.map((wf) => <WorkflowRow key={wf.id} wf={wf} />)
              )}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-800">
            <Link
              to="/admin/workflows"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
            >
              <GitBranch className="h-3.5 w-3.5" />
              Create Workflow
            </Link>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
            <Link
              to="/admin/leads"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Email</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Source</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-600">No leads yet</td>
                </tr>
              ) : (
                recentLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
              )}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-800">
            <Link
              to="/admin/leads"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
            >
              <Users className="h-3.5 w-3.5" />
              View All Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
