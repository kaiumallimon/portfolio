import { IProject } from "./models";

export interface ConstellationNode {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  x: number;
  y: number;
  col: number;
  row: number;
  pulseDelay: number;
}

export interface ConstellationEdge {
  id: string;
  sourceId: string;
  targetId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight: number;
  sharedReason: string;
  isPulseEdge?: boolean;
}

export interface ConstellationGraph {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  width: number;
  height: number;
}

/**
 * Tweakable Configuration for the Constellation Graph
 * Adjust these values to modify grid resolution, dimensions, and line density.
 */
export const CONSTELLATION_CONFIG = {
  VIEWBOX_WIDTH: 400,
  VIEWBOX_HEIGHT: 200,
  GRID_COLS: 8,
  GRID_ROWS: 5,
  PADDING_X: 35,
  PADDING_Y: 25,
  MAX_CONNECTIONS_PER_NODE: 2,
  MAX_TOTAL_EDGES: 14,
  NODE_SIZE: 6, // 6x6 pixel square
  PULSE_DURATION: 3.2, // seconds per pulse cycle
};

// Seeded, aesthetic grid positions (col, row) chosen to keep nodes pleasantly distributed
// without clustering while snapping strictly to grid intersections.
const SEEDED_GRID_SLOTS: Array<[number, number]> = [
  [1, 1], // MediTouch
  [3, 0], // Cosmos ITS
  [5, 1], // GadgetWizard
  [7, 0], // Aven
  [2, 2], // Portfolio
  [4, 2], // Dorm of Decents
  [6, 2], // Viae
  [0, 3], // Neuroweb
  [2, 4], // Nex
  [5, 3], // Quran Companion
  [7, 3], // Melbourne Acid Washing
  [1, 3], // UIU CGPA Calculator
  [4, 4], // Pharmbrew
];

/**
 * Deterministic string hash function (djb2)
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Normalize and extract tags from a project
 */
function extractTags(project: Partial<IProject>): string[] {
  const raw = (project.tags && project.tags.length > 0)
    ? project.tags
    : (project.technologies || []);
  return raw.map((t) => t.trim().toLowerCase());
}

/**
 * Pure function to construct the deterministic constellation graph from project data
 */
export function buildConstellationGraph(
  projects: Partial<IProject>[],
  config = CONSTELLATION_CONFIG
): ConstellationGraph {
  const {
    VIEWBOX_WIDTH,
    VIEWBOX_HEIGHT,
    GRID_COLS,
    GRID_ROWS,
    PADDING_X,
    PADDING_Y,
    MAX_CONNECTIONS_PER_NODE,
    MAX_TOTAL_EDGES,
    PULSE_DURATION,
  } = config;

  const usableW = VIEWBOX_WIDTH - PADDING_X * 2;
  const usableH = VIEWBOX_HEIGHT - PADDING_Y * 2;
  const colStep = usableW / (GRID_COLS - 1);
  const rowStep = usableH / (GRID_ROWS - 1);

  // Track occupied grid slots to prevent overlapping
  const occupiedSlots = new Set<string>();

  // 1. Build Nodes
  const nodes: ConstellationNode[] = projects.map((p, idx) => {
    const slug = p.slug || (p._id ? String(p._id) : `project-${idx}`);
    const title = p.title || p.name || `Project ${idx + 1}`;
    const category = p.category || "Full-Stack Web App";
    const tags = (p.tags && p.tags.length > 0) ? p.tags : (p.technologies || []);

    // Pick deterministic grid slot
    let [col, row] = SEEDED_GRID_SLOTS[idx % SEEDED_GRID_SLOTS.length];
    const key = `${col},${row}`;

    if (occupiedSlots.has(key)) {
      // Find nearest free slot using deterministic hash
      const hash = hashString(slug);
      let found = false;
      for (let offset = 1; offset < GRID_COLS * GRID_ROWS; offset++) {
        const candidateCol = (col + offset + hash) % GRID_COLS;
        const candidateRow = (row + Math.floor(offset / GRID_COLS)) % GRID_ROWS;
        const candidateKey = `${candidateCol},${candidateRow}`;
        if (!occupiedSlots.has(candidateKey)) {
          col = candidateCol;
          row = candidateRow;
          found = true;
          break;
        }
      }
      if (!found) {
        col = idx % GRID_COLS;
        row = Math.floor(idx / GRID_COLS) % GRID_ROWS;
      }
    }

    occupiedSlots.add(`${col},${row}`);

    const x = Math.round(PADDING_X + col * colStep);
    const y = Math.round(PADDING_Y + row * rowStep);
    const pulseDelay = Number(((idx * 0.38) % PULSE_DURATION).toFixed(2));

    return {
      id: slug,
      slug,
      title,
      category,
      tags,
      x,
      y,
      col,
      row,
      pulseDelay,
    };
  });

  // 2. Build Connections based on shared tech or category
  const nodeMap = new Map<string, ConstellationNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const candidateEdges: Array<{
    sourceId: string;
    targetId: string;
    weight: number;
    reason: string;
    distance: number;
  }> = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const tags1 = extractTags(projects[i]);
      const tags2 = extractTags(projects[j]);

      // Shared technologies
      const sharedTags = tags1.filter((t) =>
        tags2.some((other) => other === t || other.includes(t) || t.includes(other))
      );

      const sameCategory = n1.category.toLowerCase() === n2.category.toLowerCase();

      let weight = 0;
      let reason = "";

      if (sharedTags.length > 0) {
        weight += sharedTags.length * 3;
        reason = sharedTags[0];
      }
      if (sameCategory) {
        weight += 2;
        if (!reason) reason = n1.category;
      }

      if (weight > 0) {
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const distance = Math.hypot(dx, dy);

        candidateEdges.push({
          sourceId: n1.id,
          targetId: n2.id,
          weight,
          reason,
          distance,
        });
      }
    }
  }

  // Sort candidate edges: higher weight first, then shorter distance
  candidateEdges.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.distance - b.distance;
  });

  // Keep lines sparse: limit connections per node
  const degreeMap = new Map<string, number>();
  nodes.forEach((n) => degreeMap.set(n.id, 0));

  const edges: ConstellationEdge[] = [];
  let pulseEdgeCount = 0;

  for (const candidate of candidateEdges) {
    if (edges.length >= MAX_TOTAL_EDGES) break;

    const d1 = degreeMap.get(candidate.sourceId) ?? 0;
    const d2 = degreeMap.get(candidate.targetId) ?? 0;

    if (d1 < MAX_CONNECTIONS_PER_NODE && d2 < MAX_CONNECTIONS_PER_NODE) {
      const n1 = nodeMap.get(candidate.sourceId)!;
      const n2 = nodeMap.get(candidate.targetId)!;

      const isPulse = pulseEdgeCount < 3 && candidate.distance < 180;
      if (isPulse) pulseEdgeCount++;

      edges.push({
        id: `edge-${candidate.sourceId}-${candidate.targetId}`,
        sourceId: candidate.sourceId,
        targetId: candidate.targetId,
        x1: n1.x,
        y1: n1.y,
        x2: n2.x,
        y2: n2.y,
        weight: candidate.weight,
        sharedReason: candidate.reason,
        isPulseEdge: isPulse,
      });

      degreeMap.set(candidate.sourceId, d1 + 1);
      degreeMap.set(candidate.targetId, d2 + 1);
    }
  }

  return {
    nodes,
    edges,
    width: VIEWBOX_WIDTH,
    height: VIEWBOX_HEIGHT,
  };
}
