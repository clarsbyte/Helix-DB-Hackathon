"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const handleScroll = () => {
      const nextScale = Math.min(1.1, 0.8 + window.scrollY / 200);
      setScale(nextScale);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-[90vh] overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 0)",
          backgroundSize: "22px 22px",
          opacity: 0.75,
          maskImage: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
        }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.5))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-6 pb-14 pt-8">
        <nav className="mt-1 w-[88%] rounded-2xl border border-white/10 bg-black/35 px-6 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:w-[78%] md:w-[72%]">
          <div className="flex items-center justify-between text-sm font-semibold tracking-tight">
            <div className="flex items-center gap-3 text-white">
              <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/8 px-4 text-base font-semibold text-white">
                N-Mapper
              </span>
              <span className="hidden rounded-xl border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-200/70 sm:inline-flex">
                Canvas voice graph
              </span>
            </div>
            <Link
              href="/app"
              className="rounded-xl border border-white/14 bg-white/6 px-5 py-2 text-white transition hover:-translate-y-0.5 hover:border-emerald-200/80 hover:text-emerald-100"
            >
              Dashboard →
            </Link>
          </div>
        </nav>

        <section className="mt-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-slate-200/80">
            Live academic graph
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[52px]">
            Learning Made Efficient
          </h1>
          <p className="mt-3 text-lg font-medium text-emerald-200">
            Play School Like A Game
          </p>
          <div className="relative mt-8 flex items-center gap-4">
            <Link
              href="/app"
              className="relative inline-flex items-center justify-center rounded-xl bg-emerald-400 px-8 py-3 text-base font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              Start Now
            </Link>
            <span className="relative text-sm text-slate-300">Join 5000+ students today</span>
          </div>
        </section>

        <section className="relative mt-12 w-full max-w-4xl">
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-150"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              aspectRatio: '16/9'
            }}
          >
            <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-200">
                  N-Mapper
                </span>
                <span className="text-slate-400">Dashboard preview</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Synced
              </div>
            </div>

            <div className="relative mt-3 grid gap-3 lg:grid-cols-[200px,1fr]">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-slate-400">
                  Navigation
                </p>
                <ul className="space-y-2 text-slate-200">
                  <li className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 ring-1 ring-emerald-300/30">
                    <span>Overview</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">7.5</span>
                  </li>
                  <li className="rounded-xl px-3 py-2 text-slate-400">Assignments</li>
                  <li className="rounded-xl px-3 py-2 text-slate-400">Notes</li>
                  <li className="rounded-xl px-3 py-2 text-slate-400">Notifications</li>
                  <li className="rounded-xl px-3 py-2 text-slate-400">Settings</li>
                </ul>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-slate-400">
                    <span>Term due assignments</span>
                    <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-sm font-semibold">Calculus worksheet</p>
                      <p className="text-xs text-slate-400">Due in 3 days</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-sm font-semibold">Physics lab report</p>
                      <p className="text-xs text-slate-400">Due Friday</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-rows-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-100">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-emerald-200">
                      <span>GPA Gladiator</span>
                      <span>Lvl 7</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-4xl font-bold text-white">7.5</p>
                        <p className="text-xs text-emerald-200">On trajectory</p>
                      </div>
                      <div className="h-20 w-20 rounded-full border border-emerald-300/40 bg-black/40 p-4 text-center text-xs text-emerald-100">
                        82% complete
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
                    <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Recent wins</div>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="rounded-lg bg-white/5 px-3 py-2">AI project: A+</p>
                      <p className="rounded-lg bg-white/5 px-3 py-2">Chemistry quiz: 92%</p>
                      <p className="rounded-lg bg-white/5 px-3 py-2">Essay draft submitted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mt-20 w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Courses, Visualized
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              Navigate your academic journey like never before
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">
                🎯
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">3D Graph View</h3>
              <p className="text-sm text-slate-300">
                See all your courses, modules, and assignments as an interactive 3D network. Every node is clickable and explorable.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">
                🎤
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Voice Navigation</h3>
              <p className="text-sm text-slate-300">
                "Show me Math 18" or "What's due this week?" - navigate your entire academic graph with just your voice.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">
                🔗
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">URL-Addressable</h3>
              <p className="text-sm text-slate-300">
                Every course, module, and assignment has its own URL. Bookmark anything, share with friends, jump instantly.
              </p>
            </div>
          </div>
        </section>

        <section className="relative mt-20 w-full max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-8 backdrop-blur-xl md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live Canvas Sync
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Always Up to Date
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  N-Mapper automatically syncs with Canvas LMS. New assignments, updated deadlines, course changes - everything stays current in real-time.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      ✓
                    </div>
                    <span className="text-sm text-slate-300">Auto-sync every 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      ✓
                    </div>
                    <span className="text-sm text-slate-300">Offline-friendly local storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      ✓
                    </div>
                    <span className="text-sm text-slate-300">Works with any Canvas instance</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-slate-400">Synced 3 courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-slate-400">Updated 12 modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-slate-400">Fetched 47 assignments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse text-blue-400">⟳</span>
                      <span className="text-slate-400">Next sync in 4:32</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mt-20 w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              From Canvas to Graph in Three Steps
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-purple-500/50 md:left-1/2" />

            <div className="space-y-8">
              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div className="order-1 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Connect Canvas</h3>
                  <p className="text-sm text-slate-300">
                    Add your Canvas API token once. We'll securely fetch all your courses, modules, assignments, and pages.
                  </p>
                </div>
                <div className="order-2 hidden md:block" />
              </div>

              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div className="order-1 hidden md:block" />
                <div className="order-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Build Your Graph</h3>
                  <p className="text-sm text-slate-300">
                    N-Mapper transforms your courses into a 3D node graph. Each course gets a unique color, creating distinct visual clusters.
                  </p>
                </div>
              </div>

              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div className="order-1 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-lg font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Navigate & Explore</h3>
                  <p className="text-sm text-slate-300">
                    Zoom, pan, click nodes, or use voice commands to navigate. Every element is interactive and leads you exactly where you need.
                  </p>
                </div>
                <div className="order-2 hidden md:block" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative mt-20 mb-16 w-full max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-8 text-center backdrop-blur-xl md:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Level Up Your Learning?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Join thousands of students navigating their courses smarter
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-8 py-3 text-base font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/14 bg-white/6 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              No credit card required • Works with any Canvas instance • Built for UC San Diego
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
