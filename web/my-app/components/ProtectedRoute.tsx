"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, checkUser } = useAuth();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  // Check authentication when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      await checkUser();
      setHasChecked(true);
    };
    verifyAuth();
  }, [checkUser]);

  // Redirect to login if not authenticated after check completes
  useEffect(() => {
    if (hasChecked && !loading && !isAuthenticated) {
      // Clear any invalid cookies before redirecting
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      }).finally(() => {
        router.push("/login");
      });
    }
  }, [isAuthenticated, loading, hasChecked, router]);

  // Show loading spinner while checking auth or before initial check
  if (!hasChecked || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070d]">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
