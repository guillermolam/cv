import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { createRenderCore } from './renderer';
import { disposeObject } from './dispose';
import type { NeuralGraphData, NeuronNode, AxonNode, DendriteNode } from '../../lib/neural-types';

// ── Public API types ────────────────────────────────────────────────────────

export type NeuralNetworkController = {
  start: () => void;
  pause: () => void;
  resize: () => void;
  dispose: () => void;
  startEntrance: () => void;
  focusNeuron: (id: string | null) => void;
  focusAxon: (id: string | null) => void;
  /** Register hover callback — called on every pointer-move intersect change */
  onHover: (cb: (node: HoveredNode | null) => void) => void;
  /** Register click callback */
  onClick: (cb: (node: ClickedNode) => void) => void;
};

export type HoveredNode =
  | { kind: 'neuron'; data: NeuronNode }
  | { kind: 'axon';   data: AxonNode }
  | { kind: 'dendrite'; data: DendriteNode };

export type ClickedNode =
  | { kind: 'neuron'; data: NeuronNode }
  | { kind: 'axon';   data: AxonNode }
  | { kind: 'dendrite'; data: DendriteNode };

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Evenly distribute n points on a sphere of given radius (Fibonacci spiral). */
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius),
    );
  }
  return pts;
}

/** Seeded pseudo-random for stable jitter (same value across frames). */
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x) - 0.5;
}

