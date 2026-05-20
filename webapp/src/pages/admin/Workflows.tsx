import { useState, useEffect } from "react";
import {
  Plus, Play, Pencil, Trash2, GitBranch, Clock, Zap, Webhook, Calendar,
  MousePointer, ChevronDown, X, Check, Loader2
} from "lucide-react";
import { mockStore, type Workflow } from "../../lib/mock-data";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  name: string;
  type: "trigger" | "condition" | "action";
}

interface WorkflowFormData {
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  triggerType: "manual" | "scheduled" | "webhook" | "form";
  category: "automation" | "ai" | "crm" | "notification" | "custom";
  steps: WorkflowStep[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  paused: { label: "Paused", className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20" },
  draft: { label: "Draft", className: "bg-gray-500/15 text-gray-400 border border-gray-600/30" },
};

const categoryConfig: Record<string, { label: string; className: string }> = {
  automation: { label: "Automation", className: "bg-purple-500/15 text-purple-400 border border-purple-500/20" },
  ai: { label: "AI", className: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  crm: { label: "CRM", className: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" },
  notification: { label: "Notification", className: "bg-orange-500/15 text-orange-400 border border-orange-500/20" },
  custom: { label: "Custom", className: "bg-pink-500/15 text-pink-400 border border-pink-500/20" },
};

const triggerIcons: Record<string, React.ElementType> = {
  manual: MousePointer,
  scheduled: Calendar,
  webhook: Webhook,
  form: Zap,
};

const FILTER_TABS = ["all", "active", "paused", "draft"] as const;
type FilterTab = typeof FILTER_TABS[number];

const defaultForm: WorkflowFormData = {
  name: "",
  description: "",
  status: "draft",
  triggerType: "manual",
  category: "automation",
  steps: [{ name: "Trigger", type: "trigger" }],
};

function WorkflowCard({
  wf,
  onRun,
  onEdit,
  onDelete,
  isRunning,
}: {
  wf: Workflow;
  onRun: (id: string) => void;
  onEdit: (wf: Workflow) => void;
  onDelete: (wf: Workflow) => void;
  isRunning: boolean;
}) {
  const TriggerIcon = triggerIcons[wf.triggerType] ?? Zap;
  const statusCfg = statusConfig[wf.status] ?? statusConfig.draft;
  const catCfg = categoryConfig[wf.category] ?? categoryConfig.custom;

  const lastRun = wf.lastRunAt
    ? new Date(wf.lastRunAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Never";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusCfg.className)}>
              {statusCfg.label}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", catCfg.className)}>
              {catCfg.label}
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug mt-2">{wf.name}</h3>
          {wf.description ? (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{wf.description}</p>
          ) : null}
        </div>
        <div className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
          <GitBranch className="h-4 w-4 text-purple-400" />
        </div>
      </div>

      {/* Trigger + stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <TriggerIcon className="h-3.5 w-3.5" />
          <span className="capitalize">{wf.triggerType}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Play className="h-3.5 w-3.5" />
          {wf.runCount} runs
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {lastRun}
        </div>
      </div>

      {/* Steps preview */}
      {wf.steps && wf.steps.length > 0 ? (
        <div className="flex items-center gap-1 overflow-hidden">
          {wf.steps.slice(0, 4).map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-xs text-gray-400 whitespace-nowrap max-w-[80px] truncate">
                {step.name}
              </span>
              {i < Math.min(wf.steps.length - 1, 3) ? (
                <ChevronDown className="h-3 w-3 text-gray-600 rotate-[-90deg]" />
              ) : null}
            </div>
          ))}
          {wf.steps.length > 4 ? (
            <span className="text-xs text-gray-600">+{wf.steps.length - 4} more</span>
          ) : null}
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
        <button
          onClick={() => onRun(wf.id)}
          disabled={isRunning}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-purple-600/15 text-purple-400 border border-purple-500/20 hover:bg-purple-600/25 transition-all disabled:opacity-50"
        >
          {isRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
          Run
        </button>
        <button
          onClick={() => onEdit(wf)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={() => onDelete(wf)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function WorkflowFormModal({
  open,
  onClose,
  editingWorkflow,
}: {
  open: boolean;
  onClose: () => void;
  editingWorkflow: Workflow | null;
}) {
  const isEdit = !!editingWorkflow;
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [form, setForm] = useState<WorkflowFormData>(() =>
    editingWorkflow
      ? {
          name: editingWorkflow.name,
          description: editingWorkflow.description ?? "",
          status: editingWorkflow.status,
          triggerType: editingWorkflow.triggerType,
          category: editingWorkflow.category,
          steps: editingWorkflow.steps ?? [],
        }
      : defaultForm
  );

  const addStep = () => {
    setForm((f) => ({
      ...f,
      steps: [...f.steps, { name: "", type: "action" }],
    }));
  };

  const removeStep = (i: number) => {
    setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
  };

  const updateStep = (i: number, field: keyof WorkflowStep, value: string) => {
    setForm((f) => ({
      ...f,
      steps: f.steps.map((s, idx) =>
        idx === i ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (isEdit && editingWorkflow) {
      mockStore.updateWorkflow(editingWorkflow.id, form);
      toast.success("Workflow updated!");
    } else {
      mockStore.addWorkflow({
        id: Date.now().toString(),
        ...form,
        runCount: 0,
        lastRunAt: null,
        createdAt: new Date().toISOString(),
      });
      toast.success("Workflow created!");
    }
    setIsSaving(false);
    onClose();
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit Workflow" : "New Workflow"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Lead Nurture Sequence"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What does this workflow do?"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-none"
            />
          </div>

          {/* Status / Trigger / Category row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as WorkflowFormData["status"] }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Trigger</label>
              <select
                value={form.triggerType}
                onChange={(e) => setForm((f) => ({ ...f, triggerType: e.target.value as WorkflowFormData["triggerType"] }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
                <option value="webhook">Webhook</option>
                <option value="form">Form</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as WorkflowFormData["category"] }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="automation">Automation</option>
                <option value="ai">AI</option>
                <option value="crm">CRM</option>
                <option value="notification">Notification</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Steps</label>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {form.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-5 text-right">{i + 1}.</span>
                  <input
                    value={step.name}
                    onChange={(e) => updateStep(i, "name", e.target.value)}
                    placeholder="Step name"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                  <select
                    value={step.type}
                    onChange={(e) => updateStep(i, "type", e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="trigger">Trigger</option>
                    <option value="condition">Condition</option>
                    <option value="action">Action</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            {isEdit ? "Save Changes" : "Create Workflow"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockStore.getWorkflows());
  const [filter, setFilter] = useState<FilterTab>("all");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [deletingWorkflow, setDeletingWorkflow] = useState<Workflow | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = mockStore.subscribe(() => {
      setWorkflows(mockStore.getWorkflows());
    });
    return () => { unsub(); };
  }, []);

  const handleRun = async (id: string) => {
    setRunningId(id);
    await new Promise((r) => setTimeout(r, 800));
    mockStore.updateWorkflow(id, {
      runCount: (mockStore.getWorkflows().find((w) => w.id === id)?.runCount ?? 0) + 1,
      lastRunAt: new Date().toISOString(),
    });
    toast.success("Workflow executed successfully");
    setRunningId(null);
  };

  const handleEdit = (wf: Workflow) => {
    setEditingWorkflow(wf);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingWorkflow(null);
  };

  const handleDelete = () => {
    if (deletingWorkflow) {
      mockStore.deleteWorkflow(deletingWorkflow.id);
      toast.success("Workflow deleted");
      setDeletingWorkflow(null);
    }
  };

  const filtered = workflows.filter(
    (wf) => filter === "all" || wf.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Workflow Station</h2>
          <p className="text-sm text-gray-500 mt-0.5">Build and manage your automation pipelines</p>
        </div>
        <button
          onClick={() => { setEditingWorkflow(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-purple-900/30"
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
              filter === tab
                ? "bg-gray-800 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            {tab}
            {tab !== "all" ? (
              <span className="ml-1.5 text-xs text-gray-600">
                {workflows.filter((w) => w.status === tab).length}
              </span>
            ) : (
              <span className="ml-1.5 text-xs text-gray-600">{workflows.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <GitBranch className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">No workflows found</p>
          <p className="text-sm text-gray-600 mt-1">
            {filter === "all" ? "Create your first workflow to get started" : `No ${filter} workflows`}
          </p>
          {filter === "all" ? (
            <button
              onClick={() => { setEditingWorkflow(null); setModalOpen(true); }}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600/15 text-purple-400 border border-purple-500/20 rounded-lg text-sm hover:bg-purple-600/25 transition-all"
            >
              <Plus className="h-4 w-4" /> Create Workflow
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((wf) => (
            <WorkflowCard
              key={wf.id}
              wf={wf}
              onRun={handleRun}
              onEdit={handleEdit}
              onDelete={setDeletingWorkflow}
              isRunning={runningId === wf.id}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <WorkflowFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        editingWorkflow={editingWorkflow}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingWorkflow} onOpenChange={(o) => { if (!o) setDeletingWorkflow(null); }}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{deletingWorkflow?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
