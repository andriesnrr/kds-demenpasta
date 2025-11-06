 // src/types/station.ts
export interface Station {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  color: string;
  order: number;
}

export const DEFAULT_STATIONS: Station[] = [
  {
    id: 'all',
    name: 'all',
    displayName: 'All Orders',
    icon: '📋',
    color: '#6B7280',
    order: 0,
  },
  {
    id: 'grill',
    name: 'grill',
    displayName: 'Grill',
    icon: '🔥',
    color: '#EF4444',
    order: 1,
  },
  {
    id: 'fryer',
    name: 'fryer',
    displayName: 'Fryer',
    icon: '🍳',
    color: '#F59E0B',
    order: 2,
  },
  {
    id: 'salad',
    name: 'salad',
    displayName: 'Salad',
    icon: '🥗',
    color: '#10B981',
    order: 3,
  },
  {
    id: 'dessert',
    name: 'dessert',
    displayName: 'Dessert',
    icon: '🍰',
    color: '#EC4899',
    order: 4,
  },
  {
    id: 'drinks',
    name: 'drinks',
    displayName: 'Drinks',
    icon: '🥤',
    color: '#3B82F6',
    order: 5,
  },
];