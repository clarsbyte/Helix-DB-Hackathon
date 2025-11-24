# N-Mapper - Claude Code Documentation

## Project Overview

N-Mapper is a voice-first interface that transforms Canvas LMS courses into a navigable 3D node graph. Think of it as "Obsidian's Graph View meets Canvas LMS" - a dense, zoomable visualization where every course entity (modules, assignments, pages, discussions) becomes an addressable node that you can navigate by voice or URL.

**Vision**: Play School Like A Game - make learning efficient by visualizing course relationships and navigating them intuitively.

## Current Status

### ✅ Completed
- **Landing Page**: Fully designed and implemented with:
  - Hero section with "Learning Made Efficient" messaging
  - Interactive scroll-based scaling animation
  - Dashboard preview mockup
  - Glassmorphic UI with dot-grid overlays
  - Responsive design with Tailwind CSS v4

- **Tech Stack Setup**:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
  - ESLint configuration

- **Helix DB Foundation**:
  - Basic schema with User nodes
  - Query examples for creating and fetching users
  - Local dev server configured (port 6969)

### 🚧 In Progress / Next Steps
1. **Canvas API Integration**: Fetch course data (modules, assignments, pages, discussions)
2. **3D Graph Visualization**: Implement using `react-force-graph-3d`
3. **Helix DB Schema**: Expand to support Canvas entities as graph nodes
4. **Voice AI Layer**: Contextual navigation and search
5. **URL Routing**: Each node addressable by unique URL

---

## Architecture

```
N-Mapper/
├── web/my-app/              # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Landing page (completed)
│   │   ├── layout.tsx       # Root layout with fonts
│   │   ├── globals.css      # Tailwind + custom animations
│   │   └── app/
│   │       └── page.tsx     # Dashboard (placeholder)
│   └── package.json         # Dependencies
│
├── helix/                   # Helix DB (graph database)
│   ├── db/
│   │   ├── schema.hx        # Node definitions
│   │   └── queries.hx       # Database queries
│   └── helix.toml           # DB configuration
│
└── docs/                    # Documentation
    ├── Claude.md            # This file
    ├── Agents.md            # Agent workflow docs
    └── errors/              # Screenshots/debugging
```

---

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first styling
- **react-force-graph-3d**: 3D graph visualization (to be installed)

### Backend/Database
- **Helix DB**: Graph database for storing Canvas data as nodes
  - Node-based schema
  - Custom query language (.hx files)
  - Local dev server on port 6969

### APIs (Planned)
- **Canvas LMS API**: Course data ingestion
- **Voice AI**: Speech recognition + natural language processing

---

## Key Files

### Frontend

#### `/web/my-app/app/page.tsx`
Landing page with hero section, CTA, and dashboard preview. Features:
- Scroll-based animation (scale effect)
- Glassmorphic cards with backdrop blur
- Navigation to `/app` dashboard
- Custom dot-grid overlays via CSS classes

#### `/web/my-app/app/layout.tsx`
Root layout configuring:
- Geist Sans + Geist Mono fonts
- Metadata (title, description)
- Global antialiasing

#### `/web/my-app/app/globals.css`
Custom styles including:
- `.cta-dots`, `.section-dots`, `.nav-dots`: Radial dot grid overlays
- `@keyframes float`, `pulseSoft`: Subtle animations
- `.glow-ring`: Gradient blur effects

### Database

#### `/helix/db/schema.hx`
Defines graph nodes:
```hx
N::User {
  INDEX name: String,
  email: String,
  created_at: Date DEFAULT NOW
}
```

**TODO**: Expand to include:
- `N::Course` (id, name, color_code)
- `N::Module` (id, name, course_id)
- `N::Assignment` (id, name, due_date, points)
- `N::Page` (id, title, url)
- Relationship edges (e.g., `COURSE->MODULE`, `MODULE->ASSIGNMENT`)

#### `/helix/db/queries.hx`
Query examples:
```hx
QUERY createUser(name: String, email: String) =>
  user <- AddN<User>({name: name, email: email})
  RETURN user
```

**TODO**: Add queries for:
- Fetching course graphs
- Finding nodes by ID or name
- Traversing relationships (e.g., "get all assignments in module X")

---

## Design System

### Color Palette
- **Background**: `#05070d` (dark navy)
- **Primary**: Emerald (`emerald-400`, `emerald-500`)
- **Secondary**: Slate (`slate-200`, `slate-300`, `slate-400`)
- **Accents**: White with opacity (`white/10`, `white/5`)

