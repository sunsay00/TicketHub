export interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  drawingDate: string;
  drawingTime: string;
  image: string;
  category: string;
}

export interface LotteryPriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export type SelectionType = 'section' | 'priceRange';

export interface SectionSelection {
  section: string;
  row?: string;
}

export interface SectionRowOption {
  id: string;
  section: string;
  row: string;
  type?: string;
}

export interface PriceRangeSelection {
  minPrice: number;
  maxPrice: number | null;
  label: string;
}

export type LotterySelection = SectionSelection | PriceRangeSelection;

export interface TicketHolder {
  nameOrPhone: string;
}

export interface LotteryEntry {
  id: string;
  event: Event;
  selectionType: SelectionType;
  selection: LotterySelection;
  quantity: number;
  ticketHolders?: TicketHolder[];
  wonCount?: number;
  seatAssignments?: string[];
}

export interface Order {
  id: string;
  entries: LotteryEntry[];
  email: string;
  createdAt: string;
  drawingRunAt?: string;
}

export interface User {
  email: string;
  name: string;
  phone?: string;
}