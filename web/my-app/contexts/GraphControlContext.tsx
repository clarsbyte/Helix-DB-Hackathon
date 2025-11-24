'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';

interface GraphControlContextType {
  graphRef: React.MutableRefObject<any>;
  zoomToNode: (nodeId: string) => void;
  searchNode: (query: string) => any;
  focusOnCourse: (courseName: string) => void;
  resetView: () => void;
}

const GraphControlContext = createContext<GraphControlContextType | null>(null);

export function GraphControlProvider({ children }: { children: ReactNode }) {
  const graphRef = useRef<any>();

  const zoomToNode = (nodeId: string) => {
    if (!graphRef.current) return;

    const graphData = graphRef.current.graphData();
    const node = graphData.nodes.find((n: any) => n.id === nodeId);

    if (node) {
      const distance = 500;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1500
      );
    }
  };

  const searchNode = (query: string) => {
    if (!graphRef.current) return null;

    const graphData = graphRef.current.graphData();
    const lowerQuery = query.toLowerCase();

    return graphData.nodes.find((n: any) =>
      n.name.toLowerCase().includes(lowerQuery) ||
      n.id.toLowerCase().includes(lowerQuery)
    );
  };

  const focusOnCourse = (courseName: string) => {
    if (!graphRef.current) return;

    const graphData = graphRef.current.graphData();
    const lowerCourseName = courseName.toLowerCase();

    const course = graphData.nodes.find((n: any) =>
      n.type === 'course' && n.name.toLowerCase().includes(lowerCourseName)
    );

    if (course) {
      zoomToNode(course.id);
    }
  };

  const resetView = () => {
    if (!graphRef.current) return;

    graphRef.current.cameraPosition(
      { x: 0, y: 0, z: 400 },
      { x: 0, y: 0, z: 0 },
      1500
    );
  };

  return (
    <GraphControlContext.Provider value={{ graphRef, zoomToNode, searchNode, focusOnCourse, resetView }}>
      {children}
    </GraphControlContext.Provider>
  );
}

export function useGraphControl() {
  const context = useContext(GraphControlContext);
  if (!context) {
    throw new Error('useGraphControl must be used within GraphControlProvider');
  }
  return context;
}