### UI Patterns
- **Glassmorphism**: `bg-white/5 backdrop-blur-xl border border-white/10`
- **Dot Grids**: Radial gradient backgrounds for depth
- **Rounded Corners**: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- **Shadows**: `shadow-[0_18px_70px_rgba(0,0,0,0.35)]`

### Typography
- **Headings**: `text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight`
- **Body**: `text-sm text-slate-300`
- **Labels**: `text-xs uppercase tracking-[0.15em] text-slate-400`

---

## Development Workflow

### Running the Project

1. **Start Helix DB**:
   ```bash
   cd helix
   helix dev  # Runs on port 6969
   ```

2. **Start Next.js Dev Server**:
   ```bash
   cd web/my-app
   npm run dev  # Runs on port 3000
   ```

3. **Access**:
   - Frontend: http://localhost:3000
   - Helix DB: http://localhost:6969

### Code Quality
- **ESLint**: `npm run lint` in `web/my-app`
- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier (if configured)

---

## Implementation Roadmap

### Phase 1: Data Layer (Current Priority)
1. **Canvas API Integration**
   - Set up API client with access token
   - Fetch courses, modules, assignments, pages, discussions
   - Transform Canvas JSON → Helix DB nodes

2. **Helix DB Schema Expansion**
   - Define all Canvas entity nodes
   - Create relationship edges
   - Write queries for graph traversal

### Phase 2: 3D Graph Visualization
1. **Install Dependencies**:
   ```bash
   npm install react-force-graph-3d
   ```

2. **Implement Graph Component**:
   - Transform Helix DB data → `{nodes, links}` format
   - Apply color coding per course (e.g., Math 18 = red, Math 20C = blue)
   - Add camera controls, zoom, pan
   - Node click → navigate to detail view

3. **Graph Customization**:
   - Node shapes/sizes based on type (assignment vs page)
   - Link styling (curved, directional arrows)
   - Performance optimization for large graphs (1000+ nodes)

### Phase 3: Voice AI Navigation
1. **Speech Recognition**:
   - Browser Web Speech API or external service
   - Real-time transcript display

2. **Intent Processing**:
   - NLP to parse commands (e.g., "show me Math 18 assignments")
   - Contextual awareness (current course/module)
   - Disambiguation (multiple matches)

3. **Action Execution**:
   - Camera pan/zoom to target node
   - Highlight matching nodes
   - Speak summaries (text-to-speech)

### Phase 4: URL-Based Navigation
1. **Dynamic Routes**:
   - `/graph/[courseId]` - Course-specific view
   - `/node/[nodeId]` - Individual node detail
   - Query params for filters (e.g., `?type=assignment`)

2. **Deep Linking**:
   - Shareable URLs for specific graph states
   - Bookmark support

---

## Graph Visualization Details

### Recommended Library: react-force-graph-3d

**Why?**
- ✅ Production-ready with 5.6k GitHub stars
- ✅ Used in an actual Obsidian plugin
- ✅ WebGL rendering via Three.js
- ✅ Built-in force-directed physics (d3-force-3d)
- ✅ Extensive customization options

**Basic Usage**:
```jsx
import ForceGraph3D from 'react-force-graph-3d';

<ForceGraph3D
  graphData={{
    nodes: [
      { id: 'math18', name: 'Math 18', color: '#ef4444', type: 'course' },
      { id: 'module1', name: 'Module 1', color: '#ef4444', type: 'module' },
      // ...
    ],
    links: [
      { source: 'math18', target: 'module1' }
    ]
  }}
  nodeLabel="name"
  nodeColor="color"
  nodeVal={(node) => node.type === 'course' ? 10 : 5}
  linkWidth={2}
  onNodeClick={(node) => {
    // Navigate or show detail
  }}
/>
```

**Customization Ideas**:
- Node size based on importance (course > module > assignment)
- Particle effects for active paths
- Highlight on hover
- Filter controls (show/hide node types)
- Camera presets (top view, side view)

---

## Helix DB Integration

### Data Flow

```
Canvas API → Fetch → Transform → Helix DB → Query → Frontend Graph
```

### Example Schema (Expanded)

