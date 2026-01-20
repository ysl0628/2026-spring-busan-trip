import { LocationCoords } from '../types';

export const getNaverMapLink = (placeId?: string, coords?: LocationCoords) => {
  if (placeId) {
    return `https://map.naver.com/p/entry/place/${placeId}`;
  }
  if (coords) {
    return `https://map.naver.com/v5/search/${coords.lat},${coords.lng}`;
  }
  return '#';
};
