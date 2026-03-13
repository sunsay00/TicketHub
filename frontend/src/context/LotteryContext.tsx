import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Event, LotteryEntry, SelectionType, LotterySelection, TicketHolder } from '../types';

interface LotteryContextType {
  entries: LotteryEntry[];
  addEntry: (
    event: Event,
    selectionType: SelectionType,
    selection: LotterySelection,
    quantity?: number,
    ticketHolders?: TicketHolder[]
  ) => void;
  removeEntry: (entryId: string) => void;
  updateQuantity: (entryId: string, quantity: number) => void;
  clearEntries: () => void;
  totalEntries: number;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

interface LotteryProviderProps {
  children: ReactNode;
}

export const LotteryProvider = ({ children }: LotteryProviderProps) => {
  const [entries, setEntries] = useState<LotteryEntry[]>([]);

  const addEntry = (
    event: Event,
    selectionType: SelectionType,
    selection: LotterySelection,
    quantity = 1,
    ticketHolders?: TicketHolder[]
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setEntries((prev) => [...prev, { id, event, selectionType, selection, quantity, ticketHolders }]);
  };

  const removeEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const updateQuantity = (entryId: string, quantity: number) => {
    if (quantity <= 0) return removeEntry(entryId);
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, quantity } : e))
    );
  };

  const clearEntries = () => setEntries([]);

  const totalEntries = entries.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <LotteryContext.Provider
      value={{
        entries,
        addEntry,
        removeEntry,
        updateQuantity,
        clearEntries,
        totalEntries,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = (): LotteryContextType => {
  const context = useContext(LotteryContext);
  if (!context) {
    throw new Error('useLottery must be used within LotteryProvider');
  }
  return context;
};