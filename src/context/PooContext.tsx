import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────
export interface PooRecord {
  date: string; // yyyy-MM-dd
  count: number;
  timestamps: string[]; // HH:mm
}

interface PooContextType {
  todayRecord: PooRecord;
  todayCount: number;
  totalAllTime: number;
  currentStreak: number;
  weeklyAverage: number;
  last7Days: PooRecord[];
  todayTitle: string;
  records: Record<string, PooRecord>;
  isLoaded: boolean;
  addPoo: () => Promise<void>;
  undoLastPoo: () => Promise<void>;
  getRandomMessage: () => string;
}

// ─── Constants ────────────────────────────────
const FUN_MESSAGES = [
  '🎉 ¡Misión cumplida!',
  '🚀 ¡Despegue exitoso!',
  '💪 ¡Tu intestino te lo agradece!',
  '🏆 ¡Trofeo desbloqueado!',
  '⭐ ¡Eres una máquina!',
  '🎵 ¡Sinfonía intestinal!',
  '🌟 ¡Espectacular!',
  '🎯 ¡Diana perfecta!',
  '🥇 ¡Medalla de oro!',
  '🦸 ¡Superhéroe del baño!',
  '🌈 ¡Arcoíris de alivio!',
  '🎊 ¡Fiesta en el trono!',
  '👑 ¡Rey/Reina del trono!',
  '🔥 ¡Fuego intestinal controlado!',
  '✨ ¡Magia pura!',
];

const ACHIEVEMENT_TITLES: Record<number, string> = {
  0: '🚽 Esperando...',
  1: '🌱 Principiante',
  2: '💩 Doble impacto',
  3: '🔥 Hat trick fecal',
  4: '⚡ Tormenta marrón',
  5: '🏆 Leyenda del trono',
  6: '👑 Dios del retrete',
  7: '🌌 Nivel cósmico',
};

// ─── Helpers ──────────────────────────────────
const getDateKey = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getTimeString = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const emptyRecord = (date: string): PooRecord => ({
  date,
  count: 0,
  timestamps: [],
});

// ─── Context ──────────────────────────────────
const PooContext = createContext<PooContextType | undefined>(undefined);

export const PooProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<Record<string, PooRecord>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('poo_records');
        if (data) {
          setRecords(JSON.parse(data));
        }
      } catch (e) {
        console.warn('Error loading records:', e);
      }
      setIsLoaded(true);
    })();
  }, []);

  // Save to storage whenever records change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('poo_records', JSON.stringify(records)).catch(console.warn);
    }
  }, [records, isLoaded]);

  const todayKey = getDateKey();
  const todayRecord = records[todayKey] || emptyRecord(todayKey);
  const todayCount = todayRecord.count;

  const totalAllTime = Object.values(records).reduce((sum, r) => sum + r.count, 0);

  // Calculate streak
  const currentStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = getDateKey(date);
      const record = records[key];
      if (record && record.count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  // Last 7 days
  const last7Days: PooRecord[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = getDateKey(date);
    last7Days.push(records[key] || emptyRecord(key));
  }

  const weeklyAverage = last7Days.reduce((sum, r) => sum + r.count, 0) / 7;

  const todayTitle = (() => {
    if (todayCount === 0) return ACHIEVEMENT_TITLES[0];
    if (todayCount >= 7) return ACHIEVEMENT_TITLES[7];
    return ACHIEVEMENT_TITLES[todayCount] || ACHIEVEMENT_TITLES[7];
  })();

  const addPoo = useCallback(async () => {
    const key = getDateKey();
    const time = getTimeString();
    setRecords(prev => {
      const existing = prev[key] || emptyRecord(key);
      return {
        ...prev,
        [key]: {
          ...existing,
          count: existing.count + 1,
          timestamps: [...existing.timestamps, time],
        },
      };
    });
  }, []);

  const undoLastPoo = useCallback(async () => {
    const key = getDateKey();
    setRecords(prev => {
      const existing = prev[key];
      if (!existing || existing.count === 0) return prev;
      return {
        ...prev,
        [key]: {
          ...existing,
          count: existing.count - 1,
          timestamps: existing.timestamps.slice(0, -1),
        },
      };
    });
  }, []);

  const getRandomMessage = useCallback(() => {
    return FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
  }, []);

  return (
    <PooContext.Provider
      value={{
        todayRecord,
        todayCount,
        totalAllTime,
        currentStreak,
        weeklyAverage,
        last7Days,
        todayTitle,
        records,
        isLoaded,
        addPoo,
        undoLastPoo,
        getRandomMessage,
      }}
    >
      {children}
    </PooContext.Provider>
  );
};

export const usePoo = (): PooContextType => {
  const context = useContext(PooContext);
  if (!context) {
    throw new Error('usePoo must be used within a PooProvider');
  }
  return context;
};
