'use client';

import { GraphView } from '@/components/GraphView';
import { VoiceSidebar } from '@/components/VoiceSidebar';
import { mockGraphData } from '@/data/mockGraphData';
import { GraphControlProvider } from '@/contexts/GraphControlContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FileUploadModal from '@/components/FileUploadModal';
import { useEffect, useState } from 'react';

// Toggle this to switch between mock data and real Helix data
const USE_HELIX_DATA = true;

export default function DashboardPage() {
  // HELIX DATA MODE (active)
  const [graphData, setGraphData] = useState<any>(USE_HELIX_DATA ? null : mockGraphData);
  const [loading, setLoading] = useState(USE_HELIX_DATA);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchGraphData = async () => {
    if (!USE_HELIX_DATA) return;

    try {
      setLoading(true);
      const response = await fetch('/api/graph');
      const data = await response.json();
      setGraphData(data);
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
      setGraphData({ nodes: [], links: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  if (USE_HELIX_DATA && loading) {
    return (
      <main className="flex w-full h-screen bg-[#05070d] items-center justify-center">
        <div className="text-emerald-400 text-lg">Loading Universe...</div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <GraphControlProvider>
        <main className="flex w-full h-screen bg-[#05070d] overflow-hidden font-sans selection:bg-white/15">
          {/* Left: Graph Visualization */}
          <div className="flex-1 relative">
            <GraphView data={graphData} onGraphUpdate={fetchGraphData} />

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

            {/* Upload Button */}
            <div className="absolute bottom-7 right-7 z-10">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="pointer-events-auto flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-105 hover:bg-emerald-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload PDFs
              </button>
            </div>
          </div>

          {/* Right: Voice Agent Sidebar */}
          <div className="shrink-0 z-20 border-l border-white/5 bg-black/50 backdrop-blur">
            <VoiceSidebar />
          </div>
        </main>

        {/* Upload Modal */}
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            // Refresh graph data after upload
            fetchGraphData();
          }}
        />
      </GraphControlProvider>
    </ProtectedRoute>
  );
}
