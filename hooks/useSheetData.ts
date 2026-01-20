import { useEffect, useState } from 'react';
import { DaySchedule, Restaurant, ScheduleItem, Spot } from '../types';
import { ITINERARY } from '../constants';

const SHEET_API_URL =
  import.meta.env.VITE_SHEET_API_URL ||
  (import.meta.env.DEV
    ? '/sheet'
    : 'https://script.google.com/macros/s/AKfycbwwX0F7AqRreLHoCt1qkdI5xyH3wbVow87AQ361M63n0PB_DDhuEiJORtYENhmsVGFk/exec');

type SheetRow = {
  id?: string;
  day?: string | number;
  order?: string | number;
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

const normalizeTime = (value?: string) => {
  if (!value) return '';
  const cleaned = cleanCell(value);
  if (!cleaned) return '';
  if (cleaned.includes('T')) {
    const parsed = new Date(cleaned);
    if (!Number.isNaN(parsed.getTime())) {
      const hours = String(parsed.getHours()).padStart(2, '0');
      const minutes = String(parsed.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
  return cleaned;
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

const deleteById = async (id: string) => postJson({ action: 'delete', id });

const toSheetRow = (day: DaySchedule, item: ScheduleItem, order: number) => {
  const coords = item.coords;
  const keepText = (value?: string) => value ? `'${value}` : '';

  return {
    id: item.id,
    day: day.day,
    order,
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

const sameCoords = (a?: ScheduleItem['coords'], b?: ScheduleItem['coords']) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.lat === b.lat && a.lng === b.lng;
};

const sameItem = (a: ScheduleItem, b: ScheduleItem) => (
  (a.order || 0) === (b.order || 0) &&
  a.time === b.time &&
  a.title === b.title &&
  a.description === b.description &&
  a.type === b.type &&
  (a.naverPlaceId || '') === (b.naverPlaceId || '') &&
  sameCoords(a.coords, b.coords)
);

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
            order: toNumber(row.order),
            time: normalizeTime(row.time),
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
          .map(day => {
            const items = grouped[day].items;
            const hasOrder = items.some(item => item.order !== undefined);
            return {
              day,
              date: grouped[day].date,
              title: grouped[day].title,
              items: hasOrder
                ? [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                : items
            };
          });

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

      const withIds = day.items.map((item, index) => {
        if (item.id) return item;
        while (existingIds.has(`day${day.day}-item${nextIndex}`)) {
          nextIndex += 1;
        }
        const id = `day${day.day}-item${nextIndex}`;
        nextIndex += 1;
        existingIds.add(id);
        return { ...item, id, order: index + 1 };
      });
      const withOrder = withIds.map((item, index) => ({ ...item, order: index + 1 }));


      const currentItemsById = new Map<string, ScheduleItem>(
        (current?.items || []).filter(item => item.id).map(item => [item.id as string, item])
      );
      const nextItemsById = new Map<string, ScheduleItem>(
        withOrder.filter(item => item.id).map(item => [item.id as string, item])
      );

      const currentOrder = (current?.items || []).map(item => item.id).filter(Boolean) as string[];
      const nextOrder = withOrder.map(item => item.id).filter(Boolean) as string[];
      const orderChanged = currentOrder.length === nextOrder.length &&
        currentOrder.some((id, index) => id !== nextOrder[index]);

      // Delete removed items only.
      for (const [id] of currentItemsById) {
        if (!nextItemsById.has(id)) {
          await deleteById(id);
        }
      }

      // Update changed items (delete + add) and add new ones.
      for (const item of withOrder) {
        if (!item.id) continue;
        const previous = currentItemsById.get(item.id);
        const dayMetaChanged = current ? (current.date !== day.date || current.title !== day.title) : true;
        const orderOnlyChanged = orderChanged && previous && (previous.order ?? 0) !== (item.order ?? 0);
        if (!previous || !sameItem(previous, item) || dayMetaChanged || orderOnlyChanged) {
          if (previous) {
            await deleteById(item.id);
          }
          await postJson(toSheetRow(day, item, item.order ?? 0));
        }
      }

      setItinerary((prev) => {
        const updated = prev.filter(item => item.day !== day.day);
          updated.push({ ...day, items: withOrder });
        return updated.sort((a, b) => a.day - b.day);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save day.';
      setSaveError(message);
      // eslint-disable-next-line no-console
      console.error('Save day failed:', error);
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
          await deleteById(item.id);
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
