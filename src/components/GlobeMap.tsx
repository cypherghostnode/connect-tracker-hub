import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

interface GlobeMapProps {
  lat: number;
  lng: number;
  label?: string;
}

const GlobeMap = ({ lat, lng, label }: GlobeMapProps) => {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: 2 }, 1500);
    }
  }, [lat, lng]);

  const pointData = [{ lat, lng, label: label || "Target", size: 0.6, color: "#3B82F6" }];

  return (
    <div ref={containerRef} className="w-full" style={{ height: 350 }}>
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={350}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
          pointsData={pointData}
          pointLat="lat"
          pointLng="lng"
          pointLabel="label"
          pointRadius="size"
          pointColor="color"
          pointAltitude={0.01}
          atmosphereColor="#3B82F6"
          atmosphereAltitude={0.15}
          animateIn={true}
        />
      )}
    </div>
  );
};

export default GlobeMap;
