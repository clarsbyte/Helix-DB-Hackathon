# N-Mapper - Agent Workflows & Development Roles

This document defines specialized workflows for different development agents/roles working on the N-Mapper project. Each agent has specific responsibilities, tools, and decision-making authority.

---

## Agent Types

### 1. Frontend Agent
**Role**: UI/UX implementation, React/Next.js development

### 2. Backend Agent
**Role**: API integration, Helix DB schema, data transformation

### 3. Graph Visualization Agent
**Role**: 3D graph rendering, force simulation, interaction design

### 4. Voice AI Agent
**Role**: Speech recognition, NLP, intent processing

### 5. DevOps Agent
**Role**: Deployment, monitoring, performance optimization

### 6. QA Agent
**Role**: Testing, bug detection, user experience validation

---

## 1. Frontend Agent

### Responsibilities
- Implement UI components (React/Next.js)
- Style with Tailwind CSS v4
- Ensure responsive design
- Maintain design system consistency
- Handle routing and navigation

### Key Files
```
web/my-app/app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout
├── globals.css           # Tailwind + custom styles
└── app/
    └── page.tsx          # Dashboard
```

### Workflow

#### Creating a New Page
1. **Create Route File**:
   ```bash
   cd web/my-app/app
   mkdir <route-name>
   touch <route-name>/page.tsx
   ```

2. **Implement Component**:
   ```tsx
   export default function NewPage() {
     return (
       <main className="min-h-screen bg-[#05070d] text-white">
         {/* Content */}
       </main>
     );
   }
   ```

3. **Apply Design System**:
   - Background: `bg-[#05070d]`
   - Cards: `rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl`
   - Text: `text-slate-300`
   - Accents: `text-emerald-400`

4. **Test Responsiveness**:
   ```bash
   npm run dev
   # Test at: sm (640px), md (768px), lg (1024px), xl (1280px)
   ```

#### Adding a New Component
1. **Create Component File** (if reusable):
   ```bash
   mkdir -p web/my-app/components
   touch web/my-app/components/GraphView.tsx
   ```

2. **Component Structure**:
   ```tsx
   'use client';

   import { useState, useEffect } from 'react';

   interface GraphViewProps {
     data: GraphData;
   }

   export function GraphView({ data }: GraphViewProps) {
     // Component logic
     return <div>{/* JSX */}</div>;
   }
   ```

3. **Export from Index** (optional):
   ```ts
   // components/index.ts
   export { GraphView } from './GraphView';
   ```

#### Decision Authority
- ✅ Can modify: UI components, styling, animations
- ✅ Can create: New pages, components
- ⚠️ Coordinate with Backend Agent: API calls, data fetching
- ⚠️ Coordinate with Graph Agent: Graph component integration
- ❌ Cannot modify: Helix DB schema, backend logic

### Common Tasks

**Task**: Add a new navigation link
```tsx
// In layout.tsx or navigation component
<Link
  href="/new-route"
  className="rounded-xl border border-white/14 bg-white/6 px-5 py-2"
>
  New Page
</Link>
```

**Task**: Create a loading state
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    fetchData().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
    </div>;
  }

  return <main>{/* Content */}</main>;
}
```

---

## 2. Backend Agent

### Responsibilities
- Design and implement Helix DB schema
- Write database queries
- Integrate Canvas API
- Transform data for frontend consumption
- Handle API routing (Next.js API routes)

### Key Files
```
helix/
├── db/
│   ├── schema.hx         # Node/edge definitions
│   └── queries.hx        # Database queries
└── helix.toml            # Configuration

