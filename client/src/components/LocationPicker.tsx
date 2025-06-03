// src/components/LocationPicker.tsx
import React from 'react';
import { useMapEvents } from 'react-leaflet';

interface Props {
  onSelect: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<Props> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export default LocationPicker;
