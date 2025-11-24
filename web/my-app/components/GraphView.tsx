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

  const handleNodeClick = useCallback((node: any) => {
    const distance = 500;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    graphRef.current?.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1500
    );
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      // Physics: Compact Orb Layout
      // 1. Reduce repulsion so nodes can be closer
      graphRef.current.d3Force('charge').strength(-8);

      // 2. Shorter links for tighter connections
      graphRef.current.d3Force('link').distance(15);

      // 3. Radial Force: Smaller, tighter orb
      graphRef.current.d3Force('radial', d3.forceRadial(60).strength(1.2));
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
    <div ref={containerRef} className="w-full h-full">
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
    </div>
  );
}
