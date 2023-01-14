import { IItem } from 'next-app/src/features/shared/utils/interfaces';

export const creatorRoles: IItem[] = [
  { label: 'Olive Growers', value: 'OliveGrower' },
  { label: 'Bottle Manufacturers', value: 'BottleManufacturer' },
  { label: 'Olive Oil Mills', value: 'OliveOilMill' },
  { label: 'Bottling Plants', value: 'BottlingPlant' }
];

export const carouselResponsive = {
  eight: {
    breakpoint: { max: 4000, min: 2401 },
    items: 6
  },
  seven: {
    breakpoint: { max: 2400, min: 2101 },
    items: 6
  },
  six: {
    breakpoint: { max: 2100, min: 1801 },
    items: 6
  },
  five: {
    breakpoint: { max: 1800, min: 1501 },
    items: 5
  },
  four: {
    breakpoint: { max: 1500, min: 1201 },
    items: 4
  },
  three: {
    breakpoint: { max: 1200, min: 901 },
    items: 3
  },
  two: {
    breakpoint: { max: 900, min: 601 },
    items: 2
  },
  one: {
    breakpoint: { max: 600, min: 0 },
    items: 1
  }
};
