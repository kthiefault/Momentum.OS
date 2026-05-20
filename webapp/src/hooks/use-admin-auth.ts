import { useSession } from "../lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useAdminAuth() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/sign-in");
    }
  }, [session, isPending, navigate]);

  const user = session?.user as ({ role?: string } | undefined);
  return { session, isPending, isAdmin: user?.role === "admin" };
}
