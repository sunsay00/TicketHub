import type { Event, LotteryPriceRange, SectionRowOption } from '../types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift | The Eras Tour',
    venue: 'Madison Square Garden',
    city: 'New York, NY',
    date: '2025-06-15',
    time: '7:30 PM',
    drawingDate: '2025-06-08',
    drawingTime: '12:00 PM',
    image: '🎵',
    category: 'Concert',
  },
  {
    id: '2',
    title: 'Beyoncé Renaissance Tour',
    venue: 'SoFi Stadium',
    city: 'Inglewood, CA',
    date: '2025-07-22',
    time: '8:30 PM',
    drawingDate: '2025-07-15',
    drawingTime: '12:00 PM',
    image: '🎵',
    category: 'Concert',
  }
];

export const getEventById = (id: string): Event | undefined =>
  MOCK_EVENTS.find((e) => e.id === id);

export const LOTTERY_SECTION_ROWS: SectionRowOption[] = [
  { id: 'floor-a-12', section: 'Floor A', row: '12', type: 'Standard' },
  { id: 'floor-a-8', section: 'Floor A', row: '8', type: 'Standard' },
  { id: 'floor-a-15', section: 'Floor A', row: '15', type: 'Standard' },
  { id: 'floor-b-8', section: 'Floor B', row: '8', type: 'Standard' },
  { id: 'floor-b-12', section: 'Floor B', row: '12', type: 'Standard' },
  { id: 'lower-15', section: 'Lower Level', row: '15', type: 'Standard' },
  { id: 'lower-20', section: 'Lower Level', row: '20', type: 'Standard' },
  { id: 'lower-10', section: 'Lower Level', row: '10', type: 'Standard' },
  { id: 'upper-5', section: 'Upper Level', row: '5', type: 'Standard' },
  { id: 'upper-12', section: 'Upper Level', row: '12', type: 'Standard' },
  { id: 'upper-20', section: 'Upper Level', row: '20', type: 'Standard' },
  { id: 'vip-box', section: 'VIP Box', row: '-', type: 'VIP' },
];

export const LOTTERY_PRICE_RANGES: LotteryPriceRange[] = [
  { id: 'range-1', label: '$50 - $100', min: 50, max: 100 },
  { id: 'range-2', label: '$100 - $200', min: 100, max: 200 },
  { id: 'range-3', label: '$200 - $300', min: 200, max: 300 },
  { id: 'range-4', label: '$300+', min: 300, max: null },
];