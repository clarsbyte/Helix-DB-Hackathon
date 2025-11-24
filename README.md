# N-Mapper

N-Mapper is a voice-first interface that turns a live Canvas course into a navigable node map. The app pulls course data from the Canvas API, stores it in a local Helix/Heelings DB instance, and renders a circular “warp” of interconnected nodes you can jump between by voice or by URL. It’s one unified graph with colored sub-graphs per course (e.g., Math 18 is red, Math 20C is blue), so each course remains visually distinct while sharing the same canvas. The feel should be closer to Obsidian’s Graph View: a dense, zoomable warp where scrolling/panning reveals more detail, lets you hunt for nodes, and voice search snaps you to the right spot.

## What it does

- Connects to the Canvas API to fetch real course data (names, structure, relationships).
- Mirrors that data locally in Helix/Heelings DB for fast querying and offline-friendly iteration.
- Builds a circular node map that sits at the center of the page; every Canvas entity becomes a node addressable by URL.
- Adds voice AI control so people can ask for a node, follow links, or navigate the graph with contextual awareness (course-aware disambiguation, summaries, and targeted note retrieval).

## How it fits together

1) Canvas → ingest course metadata via API calls.  
2) Local DB → persist nodes/edges in Helix/Heelings DB to keep the graph synchronized.  
3) Node map → render the circular warp and expose each node as a URL-friendly target.  
4) Voice layer → use AI to resolve spoken intents to node lookups and guided jumps.

## Screens / states

- Landing: hero headline “Learning Made Efficient,” with a dashboard teaser and a CTA to start. Shows social proof (e.g., trusted by UC San Diego) and a Dashboard button.
- Normal graph view: Obsidian-style dense orb of nodes (one unified graph with colored sub-graphs per course). Side controls for groups/filters/colors/display/forces. Right rail shows a mini orb preview, status (HelixDB connected), the N-Mapper label, and a live transcript of voice interactions.
- Zoomed-in view: Focused slice of the graph (e.g., Math 18) with labeled nodes/edges. Right rail stays fixed (mini orb, HelixDB status, live transcript). Voice and search can jump directly to specific course nodes (e.g., “Math 18”) and expose the relevant notes with summaries.

## Current repo layout

- `web/my-app/` – Next.js app scaffold (Next 16 + React 19). This is where the UI/voice map will live. The default page is still the starter template.

## Run the app locally

```bash
cd web/my-app
npm install
npm run dev
# open http://localhost:3000
```

## Next steps (high level)

- Wire up Canvas API auth and the course ingestion pipeline.
- Define the Helix/Heelings DB schema for nodes/edges and keep it in sync with Canvas updates.
- Replace the starter UI with the circular warp visualization and voice controls.