```hx
// Course node
N::Course {
  INDEX id: String,
  name: String,
  code: String,
  color: String,  // Hex code for sub-graph color
  created_at: Date DEFAULT NOW
}

// Module node
N::Module {
  INDEX id: String,
  name: String,
  position: Int,
  created_at: Date DEFAULT NOW
}

// Assignment node
N::Assignment {
  INDEX id: String,
  name: String,
  due_at: Date,
  points: Float,
  created_at: Date DEFAULT NOW
}

// Relationships
R::CONTAINS {
  from: Course,
  to: Module
}

R::INCLUDES {
  from: Module,
  to: Assignment
}
```

### Example Queries

```hx
// Get full course graph
QUERY getCourseGraph(courseId: String) =>
  course <- N<Course>({id: courseId})
  modules <- N<Module>() -[R<CONTAINS>]- course
  assignments <- N<Assignment>() -[R<INCLUDES>]- modules
  RETURN {course, modules, assignments}

// Search nodes by name
QUERY searchNodes(query: String) =>
  results <- N() WHERE name CONTAINS query
  RETURN results
```

---

## Voice AI Patterns

### Intent Examples

| User Says | Intent | Action |
|-----------|--------|--------|
| "Show Math 18" | Navigate to course | Pan camera to Math 18 sub-graph |
| "What's due this week?" | Filter assignments | Highlight assignments with due_date in next 7 days |
| "Go to Module 3" | Navigate to module | Zoom to Module 3 node cluster |
| "Summarize this page" | Get details | Fetch node content, read aloud |

### Context Awareness
- Track current view (which course/module is in focus)
- Disambiguate similar names using context
- Maintain conversation history for follow-up questions

---

## Performance Considerations

### Large Graphs
- **Node Count**: 1000+ nodes expected for active students
- **Optimization Strategies**:
  - Lazy loading (render only visible nodes)
  - Level-of-detail (simplify distant nodes)
  - Canvas-based rendering (faster than DOM)
  - Web Workers for physics simulation

### Data Fetching
- Cache Canvas API responses
- Incremental sync (fetch only new/changed data)
- Offline support (Helix DB persists locally)

---

## Common Tasks

### Adding a New Node Type

1. **Update Helix Schema** (`helix/db/schema.hx`):
   ```hx
   N::Discussion {
     INDEX id: String,
     title: String,
     created_at: Date DEFAULT NOW
   }
   ```

2. **Create Query** (`helix/db/queries.hx`):
   ```hx
   QUERY createDiscussion(id: String, title: String) =>
     discussion <- AddN<Discussion>({id: id, title: title})
     RETURN discussion
   ```

3. **Update Graph Data Transform**:
   ```ts
   const graphData = {
     nodes: [
       ...discussions.map(d => ({
         id: d.id,
         name: d.title,
         type: 'discussion',
         color: courseColor
       }))
     ],
     // ...
   }
   ```

### Debugging Helix DB
- Check server logs: `helix dev --verbose`
- Inspect schema: `helix schema show`
- Run query directly: `helix query <queryName> --args '{...}'`

---

## Troubleshooting

### Common Issues

**Issue**: Landing page not rendering correctly
- **Fix**: Check Tailwind CSS compilation, ensure `globals.css` is imported in `layout.tsx`

**Issue**: Helix DB connection refused
- **Fix**: Verify server is running on port 6969, check `helix.toml` config

**Issue**: Graph performance degraded
- **Fix**: Reduce node count, enable lazy rendering, optimize physics settings

---

## Resources

### Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [react-force-graph-3d](https://github.com/vasturiano/react-force-graph)
- [Canvas LMS API](https://canvas.instructure.com/doc/api/)
- Helix DB Docs (check official documentation)

### Inspiration
- [Obsidian Graph View](https://help.obsidian.md/Plugins/Graph+view)
- [Obsidian 3D Graph Plugin](https://github.com/AlexW00/obsidian-3d-graph) (uses react-force-graph)

---

## Contributing Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused

### Commit Messages
```
feat: add Canvas API client
fix: resolve graph rendering lag
docs: update setup instructions
style: format with Prettier
```

### Pull Requests
- Include screenshots for UI changes
- Test across browsers (Chrome, Firefox, Safari)
- Update docs if adding new features

---

## Contact & Support

- **Project Maintainer**: Pavan Kumar
- **Repository**: (Add GitHub URL)
- **Issues**: (Add GitHub Issues URL)

---

**Last Updated**: November 23, 2025
**Version**: 0.1.0 (Landing Page Complete)
