import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

async function fetchSession(): Promise<SessionUser | null> {
  const baseURL = import.meta.env.VITE_BACKEND_URL || "";
  const res = await fetch(`${baseURL}/api/auth/get-session`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user ?? null;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isPending } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false,
    staleTime: 30_000,
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
}
