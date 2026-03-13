import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Order, LotteryEntry } from '../types';

const ORDERS_STORAGE_KEY = '@tickethub_orders';

interface ChanceEntry {
  orderId: string;
  entryIdx: number;
  entry: LotteryEntry;
  chanceId: string;
}

function expandEntriesForDrawing(orders: Order[]): Record<string, ChanceEntry[]> {
  const byEvent: Record<string, ChanceEntry[]> = {};
  orders.forEach((order) => {
    order.entries?.forEach((entry, entryIdx) => {
      const eventId = entry.event?.id || 'unknown';
      if (!byEvent[eventId]) byEvent[eventId] = [];
      for (let q = 0; q < (entry.quantity || 1); q++) {
        byEvent[eventId].push({
          orderId: order.id,
          entryIdx,
          entry,
          chanceId: `${order.id}-${entry.id}-${q}`,
        });
      }
    });
  });
  return byEvent;
}

function selectWinnersFromPool(byEvent: Record<string, ChanceEntry[]>, winnerCountPerEvent = 2): Set<string> {
  const winningChanceIds = new Set<string>();
  Object.values(byEvent).forEach((chances) => {
    const count = Math.min(
      winnerCountPerEvent,
      Math.max(1, Math.ceil(chances.length * 0.2))
    );
    const shuffled = [...chances].sort(() => Math.random() - 0.5);
    shuffled.slice(0, count).forEach((c) => winningChanceIds.add(c.chanceId));
  });
  return winningChanceIds;
}

interface OrderHistoryContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  cancelOrder: (orderId: string) => void;
  releaseTicket: (orderId: string, entryId: string, ticketIndex: number) => void;
  releaseAllTickets: (orderId: string, entryId: string) => void;
  runDrawing: () => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

interface OrderHistoryProviderProps {
  children: ReactNode;
}

export const OrderHistoryProvider = ({ children }: { children: OrderHistoryProviderProps }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) setOrders(JSON.parse(stored) as Order[]);
      } catch { /* ignore */ }
      finally { setIsLoaded(true); }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch { /* ignore */ }
    };
    saveOrders();
  }, [orders, isLoaded]);

  const addOrder = useCallback((order: Omit<Order, 'id' | 'createdAt'>) => {
    const id = `order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newOrder: Order = {
      id,
      ...order,
      createdAt: new Date().toISOString(),
      entries: order.entries?.map((e) => ({ ...e, wonCount: 0 })) ?? [],
    };

    setOrders((prev) => {
      const withNew = [newOrder, ...prev];
      const pending = withNew.filter((o) => !o.drawingRunAt);
      if (pending.length === 0) return withNew;

      const byEvent = expandEntriesForDrawing(pending);
      const winningIds = selectWinnersFromPool(byEvent);

      return withNew.map((o) => {
        if (!o.drawingRunAt) {
          const entries = o.entries?.map((entry) => {
            let wonCount = 0;
            for (let q = 0; q < (entry.quantity || 1); q++) {
              if (winningIds.has(`${o.id}-${entry.id}-${q}`)) wonCount++;
            }
            const seatAssignments = wonCount > 0 
              ? Array.from({ length: wonCount }, (_, i) => String(i + 1)) 
              : undefined;
            return { ...entry, wonCount, seatAssignments };
          });
          return { ...o, entries, drawingRunAt: new Date().toISOString() };
        }
        return o;
      });
    });
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const releaseTicket = useCallback((orderId: string, entryId: string, ticketIndex: number) => {
    setOrders((prev) => prev.map((order) => {
      if (order.id !== orderId) return order;
      const entries = order.entries?.map((entry) => {
        if (entry.id !== entryId) return entry;
        const wonCount = (entry.wonCount || 1) - 1;
        const seatAssignments = entry.seatAssignments
          ? [...entry.seatAssignments.slice(0, ticketIndex), ...entry.seatAssignments.slice(ticketIndex + 1)]
          : undefined;
        return { ...entry, wonCount: Math.max(0, wonCount), seatAssignments: wonCount > 0 ? seatAssignments : undefined };
      });
      return { ...order, entries };
    }));
  }, []);

  const releaseAllTickets = useCallback((orderId: string, entryId: string) => {
    setOrders((prev) => prev.map((order) => {
      if (order.id !== orderId) return order;
      const entries = order.entries?.map((entry) => {
        if (entry.id !== entryId) return entry;
        return { ...entry, wonCount: 0, seatAssignments: undefined };
      });
      return { ...order, entries };
    }));
  }, []);

  const runDrawing = useCallback(() => {
    setOrders((prev) => {
      const pending = prev.filter((o) => !o.drawingRunAt);
      if (pending.length === 0) return prev;
      
      const now = new Date();
      let latestDrawing: number | null = null;
      
      pending.forEach((order) => {
        order.entries?.forEach((entry) => {
          const event = entry.event as { drawingDate?: string; drawingTime?: string };
          if (event?.drawingDate) {
            const dt = new Date(`${event.drawingDate}T${event.drawingTime || '12:00'}`);
            if (!latestDrawing || dt.getTime() > latestDrawing) latestDrawing = dt.getTime();
          }
        });
      });

      if (latestDrawing !== null && now.getTime() < latestDrawing) return prev;

      const byEvent = expandEntriesForDrawing(pending);
      const winningIds = selectWinnersFromPool(byEvent);

      return prev.map((o) => {
        if (!o.drawingRunAt) {
          const entries = o.entries?.map((entry) => {
            let wonCount = 0;
            for (let q = 0; q < (entry.quantity || 1); q++) {
              if (winningIds.has(`${o.id}-${entry.id}-${q}`)) wonCount++;
            }
            const seatAssignments = wonCount > 0 
              ? Array.from({ length: wonCount }, (_, i) => String(i + 1)) 
              : undefined;
            return { ...entry, wonCount, seatAssignments };
          });
          return { ...o, entries, drawingRunAt: new Date().toISOString() };
        }
        return o;
      });
    });
  }, []);

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder, cancelOrder, releaseTicket, releaseAllTickets, runDrawing }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistory = (): OrderHistoryContextType => {
  const context = useContext(OrderHistoryContext);
  if (!context) throw new Error('useOrderHistory must be used within OrderHistoryProvider');
  return context;
};