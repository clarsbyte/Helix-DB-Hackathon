'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SpriteText from 'three-spritetext';
import * as d3 from 'd3';
import { useGraphControl } from '@/contexts/GraphControlContext';
import { useAuth } from '@/contexts/AuthContext';
import { deletePdf } from '@/lib/pdf-api';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-emerald-400">Loading Universe...</div>
});

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    color: string;
    val: number;
    summary?: string;
    filename?: string;
    upload_date?: string;
    fx?: number;
    fy?: number;
    fz?: number;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
}

export function GraphView({
  data,
  onGraphUpdate,
}: {
  data: GraphData;
  onGraphUpdate?: () => Promise<void>;
}) {
  const { graphRef } = useGraphControl();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleDownloadPdf = async () => {
    if (!selectedNode || !user?.userId) {
      console.error('No selected node or user');
      return;
    }

    // Extract PDF ID from node ID (format: "pdf_123")
    const pdfIdMatch = selectedNode.id.match(/pdf_(\d+)/);
    if (!pdfIdMatch) {
      console.error('Invalid PDF ID format');
      return;
    }

    const pdfId = parseInt(pdfIdMatch[1], 10);

    try {
      setLoadingDownload(true);

      // Fetch presigned URL from backend
      const response = await fetch(
        `http://localhost:8000/pdf/${pdfId}/download-url?user_id=${user.userId}`
      );

      const result = await response.json();

      if (result.status === 'success' && result.download_url) {
        // Open PDF in new tab
        window.open(result.download_url, '_blank');
      } else {
        console.error('Failed to get download URL:', result.message);
        alert('Failed to download PDF: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleNodeClick = useCallback((node: any) => {
    const distance = 500;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    graphRef.current?.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1500
    );

    // Set selected node to show details
    setSelectedNode(node);
  }, []);

  const handleDeletePdf = async () => {
    if (!selectedNode || !user?.userId) {
      setDeleteError('User not authenticated');
      return;
    }

    // Extract PDF ID from node ID (format: "pdf_123")
    const pdfIdMatch = selectedNode.id.match(/pdf_(\d+)/);
    if (!pdfIdMatch) {
      setDeleteError('Invalid PDF ID');
      return;
    }

    const pdfId = parseInt(pdfIdMatch[1], 10);

    setIsDeleting(true);
    setDeleteError(null);

    const result = await deletePdf(pdfId, user.userId);

    if (result.success) {
      // Success: close dialogs and refresh graph
      setConfirmDelete(false);
      setSelectedNode(null);
      setIsDeleting(false);

      if (onGraphUpdate) {
        await onGraphUpdate();
      }
    } else {
      // Error: show message
      setIsDeleting(false);
      setDeleteError(result.error || 'Failed to delete PDF');
    }
  };

  useEffect(() => {
    if (graphRef.current) {
      // Physics: Spread Out Layout
      // 1. Increase repulsion so nodes are pushed apart
      graphRef.current.d3Force('charge').strength(-120);

      // 2. Longer links for more spacing
      graphRef.current.d3Force('link').distance(80);

      // 3. Radial Force: Larger sphere
      graphRef.current.d3Force('radial', d3.forceRadial(200).strength(0.8));
    }
  }, []);

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph3D
          ref={graphRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}

          // Visuals
          backgroundColor="#05070d"
          showNavInfo={false}

          // Node Styling
          nodeThreeObject={(node: any) => {
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = node.val ? node.val / 2 : 6;
            sprite.fontFace = 'Space Grotesk, Space Mono, JetBrains Mono, monospace';
            sprite.fontWeight = '700';
            sprite.strokeWidth = 0.5;
            sprite.strokeColor = 'rgba(0, 0, 0, 0.8)';
            sprite.backgroundColor = 'transparent';
            return sprite;
          }}

          // Links
          linkColor={() => 'rgba(255,255,255,0.2)'}
          linkWidth={1.5}
          linkOpacity={0.4}

          // Interaction
          onNodeClick={handleNodeClick}

          // Physics
          d3VelocityDecay={0.3}
        />
      )}

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-7 right-7 max-w-md w-full pointer-events-auto z-20">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_18px_70px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b border-white/10">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-1">
                  PDF Document
                </div>
                <h3 className="text-lg font-bold text-white">
                  {selectedNode.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="ml-3 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Summary */}
              {selectedNode.summary && (
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] text-emerald-400 mb-2">
                    Summary
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {selectedNode.summary}
                  </p>
                </div>
              )}

              {/* Source Information */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                {selectedNode.filename && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1">
                        Source File
                      </div>
                      <button
                        onClick={handleDownloadPdf}
                        disabled={loadingDownload}
                        className="text-xs text-emerald-400 font-mono hover:text-emerald-300
                          transition-colors underline decoration-emerald-400/30 hover:decoration-emerald-300/50
                          disabled:opacity-50 disabled:cursor-not-allowed text-left break-all"
                      >
                        {loadingDownload ? 'Loading...' : selectedNode.filename}
                      </button>
                    </div>
                  </div>
                )}

                {selectedNode.upload_date && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                        Upload Date
                      </div>
                      <div className="text-xs text-slate-300">
                        {new Date(selectedNode.upload_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              {selectedNode.type === 'pdf' && (
                <div className="pt-4">
                  <button
                    onClick={() => setConfirmDelete(true)}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg
                      border border-red-500/30 bg-red-500/10 px-4 py-2.5
                      text-sm font-semibold text-red-400
                      transition hover:bg-red-500/20 hover:border-red-400/50
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? 'Deleting...' : 'Delete PDF'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10
            bg-[#05070d] shadow-[0_18px_70px_rgba(0,0,0,0.5)] overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Delete PDF</h3>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-slate-300">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-white">&quot;{selectedNode.name}&quot;</span>?
                This action cannot be undone.
              </p>
              {deleteError && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-300">{deleteError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex gap-3">
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-white/14 bg-white/5 px-4 py-2
                  text-sm font-semibold text-white transition hover:bg-white/10
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePdf}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2
                  text-sm font-semibold text-white transition hover:bg-red-600
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
