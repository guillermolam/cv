/**
 * Knowledge Center — force-directed graph view.
 *
 * Uses the same Three.js renderer / capability / dispose utilities as the
 * neural-network hero scene. Nodes are knowledge resources, edges connect
 * resources that share at least one categoryId. Colour-coded by audience
 * (human = blue family, agent = purple/amber family).
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRenderCore } from '../design-system/three/renderer';
import { disposeObject } from '../design-system/three/dispose';
import { hasWebGL, deviceQuality } from '../design-system/three/capability';

// ── Types ─────────────────────────────────────────────────────────────────────

export type KnowledgeGraphNode = {
  id: string;
  title: string;
  type: string;
  audience: 'human' | 'agent' | 'other';
  cats: string[];
};

type SimNode = KnowledgeGraphNode & {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
};

type Edge = { a: number; b: number };

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, number> = {
  // human audience — blue / teal / green family
  article:       0x29b6f6,
  book:          0x26c6da,
  course:        0x66bb6a,
  podcast:       0x26a69a,
  workshop:      0x42a5f5,
  video:         0xef5350,
  'github-repo': 0x8d6e63,
  documentation: 0x5c6bc0,
  // agent audience — purple / amber / neon family
  mcp:           0xce93d8,
  skill:         0xb39ddb,
  plugin:        0xffb74d,
  tool:          0xff8a65,
  platform:      0xffd54f,
  'llm-model':   0xf48fb1,
  example:       0xa5d6a7,
  cli:           0x80cbc4,
  'md-doc':      0xffe082,
  // fallback
  other:         0x546e7a,
};

const AUDIENCE_COLOR: Record<string, number> = {
  human: 0x29b6f6,
  agent: 0xce93d8,
  other: 0x546e7a,
};

// ── Force simulation ──────────────────────────────────────────────────────────

function buildEdges(nodes: SimNode[], maxEdges = 1200): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length && edges.length < maxEdges; i++) {
    for (let j = i + 1; j < nodes.length && edges.length < maxEdges; j++) {
      const a = nodes[i]!;
      const b = nodes[j]!;
      // Only connect nodes within same audience or sharing a category
      const shared = a.cats.some((c) => b.cats.includes(c));
      if (shared) edges.push({ a: i, b: j });
    }
  }
  return edges;
}

function runSimulation(nodes: SimNode[], edges: Edge[], iterations = 60) {
  const repulsion  = 18;
  const attraction = 0.006;
  const damping    = 0.82;
  const tmp        = new THREE.Vector3();

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ni = nodes[i]!;
        const nj = nodes[j]!;
        tmp.copy(ni.pos).sub(nj.pos);
        const dist2 = Math.max(0.5, tmp.lengthSq());
        const force = repulsion / dist2;
        tmp.normalize().multiplyScalar(force);
        ni.vel.add(tmp);
        nj.vel.sub(tmp);
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const ni = nodes[edge.a]!;
      const nj = nodes[edge.b]!;
      tmp.copy(nj.pos).sub(ni.pos);
      const force = tmp.length() * attraction;
      tmp.normalize().multiplyScalar(force);
      ni.vel.add(tmp);
      nj.vel.sub(tmp);
    }

    // Integrate
    for (const n of nodes) {
      n.vel.multiplyScalar(damping);
      n.pos.add(n.vel);
    }
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export function initKnowledgeGraph(
  canvas: HTMLCanvasElement,
  rawNodes: KnowledgeGraphNode[],
  tooltipEl?: HTMLElement | null,
): () => void {
  if (!hasWebGL()) {
    canvas.parentElement?.classList.add('kc-graph--no-webgl');
    return () => {};
  }

  const quality = deviceQuality();
  // Reduce node count on low-end devices
  const maxNodes = quality === 'high' ? 350 : quality === 'medium' ? 200 : 120;
  const inputNodes = rawNodes.slice(0, maxNodes);

  // ── Simulation setup ────────────────────────────────────────────────────────
  const simNodes: SimNode[] = inputNodes.map((n, i) => {
    // Fibonacci sphere initial positions
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / Math.max(inputNodes.length - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return {
      ...n,
      pos: new THREE.Vector3(Math.cos(theta) * r * 18, y * 18, Math.sin(theta) * r * 18),
      vel: new THREE.Vector3(),
    };
  });

  const edges = buildEdges(simNodes);
  runSimulation(simNodes, edges);

  // ── Three.js scene ──────────────────────────────────────────────────────────
  const core = createRenderCore(canvas);
  const { renderer, scene, camera } = core;
  camera.position.set(0, 0, 48);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping   = true;
  controls.dampingFactor   = 0.06;
  controls.autoRotate      = true;
  controls.autoRotateSpeed = 0.35;
  controls.minDistance     = 12;
  controls.maxDistance     = 90;

  scene.add(new THREE.AmbientLight(0x1a1a2e, 0.8));

  // ── Node point cloud ────────────────────────────────────────────────────────
  const positions = new Float32Array(simNodes.length * 3);
  const colors    = new Float32Array(simNodes.length * 3);
  const sizes     = new Float32Array(simNodes.length);

  for (let i = 0; i < simNodes.length; i++) {
    const n   = simNodes[i]!;
    const col = new THREE.Color(TYPE_COLORS[n.type] ?? AUDIENCE_COLOR[n.audience] ?? 0x546e7a);
    positions[i * 3]     = n.pos.x;
    positions[i * 3 + 1] = n.pos.y;
    positions[i * 3 + 2] = n.pos.z;
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
    sizes[i] = n.audience === 'agent' ? 6 : 5;
  }

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  pointGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const pointMat = new THREE.PointsMaterial({
    vertexColors: true,
    sizeAttenuation: true,
    size: 0.55,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
  });

  const points = new THREE.Points(pointGeo, pointMat);
  scene.add(points);

  // ── Edge lines ──────────────────────────────────────────────────────────────
  if (edges.length > 0) {
    const edgePositions = new Float32Array(edges.length * 6);
    for (let e = 0; e < edges.length; e++) {
      const a = simNodes[edges[e]!.a]!.pos;
      const b = simNodes[edges[e]!.b]!.pos;
      edgePositions[e * 6]     = a.x; edgePositions[e * 6 + 1] = a.y; edgePositions[e * 6 + 2] = a.z;
      edgePositions[e * 6 + 3] = b.x; edgePositions[e * 6 + 4] = b.y; edgePositions[e * 6 + 5] = b.z;
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2a4a6a, transparent: true, opacity: 0.22, depthWrite: false });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));
  }

  // ── Raycasting for hover tooltip ────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 0.6 };
  const pointer = new THREE.Vector2(-9999, -9999);
  let hoveredIdx = -1;

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    pointer.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObject(points);
    const idx  = hits[0]?.index ?? -1;
    if (idx === hoveredIdx) return;
    hoveredIdx = idx;
    canvas.style.cursor = idx >= 0 ? 'pointer' : 'default';

    if (!tooltipEl) return;
    if (idx < 0) {
      tooltipEl.hidden = true;
      return;
    }
    const node = simNodes[idx]!;
    tooltipEl.textContent = '';

    const title = document.createElement('strong');
    title.textContent = node.title;
    const meta = document.createElement('span');
    meta.textContent = ` · ${node.type}`;
    meta.style.opacity = '0.6';
    tooltipEl.appendChild(title);
    tooltipEl.appendChild(meta);

    // Position tooltip near cursor
    tooltipEl.hidden = false;
    const x = Math.min(e.clientX - rect.left + 12, rect.width  - 200);
    const y = Math.min(e.clientY - rect.top  + 12, rect.height - 60);
    tooltipEl.style.left = `${x}px`;
    tooltipEl.style.top  = `${y}px`;
  };

  const onCanvasClick = () => {
    if (hoveredIdx < 0) return;
    const node = simNodes[hoveredIdx]!;
    // Navigate to detail page — use en as fallback lang
    const lang = document.documentElement.lang || 'en';
    window.open(`/${lang}/knowledge/${node.id}`, '_blank', 'noopener');
  };

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('click', onCanvasClick);

  // ── Render loop ─────────────────────────────────────────────────────────────
  let raf = 0;
  let running = true;

  const tick = () => {
    if (!running) return;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  // ── Resize ──────────────────────────────────────────────────────────────────
  const onResize = () => core.resize();
  window.addEventListener('resize', onResize, { passive: true });

  // ── Dispose ─────────────────────────────────────────────────────────────────
  const dispose = () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('click', onCanvasClick);
    controls.dispose();
    disposeObject(scene);
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss?.();
  };

  document.addEventListener('astro:before-swap', dispose, { once: true });
  return dispose;
}
