import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import worldData from 'world-atlas/countries-110m.json';

// Dimension base for the SVG map viewBox
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 520;

// Create projection fitted to the world bounds
export const projection = geoNaturalEarth1()
  .scale(168)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2 + 15]);

export const pathGenerator = geoPath().projection(projection);

// Extract countries features once
// TopoJSON schema cast
const topoWorld = worldData as any;
const countriesFeatureCollection = feature(topoWorld, topoWorld.objects.countries) as any;

export const countries = countriesFeatureCollection.features;

// Graticule lines (latitude & longitude grid)
const graticuleGenerator = geoGraticule().step([30, 30]);
export const graticulePath = pathGenerator(graticuleGenerator()) || '';

// Outline of the world sphere
export const spherePath = pathGenerator({ type: 'Sphere' }) || '';

// Geographic coordinate to SVG point
export function projectCoordinates(coords: [number, number]): [number, number] | null {
  return projection(coords);
}
