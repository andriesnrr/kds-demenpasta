// components/kitchen/StationFilter.tsx
'use client';

import React from 'react';
import { DEFAULT_STATIONS } from '@/types/station';

interface StationFilterProps {
  selectedStation: string;
  onStationChange: (station: string) => void;
  orderCounts?: Record<string, number>;
}

export default function StationFilter({
  selectedStation,
  onStationChange,
  orderCounts = {}
}: StationFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Filter by Station</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {DEFAULT_STATIONS.map(station => {
          const count = orderCounts[station.name] || 0;
          const isSelected = selectedStation === station.name;

          return (
            <button
              key={station.id}
              onClick={() => onStationChange(station.name)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `border-${station.color} bg-${station.color} bg-opacity-10`
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                borderColor: isSelected ? station.color : undefined,
                backgroundColor: isSelected ? `${station.color}20` : undefined
              }}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{station.icon || '🍳'}</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {station.displayName}
                </div>
                {count > 0 && (
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: station.color }}
                  >
                    {count}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}