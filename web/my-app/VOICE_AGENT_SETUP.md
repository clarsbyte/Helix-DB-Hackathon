# Voice Agent Setup Guide

## Overview
The voice agent uses Vapi to control the 3D graph visualization through natural voice commands. The AI can intelligently navigate the graph, zoom to courses/modules/assignments, and provide information about your Canvas data.

## Setup Steps

### 1. Get Vapi API Key
1. Go to [vapi.ai](https://vapi.ai) and create an account
2. Navigate to your dashboard
3. Copy your **Public Key** (starts with a long string)

### 2. Configure Environment Variables
Create a `.env.local` file in the `web/my-app` directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Vapi public key:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_actual_vapi_public_key_here
```

### 3. Restart the Development Server
```bash
npm run dev
```

## How It Works

### Graph Control Functions
The voice agent has access to these functions to control the graph:

1. **zoomToNode(nodeId)** - Zoom to a specific node by ID
2. **searchNode(query)** - Search for a node by name
3. **focusOnCourse(courseName)** - Focus on a specific course
4. **resetView()** - Reset camera to default view
5. **getCourseInfo(courseName)** - Get course details and modules

### Example Voice Commands

- "Show me CSE 101"
- "Zoom to Math 18"
- "What modules are in CSE 101?"
- "Navigate to Linear Equations"
- "Reset the view"
- "Show me all my assignments for PHYS 2A"

### AI Context

The voice agent is pre-loaded with:
- All 10 courses (MATH 18, CSE 101, COGS 10, PHYS 2A, CSE 12, CSE 15L, MATH 20C, CSE 100, CSE 105, CSE 110)
- 65 modules across all courses
- 162 assignments (homeworks, quizzes, exams, labs, projects)

When you ask about a course or assignment, the AI:
1. Searches the graph data
2. Calls the appropriate function (e.g., `focusOnCourse` or `searchNode`)
3. Provides a natural language response
4. The graph automatically zooms/navigates

## Architecture

### GraphControlContext
Located in `/contexts/GraphControlContext.tsx`, this provides:
- Shared `graphRef` between components
- Control functions (zoom, search, focus, reset)

### VoiceSidebar Component
Located in `/components/VoiceSidebar.tsx`, this handles:
- Vapi SDK initialization
- Event listeners (call-start, call-end, speech-start, speech-end)
- Function call handling
- Transcript display
- Audio visualizer

### Switching to Helix Data

When you're ready to use real Helix DB data instead of mock data:

1. In `/app/app/page.tsx`, change:
```tsx
const USE_HELIX_DATA = false; // Change to true
```

2. Uncomment the Helix data fetching code in the same file

3. Update the VoiceSidebar system prompt to reference real data:
```tsx
Available courses: ${graphData.nodes.filter(n => n.type === 'course').map(n => n.name).join(', ')}
```

The voice agent will automatically adapt to work with your actual Canvas data from Helix DB.

## Troubleshooting

### Voice agent not starting
- Check that your Vapi public key is correctly set in `.env.local`
- Make sure you restarted the dev server after adding the key
- Check browser console for errors

### Function calls not working
- Open browser console and look for "Function call:" logs
- Verify the graph is fully loaded before making requests
- Try refreshing the page

### Transcript not updating
- Check that Vapi is receiving messages (console logs)
- Ensure microphone permissions are granted in your browser

## Demo Mode (Current Setup)

Currently using **mock data** with:
- 238 total nodes
- 10 courses
- 65 modules
- 162 assignments

The voice agent knows about all this data and can navigate to any node!
