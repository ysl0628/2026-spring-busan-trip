import React, { useEffect, useRef } from 'react';
import { ScheduleItem } from '../types';

const MiniMap: React.FC<{ items: ScheduleItem[]; day: number }> = ({ items, day }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    const naver = (window as any).naver;
    if (!mapRef.current || !naver || !naver.maps || !naver.maps.LatLng) return;

    const coords = items
      .filter(i => i.coords)
      .map(i => new naver.maps.LatLng(i.coords!.lat, i.coords!.lng));

    if (coords.length === 0) return;

    if (!mapInstance.current) {
      mapInstance.current = new naver.maps.Map(mapRef.current, {
        center: coords[0],
        zoom: 12,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        logoControl: false,
      });
    }

    const map = mapInstance.current;

    items.forEach(item => {
      if (item.coords) {
        new naver.maps.Marker({
          position: new naver.maps.LatLng(item.coords.lat, item.coords.lng),
          map: map,
          title: item.title
        });
      }
    });

    if (coords.length > 1) {
      const bounds = new naver.maps.LatLngBounds(coords[0], coords[0]);
      coords.forEach(coord => bounds.extend(coord));
      map.panToBounds(bounds);
    } else {
      map.setCenter(coords[0]);
    }

    window.setTimeout(() => {
      if (naver.maps.Event && map) naver.maps.Event.trigger(map, 'resize');
    }, 300);
  }, [items, day]);

  return <div ref={mapRef} className="w-full h-64 md:h-80 lg:h-96 mt-4 rounded-2xl border border-slate-200 shadow-inner overflow-hidden" />;
};

export default MiniMap;
