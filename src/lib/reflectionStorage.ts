export type ReflectionEntry = {
  situation: string;
  thought: string;
  need: string;
  updatedAt: string;
};

export interface ReflectionStorage {
  load(): ReflectionEntry | null;
  save(entry: ReflectionEntry): void;
  clear(): void;
}

const STORAGE_KEY = 'xinge-reflection-v1';

/** V1 browser-local adapter. The interface keeps UI code independent from the storage engine. */
export const reflectionStorage: ReflectionStorage = {
  load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const value: unknown = JSON.parse(raw);
      if (!value || typeof value !== 'object') return null;
      const entry = value as Partial<ReflectionEntry>;
      if (typeof entry.situation !== 'string' || typeof entry.thought !== 'string' || typeof entry.need !== 'string') return null;
      return {
        situation: entry.situation,
        thought: entry.thought,
        need: entry.need,
        updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : '',
      };
    } catch {
      return null;
    }
  },
  save(entry) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
