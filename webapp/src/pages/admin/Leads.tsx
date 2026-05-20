import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, Users, Mail, Phone, Globe, Filter } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  contacted: { label: "Contacted", className: "bg-purple-500/15 text-purple-400 border border-purple-500/20" },
  qualified: { label: "Qualified", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  lost: { label: "Lost", className: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

const ALL_STATUSES = ["all", "new", "contacted", "qualified", "lost"] as const;
type StatusFilter = typeof ALL_STATUSES[number];

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.new;
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", cfg.className)}>
      {cfg.label}
    </span>
  );
}

function InlineStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (status: string) => api.put(`/api/leads/${leadId}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  return (
    <select
      value={currentStatus}
      onChange={(e) => mutation.mutate(e.target.value)}
      disabled={mutation.isPending}
      className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 cursor-pointer"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="qualified">Qualified</option>
      <option value="lost">Lost</option>
    </select>
  );
}

export default function Leads() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => api.get<Lead[]>("/api/leads"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/leads/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Lead deleted");
      setDeletingLead(null);
    },
    onError: () => toast.error("Failed to delete lead"),
  });

  const filtered = (leads ?? []).filter(
    (l) => statusFilter === "all" || l.status === statusFilter
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Leads
            {leads ? (
              <span className="ml-2 text-base font-normal text-gray-500">({leads.length})</span>
            ) : null}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage your pipeline leads</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>Showing {filtered.length} leads</span>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit flex-wrap">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
              statusFilter === s
                ? "bg-gray-800 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            {s}
            <span className="ml-1.5 text-xs text-gray-600">
              {s === "all"
                ? (leads ?? []).length
                : (leads ?? []).filter((l) => l.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-gray-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No leads found</p>
            <p className="text-sm text-gray-600 mt-1">
              {statusFilter === "all" ? "Leads will appear here when they come in" : `No ${statusFilter} leads`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Source</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Notes</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-purple-300">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Mail className="h-3 w-3 text-gray-600" />
                          {lead.email}
                        </div>
                        {lead.phone ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="h-3 w-3 text-gray-600" />
                            {lead.phone}
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 capitalize">
                        <Globe className="h-3 w-3 text-gray-600" />
                        {lead.source}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={lead.status} />
                        <InlineStatusSelect leadId={lead.id} currentStatus={lead.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="text-xs text-gray-500 truncate">
                        {lead.notes ?? <span className="text-gray-700 italic">No notes</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{formatDate(lead.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeletingLead(lead)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingLead} onOpenChange={(o) => { if (!o) setDeletingLead(null); }}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Lead</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{deletingLead?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingLead && deleteMutation.mutate(deletingLead.id)}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
