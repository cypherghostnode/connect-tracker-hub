import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GlobeMapProps {
  lat: number;
  lng: number;
  label?: string;
}

const GlobeMap = ({ lat, lng, label }: GlobeMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    if (label) marker.bindPopup(`<div style="font-family:monospace;font-size:12px;color:#0a0a0a">${label}</div>`).openPopup();

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.flyTo([lat, lng], 5, { duration: 1.5 });
    markerRef.current.setLatLng([lat, lng]);
    if (label) markerRef.current.setPopupContent(`<div style="font-family:monospace;font-size:12px;color:#0a0a0a">${label}</div>`).openPopup();
  }, [lat, lng, label]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md overflow-hidden border border-border"
      style={{ height: 300 }}
    />
  );
};

export default GlobeMap;
