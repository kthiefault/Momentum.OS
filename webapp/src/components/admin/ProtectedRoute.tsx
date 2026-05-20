import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState<boolean>(false);
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllowed(!!localStorage.getItem("admin_token"));
      setChecked(true);
    }, 300);
    return () => clearTimeout(timer);
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
