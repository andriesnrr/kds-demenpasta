import { PackSize, Variant } from './order';

export interface AdditionalItem {
  id: string;
  name: string;
  price: number;
}

export const ADDITIONAL_ITEMS: AdditionalItem[] = [
  { id: 'potato_crunch', name: 'Potato Crunch', price: 2500 },
  { id: 'chili_oil_25ml', name: 'Chili Oil 25 ml', price: 2500 },
  { id: 'chili_oil_5ml', name: 'Chili Oil 5 ml', price: 500 },
];

export const MENU_DATA = [
  {
    id: 'pack_4_ayam',
    name: 'Pack 4 - Demen Ayam',
    packSize: 4 as PackSize,
    variant: 'ayam' as Variant,
    composition: { ayam: 4, jamur: 0 },
    price: 14000,
    prepTime: 10,
    available: true,
  },
  {
    id: 'pack_4_jamur',
    name: 'Pack 4 - Demen Jamur',
    packSize: 4 as PackSize,
    variant: 'jamur' as Variant,
    composition: { ayam: 0, jamur: 4 },
    price: 16000,
    prepTime: 10,
    available: true,
  },
  {
    id: 'pack_4_mix',
    name: 'Pack 4 - Mix',
    packSize: 4 as PackSize,
    variant: 'mix' as Variant,
    composition: { ayam: 2, jamur: 2 },
    price: 15000,
    prepTime: 10,
    available: true,
  },
  {
    id: 'pack_6_ayam',
    name: 'Pack 6 - Demen Ayam',
    packSize: 6 as PackSize,
    variant: 'ayam' as Variant,
    composition: { ayam: 6, jamur: 0 },
    price: 22000,
    prepTime: 12,
    available: true,
  },
  {
    id: 'pack_6_jamur',
    name: 'Pack 6 - Demen Jamur',
    packSize: 6 as PackSize,
    variant: 'jamur' as Variant,
    composition: { ayam: 0, jamur: 6 },
    price: 24000,
    prepTime: 12,
    available: true,
  },
  {
    id: 'pack_6_mix',
    name: 'Pack 6 - Mix',
    packSize: 6 as PackSize,
    variant: 'mix' as Variant,
    composition: { ayam: 3, jamur: 3 },
    price: 23000,
    prepTime: 12,
    available: true,
  },
];