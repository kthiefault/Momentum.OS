import { useSession } from "../../lib/auth-client";
import { User, Globe, ExternalLink, Shield, Zap, GitBranch, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <User className="h-4 w-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Profile</h2>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() ?? "K"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name ?? "Kenny T"}</p>
              <p className="text-sm text-gray-500">{user?.email ?? "kennyt@admin.com"}</p>
              <span className="inline-flex items-center gap-1 mt-1 rounded-full px-2 py-0.5 text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/20">
                <Shield className="h-3 w-3" />
                Admin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                {user?.name ?? "Kenny T"}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                {user?.email ?? "kennyt@admin.com"}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600">Profile editing coming soon.</p>
        </div>
      </div>

      {/* Site Information */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Site Information</h2>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product Name</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-purple-400" />
                Momentum.OS
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                Business Automation SaaS
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Focus Areas</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                AI Integration, CRM, Workflows
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Admin Version</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Quick Links</h2>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <Zap className="h-4 w-4 text-purple-400" />
            </div>
            Dashboard
          </Link>
          <Link
            to="/admin/workflows"
            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <GitBranch className="h-4 w-4 text-blue-400" />
            </div>
            Workflows
          </Link>
          <Link
            to="/admin/leads"
            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            Leads
          </Link>
        </div>
      </div>
    </div>
  );
}