web/my-app/app/api/       # Next.js API routes (to be created)
```

### Workflow

#### Expanding Helix DB Schema

1. **Define New Node Type** (`helix/db/schema.hx`):
   ```hx
   N::Course {
     INDEX id: String,
     name: String,
     code: String,
     color: String,
     term: String,
     created_at: Date DEFAULT NOW
   }

   N::Module {
     INDEX id: String,
     name: String,
     position: Int,
     unlock_at: Date,
     created_at: Date DEFAULT NOW
   }
   ```

2. **Define Relationships**:
   ```hx
   R::CONTAINS {
     from: Course,
     to: Module
   }

   R::ENROLLED_IN {
     from: User,
     to: Course,
     role: String  // "student" | "teacher" | "ta"
   }
   ```

3. **Create Queries** (`helix/db/queries.hx`):
   ```hx
   // Create course
   QUERY createCourse(id: String, name: String, code: String, color: String) =>
     course <- AddN<Course>({
       id: id,
       name: name,
       code: code,
       color: color
     })
     RETURN course

   // Get course with modules
   QUERY getCourseWithModules(courseId: String) =>
     course <- N<Course>({id: courseId})
     modules <- N<Module>() -[R<CONTAINS>]- course
     RETURN {course, modules}
   ```

4. **Test Query**:
   ```bash
   cd helix
   helix query createCourse --args '{"id": "math18", "name": "Math 18", "code": "MATH 18", "color": "#ef4444"}'
   ```

#### Creating a Next.js API Route

1. **Create Route Handler** (`web/my-app/app/api/courses/route.ts`):
   ```ts
   import { NextResponse } from 'next/server';

   export async function GET(request: Request) {
     try {
       // Fetch from Helix DB
       const courses = await fetchFromHelix('getAllCourses');
       return NextResponse.json(courses);
     } catch (error) {
       return NextResponse.json(
         { error: 'Failed to fetch courses' },
         { status: 500 }
       );
     }
   }

   export async function POST(request: Request) {
     const body = await request.json();
     // Create course in Helix DB
     const course = await createInHelix('createCourse', body);
     return NextResponse.json(course);
   }
   ```

2. **Create Helix Client** (`web/my-app/lib/helix.ts`):
   ```ts
   const HELIX_URL = process.env.HELIX_URL || 'http://localhost:6969';

   export async function fetchFromHelix(queryName: string, args = {}) {
     const response = await fetch(`${HELIX_URL}/query/${queryName}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(args)
     });
     return response.json();
   }
   ```

#### Canvas API Integration

1. **Set Up Canvas Client** (`web/my-app/lib/canvas.ts`):
   ```ts
   const CANVAS_URL = process.env.CANVAS_URL;
   const CANVAS_TOKEN = process.env.CANVAS_ACCESS_TOKEN;

   export async function fetchCanvasCourses() {
     const response = await fetch(`${CANVAS_URL}/api/v1/courses`, {
       headers: {
         'Authorization': `Bearer ${CANVAS_TOKEN}`
       }
     });
     return response.json();
   }

   export async function fetchCourseModules(courseId: string) {
     const response = await fetch(
       `${CANVAS_URL}/api/v1/courses/${courseId}/modules`,
       { headers: { 'Authorization': `Bearer ${CANVAS_TOKEN}` } }
     );
     return response.json();
   }
   ```

2. **Sync Canvas → Helix** (`web/my-app/lib/sync.ts`):
   ```ts
   import { fetchCanvasCourses } from './canvas';
   import { createInHelix } from './helix';

   export async function syncCoursesToHelix() {
     const canvasCourses = await fetchCanvasCourses();

     for (const course of canvasCourses) {
       await createInHelix('createCourse', {
         id: course.id.toString(),
         name: course.name,
         code: course.course_code,
         color: generateCourseColor(course.id)
       });
     }
   }

   function generateCourseColor(id: number): string {
     // Deterministic color generation
     const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
     return colors[id % colors.length];
   }
   ```

3. **Create Sync Endpoint** (`web/my-app/app/api/sync/route.ts`):
   ```ts
   import { NextResponse } from 'next/server';
   import { syncCoursesToHelix } from '@/lib/sync';

   export async function POST() {
     try {
       await syncCoursesToHelix();
       return NextResponse.json({ success: true });
     } catch (error) {
       return NextResponse.json(
         { error: 'Sync failed' },
         { status: 500 }
       );
     }
   }
   ```

### Decision Authority
- ✅ Can modify: Helix DB schema, queries, API routes
- ✅ Can create: New endpoints, data models
- ⚠️ Coordinate with Frontend Agent: API contracts, response shapes
- ⚠️ Coordinate with Graph Agent: Graph data format
- ❌ Cannot modify: UI components, styling

### Common Tasks

**Task**: Add a new field to existing node
```hx
// Before
N::Course {
  INDEX id: String,
  name: String
}

// After
N::Course {
  INDEX id: String,
  name: String,
  description: String  // New field
}
```

**Task**: Create a complex query with filtering
```hx
QUERY getAssignmentsDueThisWeek(userId: String) =>
  user <- N<User>({id: userId})
  courses <- N<Course>() -[R<ENROLLED_IN>]- user
  assignments <- N<Assignment>() -[R<INCLUDES>]- N<Module>() -[R<CONTAINS>]- courses
  filtered <- assignments WHERE due_at >= TODAY AND due_at <= TODAY + 7
  RETURN filtered
```

---

## 3. Graph Visualization Agent

### Responsibilities
- Implement 3D graph rendering with react-force-graph-3d
- Configure force simulation physics
- Handle node/link styling
- Implement camera controls and animations
- Optimize performance for large graphs

### Key Files
```
web/my-app/components/
├── GraphView.tsx         # Main graph component
├── GraphControls.tsx     # Filter/settings panel
└── NodeDetail.tsx        # Node info sidebar

web/my-app/lib/
└── graph-utils.ts        # Data transformation utilities
```

### Workflow

#### Setting Up react-force-graph-3d

1. **Install Dependencies**:
   ```bash
   cd web/my-app
   npm install react-force-graph-3d three @types/three
   ```

2. **Create Graph Component** (`components/GraphView.tsx`):
   ```tsx
   'use client';

   import { useRef, useState, useEffect } from 'react';
   import ForceGraph3D from 'react-force-graph-3d';
   import type { ForceGraphMethods } from 'react-force-graph-3d';

   interface GraphData {
     nodes: Array<{
       id: string;
       name: string;
       type: 'course' | 'module' | 'assignment' | 'page';
       color: string;
       val?: number;
     }>;
     links: Array<{
       source: string;
       target: string;
     }>;
   }

   export function GraphView({ data }: { data: GraphData }) {
     const graphRef = useRef<ForceGraphMethods>();

     return (
       <ForceGraph3D
         ref={graphRef}
         graphData={data}
         nodeLabel="name"
         nodeColor="color"
         nodeVal={(node: any) => {
           // Size based on type
           if (node.type === 'course') return 15;
           if (node.type === 'module') return 10;
           return 5;
         }}
         linkWidth={2}
         linkColor={() => 'rgba(255,255,255,0.2)'}
         backgroundColor="#05070d"
         onNodeClick={(node) => {
           // Navigate to node detail
           console.log('Clicked:', node);
         }}
       />
     );
   }
   ```

3. **Transform Helix Data to Graph Format** (`lib/graph-utils.ts`):
   ```ts
   export function transformToGraphData(helixData: any): GraphData {
     const nodes = [];
     const links = [];

     // Add course nodes
     for (const course of helixData.courses) {
       nodes.push({
         id: course.id,
         name: course.name,
         type: 'course',
         color: course.color,
       });

       // Add modules
       for (const module of course.modules) {
         nodes.push({
           id: module.id,
           name: module.name,
           type: 'module',
           color: course.color, // Same color as parent course
         });

         // Link course -> module
         links.push({
           source: course.id,
           target: module.id,
         });
       }
     }

     return { nodes, links };
   }
   ```

#### Implementing Advanced Features

**Feature**: Color-Coded Sub-Graphs (Per Course)
```tsx
function assignCourseColors(courses: Course[]): Map<string, string> {
  const colors = [
    '#ef4444', // red - Math 18
    '#3b82f6', // blue - Math 20C
    '#10b981', // green - CSE 101
    '#f59e0b', // orange
    '#8b5cf6', // purple
  ];

  const colorMap = new Map();
  courses.forEach((course, idx) => {
    colorMap.set(course.id, colors[idx % colors.length]);
  });

  return colorMap;
}
```

**Feature**: Node Click Navigation
```tsx
const router = useRouter();

onNodeClick={(node) => {
  // Zoom to node
  graphRef.current?.centerAt(node.x, node.y, node.z, 1000);

  // Navigate to detail page
  router.push(`/node/${node.id}`);
}}
```

**Feature**: Camera Presets
```tsx
function cameraPresets(graphRef: RefObject<ForceGraphMethods>) {
  return {
    topView: () => {
      graphRef.current?.cameraPosition(
        { x: 0, y: 500, z: 0 }, // Position
        { x: 0, y: 0, z: 0 },   // Look at
        1000                     // Duration (ms)
      );
    },

    orbitalView: () => {
      graphRef.current?.cameraPosition(
        { x: 300, y: 300, z: 300 },
        { x: 0, y: 0, z: 0 },
        1000
      );
    },
  };
}
```

**Feature**: Performance Optimization
```tsx
<ForceGraph3D
  // Reduce physics complexity
  cooldownTicks={100}
  warmupTicks={0}

  // Limit rendering
  nodeThreeObjectExtend={false}

  // Use canvas for links (faster)
  linkDirectionalParticles={0}

  // Throttle renders
  enableNodeDrag={false} // Disable for performance
/>
```

#### Implementing Filter Controls

**Component**: GraphControls.tsx
```tsx
export function GraphControls({ onFilterChange }: { onFilterChange: (filters: Filters) => void }) {
  const [showCourses, setShowCourses] = useState(true);
  const [showModules, setShowModules] = useState(true);
  const [showAssignments, setShowAssignments] = useState(true);

  useEffect(() => {
    onFilterChange({
      courses: showCourses,
      modules: showModules,
      assignments: showAssignments,
    });
  }, [showCourses, showModules, showAssignments]);

  return (
    <div className="absolute top-4 right-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <h3 className="text-sm font-semibold text-white mb-3">Filters</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={showCourses} onChange={(e) => setShowCourses(e.target.checked)} />
          Courses
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={showModules} onChange={(e) => setShowModules(e.target.checked)} />
          Modules
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={showAssignments} onChange={(e) => setShowAssignments(e.target.checked)} />
          Assignments
        </label>
      </div>
    </div>
  );
}
```

### Decision Authority
- ✅ Can modify: Graph rendering, camera controls, visual effects
- ✅ Can create: Graph components, utilities
- ⚠️ Coordinate with Frontend Agent: Component integration
- ⚠️ Coordinate with Backend Agent: Data format requirements
- ❌ Cannot modify: Data fetching logic, API routes

### Common Tasks

**Task**: Highlight specific nodes
```tsx
const [highlightNodes, setHighlightNodes] = useState(new Set());

<ForceGraph3D
  nodeColor={(node: any) =>
    highlightNodes.has(node.id) ? '#10b981' : node.color
  }
/>
```

**Task**: Add directional arrows
```tsx
<ForceGraph3D
  linkDirectionalArrowLength={3}
  linkDirectionalArrowRelPos={1}
  linkDirectionalArrowColor={() => 'rgba(255,255,255,0.6)'}
/>
```

---

## 4. Voice AI Agent

### Responsibilities
- Implement speech recognition
- Process natural language intents
- Execute graph navigation commands
- Provide voice feedback (TTS)

### Key Files
```
web/my-app/lib/
├── voice/
│   ├── recognition.ts    # Speech-to-text
│   ├── nlp.ts            # Intent parsing
│   └── tts.ts            # Text-to-speech

web/my-app/components/
└── VoiceControl.tsx      # UI component
```

### Workflow

#### Setting Up Web Speech API

**Component**: VoiceControl.tsx
```tsx
'use client';

import { useState, useEffect } from 'react';

interface VoiceControlProps {
  onCommand: (command: string, intent: Intent) => void;
}

export function VoiceControl({ onCommand }: VoiceControlProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();

      recognizer.continuous = true;
      recognizer.interimResults = true;

      recognizer.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };

      setRecognition(recognizer);
    }
  }, []);

  const processCommand = async (text: string) => {
    const intent = await parseIntent(text);
    onCommand(text, intent);
  };

  const toggleListening = () => {
    if (listening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setListening(!listening);
  };

  return (
    <div className="fixed bottom-8 right-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          className={`h-12 w-12 rounded-full ${
            listening ? 'bg-red-500' : 'bg-emerald-500'
          } flex items-center justify-center`}
        >
          {listening ? '🎤' : '🔇'}
        </button>
        <div className="text-sm text-slate-300">
          {listening ? transcript || 'Listening...' : 'Click to speak'}
        </div>
      </div>
    </div>
  );
}
```

#### Implementing Intent Parsing

**Library**: nlp.ts
```ts
export interface Intent {
  action: 'navigate' | 'filter' | 'search' | 'summarize';
  target?: string;
  filters?: Record<string, any>;
}

export async function parseIntent(text: string): Promise<Intent> {
  const lowerText = text.toLowerCase();

  // Navigate patterns
  if (lowerText.match(/show|go to|navigate to/)) {
    const courseMatch = lowerText.match(/math \d+|cse \d+/);
    if (courseMatch) {
      return {
        action: 'navigate',
        target: courseMatch[0].replace(' ', ''),
      };
    }

    const moduleMatch = lowerText.match(/module \d+/);
    if (moduleMatch) {
      return {
        action: 'navigate',
        target: moduleMatch[0],
      };
    }
  }

  // Filter patterns
  if (lowerText.match(/due|upcoming|this week/)) {
    return {
      action: 'filter',
      filters: {
        type: 'assignment',
        dueDate: 'this_week',
      },
    };
  }

  // Search patterns
  if (lowerText.match(/find|search/)) {
    const query = lowerText.replace(/find|search/, '').trim();
    return {
      action: 'search',
      target: query,
    };
  }

  // Summarize patterns
  if (lowerText.match(/summarize|what is|tell me about/)) {
    return {
      action: 'summarize',
      target: lowerText.replace(/summarize|what is|tell me about/, '').trim(),
    };
  }

  // Default
  return { action: 'search', target: text };
}
```

#### Executing Commands

**Hook**: useVoiceCommands.ts
```ts
import { useRouter } from 'next/navigation';
import { RefObject } from 'react';
import type { ForceGraphMethods } from 'react-force-graph-3d';

export function useVoiceCommands(
  graphRef: RefObject<ForceGraphMethods>,
  graphData: GraphData
) {
  const router = useRouter();

  const executeCommand = (command: string, intent: Intent) => {
    switch (intent.action) {
      case 'navigate':
        handleNavigate(intent.target);
        break;

      case 'filter':
        handleFilter(intent.filters);
        break;

      case 'search':
        handleSearch(intent.target);
        break;

      case 'summarize':
        handleSummarize(intent.target);
        break;
    }
  };

  const handleNavigate = (target: string) => {
    // Find node
    const node = graphData.nodes.find(n =>
      n.name.toLowerCase().includes(target.toLowerCase())
    );

    if (node) {
      // Zoom to node
      graphRef.current?.centerAt(node.x, node.y, node.z, 1000);

      // Announce
      speak(`Navigating to ${node.name}`);
    } else {
      speak(`Could not find ${target}`);
    }
  };

  const handleFilter = (filters: Record<string, any>) => {
    // Apply filters to graph
    // (Implementation depends on state management)
    speak(`Filtering by ${JSON.stringify(filters)}`);
  };

  const handleSearch = (query: string) => {
    const matches = graphData.nodes.filter(n =>
      n.name.toLowerCase().includes(query.toLowerCase())
    );

    if (matches.length > 0) {
      speak(`Found ${matches.length} results for ${query}`);
      // Highlight matches
    } else {
      speak(`No results for ${query}`);
    }
  };

  const handleSummarize = async (target: string) => {
    // Fetch node details from API
    const details = await fetch(`/api/nodes/${target}`).then(r => r.json());
    speak(details.summary || 'No summary available');
  };

  return { executeCommand };
}

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
```

### Decision Authority
- ✅ Can modify: Voice recognition, intent parsing, TTS
- ✅ Can create: Voice commands, NLP patterns
- ⚠️ Coordinate with Graph Agent: Navigation APIs
- ⚠️ Coordinate with Backend Agent: Node lookup APIs
- ❌ Cannot modify: Graph rendering logic

---

## 5. DevOps Agent

### Responsibilities
- Deploy to production
- Set up CI/CD pipelines
- Monitor performance
- Configure environment variables
- Manage Helix DB deployment

### Key Files
```
.github/workflows/
├── deploy.yml            # GitHub Actions
└── test.yml              # CI tests

vercel.json               # Vercel config
Dockerfile                # Container config (if needed)
.env.example              # Environment variables template
```

### Workflow

#### Setting Up Environment Variables

**File**: .env.example
```bash
# Canvas API
CANVAS_URL=https://canvas.ucsd.edu
CANVAS_ACCESS_TOKEN=your_token_here

# Helix DB
HELIX_URL=http://localhost:6969

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Usage**:
```bash
cp .env.example .env.local
# Edit .env.local with actual values
```

#### Deploying to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Configure** (`vercel.json`):
   ```json
   {
     "buildCommand": "cd web/my-app && npm run build",
     "outputDirectory": "web/my-app/.next",
     "framework": "nextjs",
     "env": {
       "CANVAS_URL": "@canvas-url",
       "CANVAS_ACCESS_TOKEN": "@canvas-token",
       "HELIX_URL": "@helix-url"
     }
   }
   ```

3. **Deploy**:
   ```bash
   cd web/my-app
   vercel --prod
   ```

#### Setting Up GitHub Actions

**File**: .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: ./web/my-app
        run: npm ci

      - name: Run tests
        working-directory: ./web/my-app
        run: npm test

      - name: Build
        working-directory: ./web/my-app
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./web/my-app
```

---

## 6. QA Agent

### Responsibilities
- Test all features
- Report bugs
- Validate user experience
- Performance testing
- Accessibility audits

### Workflow

#### Testing Checklist

**Landing Page**:
- [ ] Hero text displays correctly
- [ ] Dashboard preview scales on scroll
- [ ] Navigation links work
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors

**Graph View**:
- [ ] Graph renders with correct data
- [ ] Node colors match courses
- [ ] Click navigation works
- [ ] Camera controls respond
- [ ] No performance lag with 1000+ nodes

**Voice Control**:
- [ ] Microphone access granted
- [ ] Speech recognized accurately
- [ ] Commands execute correctly
- [ ] Feedback provided (visual + audio)

**API Endpoints**:
- [ ] `/api/courses` returns valid data
- [ ] `/api/sync` completes without errors
- [ ] Error handling works (500, 404)

#### Bug Report Template

```markdown
## Bug Report

**Title**: [Short description]

**Severity**: Critical | High | Medium | Low

**Steps to Reproduce**:
1. Navigate to...
2. Click on...
3. Observe...

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Environment**:
- Browser: Chrome 120 / Firefox 121 / Safari 17
- OS: macOS 14 / Windows 11 / Ubuntu 22
- Device: Desktop / Mobile

**Screenshots/Video**:
[Attach if applicable]

**Console Errors**:
```
[Paste error logs]
```

**Suggested Fix** (optional):
[Your ideas]
```

---

## Cross-Agent Collaboration

### Communication Protocols

#### When Backend Changes API Contract
1. Backend Agent: Update API in `/api/` route
2. Backend Agent: Update documentation in `docs/API.md`
3. Backend Agent: Notify Frontend Agent
4. Frontend Agent: Update API calls in components
5. QA Agent: Test integration

#### When Graph Data Format Changes
1. Backend Agent: Modify Helix query response
2. Backend Agent: Update `lib/graph-utils.ts` transformation
3. Graph Agent: Verify graph renders correctly
4. QA Agent: Test with sample data

#### When Adding New Voice Command
1. Voice AI Agent: Implement intent parser
2. Voice AI Agent: Document command in README
3. Graph Agent: Expose navigation API
4. Frontend Agent: Update UI with command hint
5. QA Agent: Test command accuracy

---

## Agent Decision Matrix

| Decision | Frontend | Backend | Graph | Voice | DevOps | QA |
|----------|----------|---------|-------|-------|--------|-----|
| Add UI component | ✅ | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ |
| Modify DB schema | ❌ | ✅ | ⚠️ | ❌ | ⚠️ | ❌ |
| Change graph rendering | ❌ | ❌ | ✅ | ⚠️ | ❌ | ⚠️ |
| Add voice command | ❌ | ⚠️ | ⚠️ | ✅ | ❌ | ⚠️ |
| Deploy to production | ❌ | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| Report bugs | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |

**Legend**:
- ✅ Primary decision maker
- ⚠️ Must be consulted/informed
- ❌ No involvement needed

---

## Best Practices

### All Agents
1. **Document Changes**: Update relevant .md files
2. **Test Before Commit**: Run `npm run lint` and `npm run build`
3. **Write Clear Commits**: Follow conventional commit format
4. **Communicate**: Use GitHub issues/discussions for coordination
5. **Review Code**: Request reviews from affected agents

### Code Review Guidelines
- Frontend reviews UI/UX changes
- Backend reviews data/API changes
- Graph reviews visualization logic
- Voice reviews NLP/intent changes
- DevOps reviews deployment configs
- QA reviews test coverage

---

**Last Updated**: November 23, 2025
**Version**: 1.0
