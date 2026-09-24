import L from 'leaflet'

// Convert a tile coordinate range at a given zoom to Leaflet lat/lng bounds
export function tileRangeToBounds(
    zoom: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
): L.LatLngBounds {
    const n = Math.pow(2, zoom);
    // NW corner of top-left tile
    const lngMin = (minX / n) * 360 - 180;
    const latMax = Math.atan(Math.sinh(Math.PI * (1 - 2 * minY / n))) * 180 / Math.PI;
    // SE corner of bottom-right tile
    const lngMax = ((maxX + 1) / n) * 360 - 180;
    const latMin = Math.atan(Math.sinh(Math.PI * (1 - 2 * (maxY + 1) / n))) * 180 / Math.PI;
    return L.latLngBounds(L.latLng(latMin, lngMin), L.latLng(latMax, lngMax));
}