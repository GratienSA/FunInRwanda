"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

type City = {
  name: string;
  coords: [number, number];
};

interface MapProps {
  center?: [number, number];
  zoom?: number;
}

const cities: City[] = [
  { name: "Kigali", coords: [-1.9441, 30.0619] },
  { name: "Butare", coords: [-2.5962, 29.7397] },
  { name: "Gitarama", coords: [-2.0739, 29.7567] },
  { name: "Ruhengeri", coords: [-1.4996, 29.6342] },
  { name: "Gisenyi", coords: [-1.7017, 29.2569] }
];

const Map: React.FC<MapProps> = ({ center = [-1.9403, 29.8739], zoom = 7 }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      mapRef.current = L.map('map').setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      cities.forEach(city => {
        L.marker(city.coords)
          .addTo(mapRef.current!)
          .bindPopup(city.name);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default Map;