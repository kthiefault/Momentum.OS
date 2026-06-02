import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/lib/api";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState<boolean>(false);
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setAllowed(false);
      setChecked(true);
      return () => {
        cancelled = true;
      };
    }

    api
      .get("/api/admin/stats")
      .then(() => {
        if (!cancelled) setAllowed(true);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        if (!cancelled) setAllowed(false);
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!allowed) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
}
