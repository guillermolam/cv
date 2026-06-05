import type { NeuralGraphData, NeuronNode, AxonNode, DendriteNode } from '../lib/neural-types';
import type { HoveredNode } from '../design-system/three/neural-network';

type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

/**
 * neuralPanel — Alpine component for the Neural Knowledge Graph page.
 *
 * Responsibilities (UI only — no Three.js):
 *   - Receives CustomEvents from the <script> block in NeuralNetworkScene.astro
 *     (neural:ready, neural:hover, neural:click, neural:error)
 *   - Manages tooltip position + content
 *   - Opens / closes the ApexCharts side panel
 *   - Lazy-imports ApexCharts (pre-bundled by integrations/apexcharts) and
 *     renders the treemap / bar chart inside the panel
 *   - Dispatches neural:focus-neuron / neural:focus-axon back to the <script>
 *     block so Three.js can animate the camera
 *
 * Pattern: mirrors src/alpine/charts.ts (dynamic import of chart library on
 * first use, destroy on cleanup) + src/alpine/heerich.ts (event-driven init).
 */
export function registerNeuralPanelComponent(alpine: AlpineLike) {
  alpine.data('neuralPanel', () => ({
    // ── UI state ────────────────────────────────────────────────────────────
    ready: false,
    error: false,
    graph: null as NeuralGraphData | null,

    tooltip: {
      visible: false,
      x: 0,
      y: 0,
      node: null as HoveredNode | null,
    },

    panelOpen: false,
    activeNeuron: null as NeuronNode | null,
    activeAxon:   null as AxonNode | null,

    /** ApexCharts instance — destroyed and recreated on each panel switch */
    _chart: null as unknown,

    // ── Init ────────────────────────────────────────────────────────────────
    init(this: any) {
      const root = this.$el as HTMLElement;

      // Three.js script signals readiness with the graph payload
      root.addEventListener('neural:ready', (e: Event) => {
        const ev = e as CustomEvent<{ graph: NeuralGraphData }>;
        this.graph = ev.detail.graph;
        this.ready = true;
      });

      // Hover → update tooltip
      root.addEventListener('neural:hover', (e: Event) => {
        const ev = e as CustomEvent<{ node: HoveredNode | null }>;
        const node = ev.detail.node;
        if (!node) {
          this.tooltip.visible = false;
          return;
        }
        const canvas = root.querySelector<HTMLCanvasElement>('[data-neural-canvas]');
        const rect   = canvas?.getBoundingClientRect();
        const px     = (this as any)._px ?? 0;
        const py     = (this as any)._py ?? 0;
        this.tooltip = {
          visible: true,
          x: rect ? px - rect.left + 16 : px + 16,
          y: rect ? py - rect.top  + 16 : py + 16,
          node,
        };
      });

      // Click → open panel or open link
      root.addEventListener('neural:click', (e: Event) => {
        const ev   = e as CustomEvent<{ node: HoveredNode }>;
        const node = ev.detail.node;
        if (!node) return;
        if (node.kind === 'neuron')   this.openNeuron(node.data);
        if (node.kind === 'axon')     this.selectAxon(node.data);
        if (node.kind === 'dendrite' && node.data.website) {
          window.open(node.data.website, '_blank', 'noopener,noreferrer');
        }
      });

      // Three.js error (no WebGL)
      root.addEventListener('neural:error', () => { this.error = true; });

      // Track raw pointer position for tooltip placement
      root.addEventListener('pointermove', (e: PointerEvent) => {
        (this as any)._px = e.clientX;
        (this as any)._py = e.clientY;
      }, { passive: true });

      // ESC key resets view
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.reset();
      });
    },

    // ── Three.js camera commands (dispatched back to <script> block) ────────
    _focusNeuron(this: any, id: string | null) {
      const root = this.$el as HTMLElement;
      root.dispatchEvent(
        new CustomEvent('neural:focus-neuron', { detail: { id } }),
      );
    },
    _focusAxon(this: any, id: string | null) {
      const root = this.$el as HTMLElement;
      root.dispatchEvent(
        new CustomEvent('neural:focus-axon', { detail: { id } }),
      );
    },

    // ── Panel actions ────────────────────────────────────────────────────────
    async openNeuron(this: any, neuron: NeuronNode) {
      this.activeNeuron = neuron;
      this.activeAxon   = null;
      this._focusNeuron(neuron.id);

      this.panelOpen = true;
      await this.$nextTick();
      this._animatePanelIn();
      await this._renderTreemap(neuron);
    },

    async selectAxon(this: any, axon: AxonNode) {
      this.activeAxon = axon;
      this._focusAxon(axon.id);
      await this._renderBarChart(axon);
    },

    backToNeuron(this: any) {
      if (!this.activeNeuron) return;
      this.activeAxon = null;
      this._focusNeuron(this.activeNeuron.id);
      this._renderTreemap(this.activeNeuron);
    },

    closePanel(this: any) {
      this._animatePanelOut();
      setTimeout(() => {
        this.panelOpen   = false;
        this.activeNeuron = null;
        this.activeAxon   = null;
        this._destroyChart();
      }, 320);
    },

    reset(this: any) {
      this.closePanel();
      this._focusNeuron(null);
    },

    // ── ApexCharts — treemap (neuron overview) ───────────────────────────────
    async _renderTreemap(this: any, neuron: NeuronNode) {
      this._destroyChart();
      const el = document.getElementById('neural-apex-chart');
      if (!el || !this.graph) return;

      // Lazy import — pre-bundled by integrations/apexcharts/index.ts
      const { default: ApexCharts } = await import('apexcharts');

      const axons = (this.graph.axons as AxonNode[]).filter((a) => a.neuronId === neuron.id);

      const seriesData = axons.map((axon) => {
        const dendrites = (this.graph!.dendrites as DendriteNode[]).filter(
          (d) => d.axonId === axon.id,
        );
        return {
          x: axon.label,
          y: Math.max(10, dendrites.length * 18 + 10),
          fillColor: neuron.color,
          children: dendrites.map((d) => ({
            x: d.label,
            y: Math.max(8, d.usageCount * 14 + 8),
            fillColor: this._darken(neuron.color, 0.55),
          })),
        };
      });

      const options = {
        series: [{ data: seriesData }],
        chart: {
          type: 'treemap' as const,
          height: 280,
          background: 'transparent',
          toolbar: { show: false },
          animations: { enabled: true, speed: 380 },
          events: {
            // clicking a treemap cell selects the matching axon
            dataPointSelection: (_e: Event, _ctx: unknown, cfg: { dataPointIndex: number }) => {
              const axon = axons[cfg.dataPointIndex];
              if (axon) this.selectAxon(axon);
            },
          },
        },
        theme: { mode: 'dark' as const },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '11px',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: '400',
          },
        },
        plotOptions: {
          treemap: { distributed: false, enableShades: true, shadeIntensity: 0.4 },
        },
        tooltip: {
          theme: 'dark' as const,
          y: { formatter: (v: number) => `${v} pts` },
        },
        legend: { show: false },
      };

      this._chart = new ApexCharts(el, options);
      await (this._chart as ApexCharts).render();
    },

    // ── ApexCharts — horizontal bar (axon drill-down) ────────────────────────
    async _renderBarChart(this: any, axon: AxonNode) {
      this._destroyChart();
      const el = document.getElementById('neural-apex-chart');
      if (!el || !this.graph) return;

      const { default: ApexCharts } = await import('apexcharts');

      const dendrites = (this.graph.dendrites as DendriteNode[]).filter(
        (d) => d.axonId === axon.id,
      );
      const neuron    = (this.graph.neurons as NeuronNode[]).find(
        (n) => n.id === axon.neuronId,
      );

      const options = {
        series: [{
          name: 'Experience refs',
          data: dendrites.map((d) => d.usageCount),
        }],
        chart: {
          type: 'bar' as const,
          height: 260,
          background: 'transparent',
          toolbar: { show: false },
          animations: { enabled: true, speed: 320 },
        },
        theme: { mode: 'dark' as const },
        colors: [neuron?.color ?? '#4cc9f0'],
        xaxis: {
          categories: dendrites.map((d) => d.label),
          labels: {
            style: { fontFamily: 'var(--font-mono, monospace)', fontSize: '10px' },
          },
        },
        yaxis: { title: { text: 'Roles', style: { fontFamily: 'var(--font-mono, monospace)' } } },
        plotOptions: { bar: { borderRadius: 3, horizontal: false } },
        tooltip: {
          theme: 'dark' as const,
          y: { formatter: (v: number) => `${v} role${v !== 1 ? 's' : ''}` },
        },
        dataLabels: { enabled: false },
        grid: { borderColor: 'rgba(76,201,240,0.1)' },
      };

      this._chart = new ApexCharts(el, options);
      await (this._chart as ApexCharts).render();
    },

    _destroyChart(this: any) {
      if (this._chart) {
        (this._chart as ApexCharts).destroy();
        this._chart = null;
      }
    },

    // ── GSAP panel animations ─────────────────────────────────────────────────
    async _animatePanelIn(this: any) {
      const { gsap } = await import('../lib/gsap-plugins');
      const panel = document.getElementById('neural-apex-panel');
      if (panel) {
        gsap.fromTo(
          panel,
          { x: '100%', opacity: 0 },
          { x: '0%',   opacity: 1, duration: 0.38, ease: 'power2.out' },
        );
      }
    },

    async _animatePanelOut(this: any) {
      const { gsap } = await import('../lib/gsap-plugins');
      const panel = document.getElementById('neural-apex-panel');
      if (panel) {
        gsap.to(panel, { x: '100%', opacity: 0, duration: 0.28, ease: 'power2.in' });
      }
    },

    // ── Utility ───────────────────────────────────────────────────────────────
    /** Darken a hex colour by mixing with a dark base. */
    _darken(hex: string, amount: number): string {
      try {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.round(((n >> 16) & 0xff) * (1 - amount));
        const g = Math.round(((n >>  8) & 0xff) * (1 - amount));
        const b = Math.round( (n        & 0xff) * (1 - amount));
        return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
      } catch {
        return hex;
      }
    },
  }));
}
