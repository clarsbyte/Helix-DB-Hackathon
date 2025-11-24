'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SpriteText from 'three-spritetext';
import * as d3 from 'd3';
import { useGraphControl } from '@/contexts/GraphControlContext';

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

export function GraphView({ data }: { data: GraphData }) {
  const { graphRef } = useGraphControl();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<any>(null);

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
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                        Source File
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        {selectedNode.filename}
                      </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
