import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
            <Zap className="h-4 w-4 fill-black text-black" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">Momentum.OS</span>
        </div>
        <Link
          to="/sign-in"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Already a customer?{" "}
          <span className="font-medium text-amber-500 hover:text-amber-400">Sign In</span>
        </Link>
      </div>
    </header>
  );
}
