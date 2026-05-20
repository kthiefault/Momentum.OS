import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ember">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">Momentum.OS</span>
        </div>
        <Link
          to="/sign-in"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Already a customer?{" "}
          <span className="font-medium text-ember hover:text-ember/80">Sign In</span>
        </Link>
      </div>
    </header>
  );
}