/** Curved tube connecting two world-space points. */
function buildTube(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: number,
  opacity = 0.28,
): THREE.Mesh {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  mid.x += seededRand(from.x + to.z) * 2.5;
  mid.y += seededRand(from.y + to.x) * 2.5;
  mid.z += seededRand(from.z + to.y) * 2.5;

  const curve = new THREE.CatmullRomCurve3([from.clone(), mid, to.clone()]);
  const geo   = new THREE.TubeGeometry(curve, 14, 0.022, 4, false);
  const mat   = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

// ── Main factory ─────────────────────────────────────────────────────────────

export function createNeuralNetwork(
  canvas: HTMLCanvasElement,
  graph: NeuralGraphData,
): NeuralNetworkController {

  // ── Renderer / scene / camera ────────────────────────────────────────────
  const core = createRenderCore(canvas);
  const { renderer, scene, camera } = core;
  camera.position.set(0, 0, 30);
  renderer.toneMapping        = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // ── Controls ─────────────────────────────────────────────────────────────
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping   = true;
  controls.dampingFactor   = 0.05;
  controls.autoRotate      = true;
  controls.autoRotateSpeed = 0.4;
  controls.minDistance     = 8;
  controls.maxDistance     = 60;

  // ── Scene lights ─────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x1a1a2e, 0.7));

  // ── Groups ───────────────────────────────────────────────────────────────
  const neuronGroup   = new THREE.Group();
  const axonGroup     = new THREE.Group();
  const dendriteGroup = new THREE.Group();
  const edgeGroup     = new THREE.Group();
  scene.add(neuronGroup, axonGroup, dendriteGroup, edgeGroup);

  // ── Position maps ─────────────────────────────────────────────────────────
  const neuronPos   = new Map<string, THREE.Vector3>();
  const axonPos     = new Map<string, THREE.Vector3>();

  // ── Mesh → data maps (for raycasting) ────────────────────────────────────
  const meshToNeuron   = new Map<THREE.Mesh, NeuronNode>();
  const meshToAxon     = new Map<THREE.Mesh, AxonNode>();
  const meshToDendrite = new Map<THREE.Mesh, DendriteNode>();

  // ── Build neurons ─────────────────────────────────────────────────────────
  fibonacciSphere(graph.neurons.length, 9).forEach((pos, i) => {
    const neuron = graph.neurons[i]!;
    neuronPos.set(neuron.id, pos);

    const color = new THREE.Color(neuron.color);
    const mesh  = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 32, 32),
      new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        shininess: 80,
        transparent: true,
        opacity: 0.92,
      }),
    );
    mesh.position.copy(pos);
    mesh.scale.setScalar(0.001); // GSAP will animate in via startEntrance()
    mesh.userData['neuronId'] = neuron.id;
    neuronGroup.add(mesh);
    meshToNeuron.set(mesh, neuron);

    const light = new THREE.PointLight(color, 1.2, 8);
    light.position.copy(pos);
    scene.add(light);
  });

  // ── Build axons ───────────────────────────────────────────────────────────
  const axonsByNeuron = Map.groupBy
    ? Map.groupBy(graph.axons, (a) => a.neuronId)
    : graph.axons.reduce((m, a) => {
        const list = m.get(a.neuronId) ?? [];
        list.push(a);
        m.set(a.neuronId, list);
        return m;
      }, new Map<string, AxonNode[]>());

  for (const [nid, axons] of axonsByNeuron) {
    const nPos = neuronPos.get(nid);
    if (!nPos) continue;
    fibonacciSphere(axons.length, 4).forEach((offset, i) => {
      const axon = axons[i]!;
      const pos  = nPos.clone().add(offset);
      axonPos.set(axon.id, pos);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x8ab4d4,
          emissive: 0x1a3a5a,
          emissiveIntensity: 0.3,
          metalness: 0.2,
          roughness: 0.6,
          transparent: true,
          opacity: 0, // revealed on focusNeuron
        }),
      );
      mesh.position.copy(pos);
      mesh.userData['axonId']   = axon.id;
      mesh.userData['neuronId'] = axon.neuronId;
      axonGroup.add(mesh);
      meshToAxon.set(mesh, axon);

      // Neuron → axon edge (initially hidden)
      const tube = buildTube(nPos, pos, 0x3366aa, 0);
      tube.userData['neuronId'] = nid;
      edgeGroup.add(tube);
    });
  }

  // ── Build dendrites ────────────────────────────────────────────────────────
  const dendritesByAxon = graph.dendrites.reduce((m, d) => {
    const list = m.get(d.axonId) ?? [];
    list.push(d);
    m.set(d.axonId, list);
    return m;
  }, new Map<string, DendriteNode[]>());

  for (const [aid, dendrites] of dendritesByAxon) {
    const aPos = axonPos.get(aid);
    if (!aPos) continue;
    fibonacciSphere(dendrites.length, 2.4).forEach((offset, i) => {
      const dendrite = dendrites[i]!;
      const pos      = aPos.clone().add(offset);

      const radius = 0.17 + Math.min(dendrite.usageCount, 5) * 0.04;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0x5abedc,
          transparent: true,
          opacity: 0, // revealed on focusAxon
        }),
      );
      mesh.position.copy(pos);
      mesh.userData['dendriteId'] = dendrite.id;
      mesh.userData['axonId']     = dendrite.axonId;
      dendriteGroup.add(mesh);
      meshToDendrite.set(mesh, dendrite);

      // Axon → dendrite edge (initially hidden)
      const tube = buildTube(aPos, pos, 0x225577, 0);
      tube.userData['axonId'] = aid;
      edgeGroup.add(tube);
    });
  }

  // ── Raycaster ──────────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer   = new THREE.Vector2(-9999, -9999);

  let hoverCb: ((n: HoveredNode | null) => void) | null = null;
  let clickCb: ((n: ClickedNode) => void) | null = null;
  let prevHit: THREE.Mesh | null = null;

  const allMeshes = () => [
    ...neuronGroup.children,
    ...axonGroup.children,
    ...dendriteGroup.children,
  ] as THREE.Mesh[];

  const resolveHit = (mesh: THREE.Mesh): HoveredNode | ClickedNode | null => {
    const n = meshToNeuron.get(mesh);
    if (n) return { kind: 'neuron',   data: n };
    const a = meshToAxon.get(mesh);
    if (a) return { kind: 'axon',     data: a };
    const d = meshToDendrite.get(mesh);
    if (d) return { kind: 'dendrite', data: d };
    return null;
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x  =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    pointer.y  = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hit = (raycaster.intersectObjects(allMeshes(), false)[0]?.object ?? null) as THREE.Mesh | null;
    if (hit === prevHit) return;
    prevHit = hit;
    canvas.style.cursor = hit ? 'pointer' : 'default';
    if (!hoverCb) return;
    hoverCb(hit ? resolveHit(hit) as HoveredNode : null);
  };

  const onCanvasClick = () => {
    if (!prevHit || !clickCb) return;
    const resolved = resolveHit(prevHit);
    if (resolved) clickCb(resolved as ClickedNode);
  };

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('click',       onCanvasClick);

  // ── Render loop ────────────────────────────────────────────────────────────
  let raf     = 0;
  let running = false;
  let elapsed = 0;
  let lastMs  = 0;

  const tick = () => {
    if (!running) return;
    const now  = performance.now();
    elapsed   += (now - (lastMs || now)) / 1000;
    lastMs     = now;

    // Pulse synapse opacity
    edgeGroup.children.forEach((obj, i) => {
      const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat.opacity > 0.01) {
        mat.opacity = Math.max(
          0.05,
          mat.opacity * 0.97 + 0.03 * (0.12 + 0.1 * Math.sin(elapsed * 1.4 + i * 0.65)),
        );
      }
    });

    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  // ── Focus helpers ──────────────────────────────────────────────────────────

  const hideAll = () => {
    axonGroup.children.forEach((o) => gsap.to((o as THREE.Mesh).material, { opacity: 0, duration: 0.3 }));
    dendriteGroup.children.forEach((o) => gsap.to((o as THREE.Mesh).material, { opacity: 0, duration: 0.25 }));
    edgeGroup.children.forEach((o) => gsap.to((o as THREE.Mesh).material, { opacity: 0, duration: 0.25 }));
  };

  const flyTo = (pos: THREE.Vector3, zOffset = 14, duration = 0.9) => {
    gsap.to(camera.position, {
      x: pos.x * 0.55,
      y: pos.y * 0.55,
      z: pos.z * 0.55 + zOffset,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => controls.update(),
    });
  };

  // ── Public controller ──────────────────────────────────────────────────────
  return {
    start() {
      if (running) return;
      running = true;
      lastMs  = performance.now();
      tick();
    },

    pause() {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    },

    resize() {
      core.resize();
    },

    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      controls.dispose();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('click',       onCanvasClick);
      disposeObject(scene);
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss?.();
    },

    startEntrance() {
      neuronGroup.children.forEach((obj, i) => {
        gsap.to((obj as THREE.Mesh).scale, {
          x: 1, y: 1, z: 1,
          duration: 0.8,
          delay: i * 0.13,
          ease: 'back.out(1.6)',
        });
      });
    },

    focusNeuron(id) {
      hideAll();
      if (!id) {
        controls.autoRotate = true;
        gsap.to(camera.position, { x: 0, y: 0, z: 30, duration: 0.8, ease: 'power2.inOut' });
        return;
      }

      controls.autoRotate = false;
      const nPos = neuronPos.get(id);
      if (nPos) flyTo(nPos);

      // Reveal axon meshes + neuron→axon edges for this neuron
      const delay = 0.25;
      axonGroup.children.forEach((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.userData['neuronId'] === id) {
          gsap.to(mesh.material, { opacity: 0.82, duration: 0.5, delay });
        }
      });
      edgeGroup.children.forEach((obj) => {
        if ((obj as THREE.Mesh).userData['neuronId'] === id) {
          gsap.to((obj as THREE.Mesh).material, { opacity: 0.3, duration: 0.5, delay });
        }
      });
    },

    focusAxon(id) {
      // Clear dendrites + axon→dendrite edges, then reveal for this axon
      dendriteGroup.children.forEach((o) => gsap.to((o as THREE.Mesh).material, { opacity: 0, duration: 0.25 }));
      edgeGroup.children.forEach((o) => {
        if ((o as THREE.Mesh).userData['axonId']) {
          gsap.to((o as THREE.Mesh).material, { opacity: 0, duration: 0.25 });
        }
      });

      if (!id) return;

      const aPos = axonPos.get(id);
      if (aPos) flyTo(aPos, 8, 0.7);

      const delay = 0.18;
      dendriteGroup.children.forEach((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.userData['axonId'] === id) {
          gsap.to(mesh.material, { opacity: 0.78, duration: 0.45, delay });
        }
      });
      edgeGroup.children.forEach((obj) => {
        if ((obj as THREE.Mesh).userData['axonId'] === id) {
          gsap.to((obj as THREE.Mesh).material, { opacity: 0.28, duration: 0.45, delay });
        }
      });
    },

    onHover(cb) { hoverCb = cb; },
    onClick(cb) { clickCb = cb; },
  };
}
