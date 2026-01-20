import { useEffect, useState } from 'react';
import { DaySchedule, Restaurant, ScheduleItem, Spot } from '../types';
import { ITINERARY } from '../constants';

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxDap_R1NV5Z3FsmjrRmaRjWA0Gw1s4y8mxVrY_dkWTQ-rFqa9GxRFH5zqwFk2thNc_hw/exec';

type SheetRow = {
  id?: string;
  day?: string | number;
  date?: string;
  time?: string;
  title?: string;
  description?: string;
  type?: string;
  naverPlaceId?: string;
  lat?: string | number;
  lng?: string | number;
  tags?: string;
  imageUrl?: string;
  category?: string;
  dayTitle?: string;
};

const cleanCell = (value?: string) => {
  if (!value) return '';
  return value.startsWith("'") ? value.slice(1) : value;
};

const toNumber = (value?: string | number) => {
  if (value === null || value === undefined || value === '') return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const postJson = async (payload: Record<string, unknown>) => {
  const response = await fetch(SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
};

const toSheetRow = (day: DaySchedule, item: ScheduleItem) => {
  const coords = item.coords;
  const keepText = (value?: string) => value ? `'${value}` : '';

  return {
    id: item.id,
    day: day.day,
    date: keepText(day.date),
    time: keepText(item.time),
    title: item.title,
    description: item.description,
    type: item.type,
    naverPlaceId: item.naverPlaceId || '',
    lat: coords ? coords.lat : '',
    lng: coords ? coords.lng : '',
    tags: '',
    imageUrl: '',
    category: ''
  };
};

export const useSheetData = () => {
  const [itinerary, setItinerary] = useState<DaySchedule[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [food, setFood] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');

  useEffect(() => {
    const loadSheet = async () => {
      try {
        const response = await fetch(SHEET_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json();
        const rows = Array.isArray(payload?.data) ? payload.data as SheetRow[] : [];

        const dayTitleMap = ITINERARY.reduce<Record<number, string>>((acc, day) => {
          acc[day.day] = day.title;
          return acc;
        }, {});

        const scheduleItems = rows.filter(row => row.day !== '' && row.day !== undefined && row.day !== null);
        const grouped: Record<number, { date: string; title: string; items: ScheduleItem[] }> = {};

        scheduleItems.forEach(row => {
          const dayNum = Number(row.day);
          if (!Number.isFinite(dayNum)) return;
          const date = cleanCell(row.date);
          const title = cleanCell(row.dayTitle) || dayTitleMap[dayNum] || '';
          const coords = (row.lat || row.lng) ? { lat: toNumber(row.lat) ?? 0, lng: toNumber(row.lng) ?? 0 } : undefined;

          const item: ScheduleItem = {
            id: row.id,
            time: cleanCell(row.time),
            title: cleanCell(row.title),
            description: cleanCell(row.description),
            type: (row.type as ScheduleItem['type']) || 'other',
            naverPlaceId: row.naverPlaceId || undefined,
            coords
          };

          if (!grouped[dayNum]) {
            grouped[dayNum] = { date, title, items: [] };
          }

          grouped[dayNum].items.push(item);
        });

        const itineraryData = Object.keys(grouped)
          .map(day => Number(day))
          .sort((a, b) => a - b)
          .map(day => ({
            day,
            date: grouped[day].date,
            title: grouped[day].title,
            items: grouped[day].items
          }));

        const spotRows = rows.filter(row => row.type === 'spot' && (row.day === '' || row.day === undefined || row.day === null));
        const spotData: Spot[] = spotRows.map(row => ({
          id: row.id || '',
          name: cleanCell(row.title),
          description: cleanCell(row.description),
          category: cleanCell(row.category),
          imageUrl: row.imageUrl || '',
          tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
          lat: toNumber(row.lat) ?? 0,
          lng: toNumber(row.lng) ?? 0,
          naverPlaceId: row.naverPlaceId || undefined
        }));

        const foodRows = rows.filter(row => row.type === 'food' && (row.day === '' || row.day === undefined || row.day === null));
        const foodData: Restaurant[] = foodRows.map(row => ({
          id: row.id || '',
          name: cleanCell(row.title),
          description: cleanCell(row.description),
          category: (row.category as Restaurant['category']) || 'other',
          imageUrl: row.imageUrl || '',
          lat: toNumber(row.lat) ?? 0,
          lng: toNumber(row.lng) ?? 0,
          naverPlaceId: row.naverPlaceId || undefined
        }));

        setItinerary(itineraryData);
        setSpots(spotData);
        setFood(foodData);
        setLoadError('');
      } catch (error) {
        setLoadError('Failed to load sheet data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSheet();
  }, []);

  const saveDay = async (day: DaySchedule) => {
    setIsSaving(true);
    setSaveError('');
    try {
      const current = itinerary.find(item => item.day === day.day);
      const existingIds = new Set((current?.items || []).map(item => item.id).filter(Boolean) as string[]);
      let nextIndex = 1;

      const withIds = day.items.map((item) => {
        if (item.id) return item;
        while (existingIds.has(`day${day.day}-item${nextIndex}`)) {
          nextIndex += 1;
        }
        const id = `day${day.day}-item${nextIndex}`;
        nextIndex += 1;
        existingIds.add(id);
        return { ...item, id };
      });

      if (current) {
        for (const item of current.items) {
          if (!item.id) continue;
          await postJson({ action: 'delete', id: item.id });
        }
      }

      for (const item of withIds) {
        await postJson(toSheetRow(day, item));
      }

      setItinerary((prev) => {
        const updated = prev.filter(item => item.day !== day.day);
        updated.push({ ...day, items: withIds });
        return updated.sort((a, b) => a.day - b.day);
      });
    } catch (error) {
      setSaveError('Failed to save day.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDay = async (dayNumber: number) => {
    setIsSaving(true);
    setSaveError('');
    try {
      const current = itinerary.find(item => item.day === dayNumber);
      if (current) {
        for (const item of current.items) {
          if (!item.id) continue;
          await postJson({ action: 'delete', id: item.id });
        }
      }
      setItinerary((prev) => prev.filter(item => item.day !== dayNumber));
    } catch (error) {
      setSaveError('Failed to delete day.');
    } finally {
      setIsSaving(false);
    }
  };

  return { itinerary, spots, food, isLoading, loadError, isSaving, saveError, saveDay, deleteDay };
};
