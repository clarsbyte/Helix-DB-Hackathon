"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpUser, confirmSignUpUser } = useAuth();

  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const result = await signUpUser(formData.email, formData.password, formData.name);

    setLoading(false);

    if (result.success) {
      if (result.needsConfirmation) {
        setStep("confirm");
      } else {
        router.push("/login");
      }
    } else {
      setError(result.error || "Failed to sign up");
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!confirmationCode) {
      setError("Confirmation code is required");
      return;
    }

    setLoading(true);

    const result = await confirmSignUpUser(formData.email, confirmationCode);

    setLoading(false);

    if (result.success) {
      router.push("/login?confirmed=true");
    } else {
      setError(result.error || "Failed to confirm sign up");
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
              <h1 className="text-2xl font-bold text-white">
                {step === "signup" ? "Create Account" : "Verify Email"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {step === "signup"
                  ? "Join thousands of students using N-Mapper"
                  : "Enter the verification code sent to your email"}
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {step === "signup" ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                      Full Name (Optional)
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="John Doe"
                    />
                  </div>

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
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="Min. 8 characters"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="Repeat password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirm} className="space-y-4">
                  <div>
                    <label
                      htmlFor="confirmationCode"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Verification Code
                    </label>
                    <input
                      id="confirmationCode"
                      type="text"
                      required
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-mono tracking-wider text-white placeholder-slate-500 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Check your email ({formData.email}) for the verification code
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("signup")}
                    className="w-full rounded-lg border border-white/14 bg-white/6 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Back to Sign Up
                  </button>
                </form>
              )}

              {step === "signup" && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
                      Sign In
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </main>
  );
}
