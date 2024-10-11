"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Supprime les URLs par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ center, zoom = 7, onMapClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const defaultCenter: [number, number] = [-1.9403, 29.8739]; // Centre par défaut du Rwanda
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(center || defaultCenter);
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier si le composant est monté

  useEffect(() => {
    // Vérifie si le composant est monté
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Ne pas exécuter si le composant n'est pas monté

    if (!mapRef.current) {
      // Initialisation de la carte
      mapRef.current = L.map('map').setView(currentCenter, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Gestion du clic sur la carte
      if (onMapClick) {
        mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onMapClick(lat, lng);
          updateMarker(lat, lng);
        });
      }
    } else {
      // Met à jour la vue si la carte existe déjà
      mapRef.current.setView(currentCenter, zoom);
    }

    // Met à jour le marqueur avec la position actuelle
    updateMarker(currentCenter[0], currentCenter[1]);

    return () => {
      // Nettoyage à la désinstallation du composant
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, [currentCenter, zoom, onMapClick, isMounted]); // Ajout de isMounted comme dépendance

  useEffect(() => {
    // Met à jour la position actuelle si le centre change
    if (center) {
      setCurrentCenter(center);
    }
  }, [center]);

  const updateMarker = (lat: number, lng: number) => {
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
      }
    }
  };

  // N'affiche pas la carte avant qu'elle ne soit montée
  if (!isMounted) return null;

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default Map;
