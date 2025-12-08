"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInUser, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Show success message if coming from successful confirmation
    if (searchParams.get("confirmed") === "true") {
      setSuccessMessage("Email verified successfully! Please sign in.");
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/app");
    }
  }, [searchParams, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    const result = await signInUser(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      router.push("/app");
    } else {
      setError(result.error || "Failed to sign in");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 0)",
            backgroundSize: "22px 22px",
            opacity: 0.75,
            maskImage:
              "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.5))]" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/8 px-4 py-2 text-lg font-semibold text-white transition hover:bg-white/12"
            >
              ← N-Mapper
            </Link>
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/5 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="mt-1 text-sm text-slate-400">Sign in to your N-Mapper account</p>
            </div>

            <div className="p-6">
              {successMessage && (
                <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#05070d] px-2 text-slate-500">Or</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-semibold text-emerald-400 hover:text-emerald-300">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Protected by AWS Cognito • Secure Authentication
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
