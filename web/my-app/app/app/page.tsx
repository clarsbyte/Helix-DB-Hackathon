'use client';

import { GraphView } from '@/components/GraphView';
import { VoiceSidebar } from '@/components/VoiceSidebar';
import { mockGraphData } from '@/data/mockGraphData';
import { GraphControlProvider } from '@/contexts/GraphControlContext';
// import { useEffect, useState } from 'react';

// Toggle this to switch between mock data and real Helix data
const USE_HELIX_DATA = false;

export default function DashboardPage() {
  // MOCK DATA MODE (currently active)
  const graphData = mockGraphData;

  // HELIX DATA MODE (uncomment to activate)
  // const [graphData, setGraphData] = useState<any>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!USE_HELIX_DATA) return;
  //
  //   async function fetchGraphData() {
  //     try {
  //       const response = await fetch('/api/graph');
  //       const data = await response.json();
  //       setGraphData(data);
  //     } catch (error) {
  //       console.error('Failed to fetch graph data:', error);
  //       setGraphData({ nodes: [], links: [] });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchGraphData();
  // }, []);

  // if (USE_HELIX_DATA && loading) {
  //   return (
  //     <main className="flex w-full h-screen bg-[#05070d] items-center justify-center">
  //       <div className="text-emerald-400 text-lg">Loading Universe...</div>
  //     </main>
  //   );
  // }

  return (
    <GraphControlProvider>
      <main className="flex w-full h-screen bg-[#05070d] overflow-hidden font-sans selection:bg-white/15">
        {/* Left: Graph Visualization */}
        <div className="flex-1 relative">
          <GraphView data={graphData} />

          {/* Minimal Header */}
          <div className="absolute top-7 left-7 pointer-events-none z-10">
            <div className="inline-flex items-center gap-2 rounded-xl bg-black/50 px-3 py-2 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                N-Mapper Graph
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-200">
              <span className="text-white font-semibold">Live Canvas courses</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{USE_HELIX_DATA ? `${graphData?.nodes?.length || 0} nodes` : '10 active courses'}</span>
            </div>
          </div>

          {/* Minimal Bottom Controls */}
          <div className="absolute bottom-7 left-7 pointer-events-none z-10">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.28em]">
              {graphData?.nodes?.length || 0} nodes mapped
            </div>
          </div>
        </div>

        {/* Right: Voice Agent Sidebar */}
        <div className="shrink-0 z-20 border-l border-white/5 bg-black/50 backdrop-blur">
          <VoiceSidebar />
        </div>
      </main>
    </GraphControlProvider>
  );
}
