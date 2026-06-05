import * as d3 from 'd3';
import type { LineString } from 'geojson';
import { feature } from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';

type WorkTourPlaceSummary = {
  id: string;
  city: string;
  country: string;
  label: string;
  latitude: number;
  longitude: number;
  durationMonths: number | null;
  durationKnown: boolean;
  companies: string[];
  roles: string[];
  ageLabels: string[];
  stayLabels: string[];
  note?: string;
};

type WorkTourStop = {
  id: string;
  label: string;
  focusLabel: string;
  placeIds: string[];
  latitude: number;
  longitude: number;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  companies: string[];
  roles: string[];
  note?: string;
};

const sphere = { type: 'Sphere' } as d3.GeoPermissibleObjects;
const graticule = d3.geoGraticule10();
const land = feature(
  worldAtlas as any,
  (worldAtlas as { objects: { countries: any } }).objects.countries,
) as d3.GeoPermissibleObjects;

const formatMonths = (months: number | null) => {
  if (months === null) return 'Duration not dated in CV';
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (years > 0 && remainder > 0) return `${years}y ${remainder}m`;
  if (years > 0) return `${years}y`;
  return `${remainder}m`;
};

const getAgeAt = (dateValue: string) => {
  const [yearRaw, monthRaw, dayRaw] = dateValue.split('-');
  const birth = new Date('1985-11-07T00:00:00Z');
  const at = new Date(
    Date.UTC(
      Number.parseInt(yearRaw ?? '', 10),
      Number.parseInt(monthRaw ?? '1', 10) - 1,
      Number.parseInt(dayRaw ?? '1', 10),
    ),
  );
  let age = at.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = at.getUTCMonth() - birth.getUTCMonth();
  const beforeBirthday =
    monthDelta < 0 ||
    (monthDelta === 0 && at.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
};

const isVisible = (
  projection: d3.GeoProjection,
  longitude: number,
  latitude: number,
) => {
  const [rotationLongitude, rotationLatitude] = projection.rotate();
  const center = [-rotationLongitude, -rotationLatitude] as [number, number];
  return d3.geoDistance([longitude, latitude], center) < Math.PI / 2;
};

const getColorScale = (places: WorkTourPlaceSummary[]) => {
  const values = places
    .map((place) => place.durationMonths)
    .filter((value): value is number => typeof value === 'number');
  const min = Math.min(...values);
  const max = Math.max(...values);
  return d3
    .scaleLinear<string>()
    .domain([min, (min + max) / 2, max])
    .range(['#5ea8ff', '#4fd7b8', '#e4c26d']);
};

const updateToast = (
  root: HTMLElement,
  title: string,
  meta: string,
  duration: string,
  age: string,
  note?: string,
) => {
  const kicker = root.querySelector<HTMLElement>('[data-work-tour-kicker]');
  const titleEl = root.querySelector<HTMLElement>('[data-work-tour-title]');
  const metaEl = root.querySelector<HTMLElement>('[data-work-tour-meta]');
  const durationEl = root.querySelector<HTMLElement>(
    '[data-work-tour-duration]',
  );
  const ageEl = root.querySelector<HTMLElement>('[data-work-tour-age]');
  const noteEl = root.querySelector<HTMLElement>('[data-work-tour-note]');
  if (!kicker || !titleEl || !metaEl || !durationEl || !ageEl || !noteEl)
    return;

  kicker.textContent = 'Live stop';
  titleEl.textContent = title;
  metaEl.textContent = meta;
  durationEl.textContent = duration;
  ageEl.textContent = age;
  if (note) {
    noteEl.hidden = false;
    noteEl.textContent = note;
  } else {
    noteEl.hidden = true;
    noteEl.textContent = '';
  }
};

const buildOne = (root: HTMLElement) => {
  const mount = root.querySelector<HTMLElement>('[data-work-tour-canvas]');
  if (!mount) return null;

  let places: WorkTourPlaceSummary[] = [];
  let stops: WorkTourStop[] = [];
  try {
    places = JSON.parse(root.dataset['places'] ?? '[]');
    stops = JSON.parse(root.dataset['stops'] ?? '[]');
  } catch {
    return null;
  }
  if (places.length === 0 || stops.length === 0) return null;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const colorScale = getColorScale(places);
  const placeById = new Map(places.map((place) => [place.id, place] as const));
  let activeStopIndex = 0;
  let width = 0;
  let height = 0;
  let timeoutId: number | undefined;
  let destroyed = false;

  const svg = d3
    .select(mount)
    .append('svg')
    .attr('class', 'work-tour-globe')
    .attr('role', 'img');
  svg.append('title').text('Animated world tour of Guillermo Lam career stops');

  const projection = d3.geoOrthographic();
  const path = d3.geoPath(projection);
  const defs = svg.append('defs');
  const clip = defs
    .append('clipPath')
    .attr('id', `work-tour-clip-${Math.random().toString(36).slice(2)}`);
  const clipPath = clip.append('path');

  const atmosphere = svg.append('circle');
  const spherePath = svg.append('path');
  const graticulePath = svg.append('path');
  const landPath = svg.append('path');
  const markerLayer = svg.append('g');
  const arcLayer = svg.append('g');

  const render = (highlightPlaceIds: string[]) => {
    projection.fitExtent(
      [
        [24, 24],
        [width - 24, height - 24],
      ],
      sphere,
    );

    clipPath.attr('d', path(sphere) ?? '');
    const [centerX, centerY] = projection.translate();
    atmosphere
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', projection.scale() * 1.03)
      .attr('fill', 'rgba(44, 145, 255, 0.10)');
    spherePath
      .attr('d', path(sphere) ?? '')
      .attr('fill', '#08111f')
      .attr('stroke', 'rgba(151, 176, 209, 0.28)')
      .attr('stroke-width', 1.2);
    graticulePath
      .attr('d', path(graticule) ?? '')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(114, 144, 183, 0.22)')
      .attr('stroke-width', 0.75)
      .attr('clip-path', `url(#${clip.attr('id')})`);
    landPath
      .attr('d', path(land) ?? '')
      .attr('fill', '#0f2138')
      .attr('stroke', 'rgba(116, 156, 201, 0.20)')
      .attr('stroke-width', 0.7)
      .attr('clip-path', `url(#${clip.attr('id')})`);

    const visiblePlaces = places
      .map((place) => ({
        ...place,
        coordinates: projection([place.longitude, place.latitude]) as
          | [number, number]
          | null,
        visible: isVisible(projection, place.longitude, place.latitude),
      }))
      .filter((place) => place.coordinates && place.visible);

    const markers = markerLayer
      .selectAll<SVGGElement, (typeof visiblePlaces)[number]>('g')
      .data(visiblePlaces, (d: (typeof visiblePlaces)[number]) => d.id);
    const markersEnter = markers
      .enter()
      .append('g')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr(
        'aria-label',
        (d: (typeof visiblePlaces)[number]) =>
          `${d.label}. ${formatMonths(d.durationMonths)}.`,
      )
      .on(
        'mouseenter focus',
        (_: Event, place: (typeof visiblePlaces)[number]) => {
          updateToast(
            root,
            place.label,
            place.companies.join(' · '),
            `Time based in place: ${formatMonths(place.durationMonths)}`,
            `Age(s) during recorded stays: ${place.ageLabels.join(', ')}`,
            place.note,
          );
        },
      )
      .on('mouseleave blur', () => {
        const stop = stops[activeStopIndex];
        if (!stop) return;
        const highlightedPlaces = stop.placeIds
          .map((id) => placeById.get(id))
          .filter((value): value is WorkTourPlaceSummary => Boolean(value));
        const durationSummary = highlightedPlaces
          .map(
            (place) => `${place.city}: ${formatMonths(place.durationMonths)}`,
          )
          .join(' · ');
        updateToast(
          root,
          stop.focusLabel,
          stop.companies.join(' · '),
          `Time based in place: ${durationSummary}`,
          `Age at start: ${getAgeAt(stop.startDate)}`,
          stop.note,
        );
      });

    markersEnter.append('circle').attr('class', 'work-tour-marker-halo');
    markersEnter.append('circle').attr('class', 'work-tour-marker-core');

    markers
      .merge(markersEnter)
      .attr(
        'transform',
        (d: (typeof visiblePlaces)[number]) =>
          `translate(${d.coordinates?.[0] ?? 0}, ${d.coordinates?.[1] ?? 0})`,
      )
      .attr('opacity', 1);

    markerLayer
      .selectAll<SVGCircleElement, (typeof visiblePlaces)[number]>(
        '.work-tour-marker-halo',
      )
      .attr('r', (d: (typeof visiblePlaces)[number]) =>
        highlightPlaceIds.includes(d.id) ? 13 : 9,
      )
      .attr('fill', (d: (typeof visiblePlaces)[number]) =>
        d.durationMonths === null
          ? 'rgba(151, 176, 209, 0.20)'
          : (d3
              .color(colorScale(d.durationMonths))
              ?.copy({ opacity: 0.18 })
              ?.formatRgb() ?? 'rgba(94, 168, 255, 0.18)'),
      )
      .attr('stroke', (d: (typeof visiblePlaces)[number]) =>
        highlightPlaceIds.includes(d.id)
          ? 'rgba(255,255,255,0.65)'
          : 'rgba(255,255,255,0.18)',
      )
      .attr('stroke-width', (d: (typeof visiblePlaces)[number]) =>
        highlightPlaceIds.includes(d.id) ? 1.6 : 1,
      );

    markerLayer
      .selectAll<SVGCircleElement, (typeof visiblePlaces)[number]>(
        '.work-tour-marker-core',
      )
      .attr('r', (d: (typeof visiblePlaces)[number]) =>
        highlightPlaceIds.includes(d.id) ? 4.6 : 3.4,
      )
      .attr('fill', (d: (typeof visiblePlaces)[number]) =>
        d.durationMonths === null ? '#8ea6c3' : colorScale(d.durationMonths),
      );

    markers.exit().remove();

    const activeStop = stops[activeStopIndex];
    const activePlaces = activeStop.placeIds
      .map((id) => placeById.get(id))
      .filter((value): value is WorkTourPlaceSummary => Boolean(value))
      .filter((place) =>
        isVisible(projection, place.longitude, place.latitude),
      );

    const arcs = activePlaces.map((place) => ({
      id: place.id,
      geometry: {
        type: 'LineString',
        coordinates: [
          [activeStop.longitude, activeStop.latitude],
          [place.longitude, place.latitude],
        ],
      } as LineString,
    }));

    const arcSelection = arcLayer
      .selectAll<SVGPathElement, (typeof arcs)[number]>('path')
      .data(arcs, (d: (typeof arcs)[number]) => d.id);
    arcSelection
      .enter()
      .append('path')
      .merge(arcSelection)
      .attr('d', (d: (typeof arcs)[number]) => path(d.geometry) ?? '')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(121, 216, 255, 0.5)')
      .attr('stroke-width', 1.1)
      .attr('stroke-dasharray', '4 4')
      .attr('clip-path', `url(#${clip.attr('id')})`);
    arcSelection.exit().remove();
  };

  const setStop = (index: number) => {
    activeStopIndex = index;
    const stop = stops[index];
    const target = [-stop.longitude, -stop.latitude, 0] as [
      number,
      number,
      number,
    ];
    const start = projection.rotate() as [number, number, number];
    const interpolate = d3.interpolate(start, target);
    const placeSummaries = stop.placeIds
      .map((id) => placeById.get(id))
      .filter((value): value is WorkTourPlaceSummary => Boolean(value));
    const durationSummary = placeSummaries
      .map((place) => `${place.city}: ${formatMonths(place.durationMonths)}`)
      .join(' · ');

    updateToast(
      root,
      stop.focusLabel,
      stop.companies.join(' · '),
      `Time based in place: ${durationSummary}`,
      `Age at start: ${getAgeAt(stop.startDate)}`,
      stop.note,
    );

    if (reducedMotion) {
      projection.rotate(target);
      render(stop.placeIds);
      return;
    }

    svg.interrupt();
    svg
      .transition()
      .duration(2100)
      .ease(d3.easeCubicInOut)
      .tween('rotate', () => (t: number) => {
        projection.rotate(interpolate(t));
        render(stop.placeIds);
      })
      .on('end', () => {
        if (destroyed) return;
        timeoutId = window.setTimeout(
          () => setStop((index + 1) % stops.length),
          1900,
        );
      });
  };

  const resize = () => {
    width = Math.max(mount.clientWidth, 320);
    height = Math.max(Math.min(width, 560), 352);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    render(stops[activeStopIndex]?.placeIds ?? []);
  };

  resize();
  projection.rotate([-stops[0].longitude, -stops[0].latitude, 0]);
  render(stops[0].placeIds);
  setStop(0);

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(mount);

  return () => {
    destroyed = true;
    if (timeoutId) window.clearTimeout(timeoutId);
    resizeObserver.disconnect();
    svg.interrupt();
    d3.select(mount).selectAll('*').remove();
  };
};

let bound = false;

export async function initWorkTourGlobes(): Promise<void> {
  if (typeof window === 'undefined' || bound) return;
  bound = true;

  const cleanups: Array<() => void> = [];
  document
    .querySelectorAll<HTMLElement>('[data-work-tour-globe]')
    .forEach((root) => {
      const cleanup = buildOne(root);
      if (cleanup) cleanups.push(cleanup);
    });

  const dispose = () => {
    for (const cleanup of cleanups) cleanup();
  };

  window.addEventListener('pagehide', dispose, { once: true });
  document.addEventListener('astro:before-swap', dispose, { once: true });
}
