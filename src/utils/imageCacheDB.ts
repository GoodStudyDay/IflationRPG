const DB_NAME = 'InflationRPG_ImageCache';
const DB_VERSION = 1;
const STORE_NAME = 'images';

interface CacheEntry {
  url: string;
  data: string;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const getCachedImage = async (url: string): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined;
        if (entry) {
          const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - entry.timestamp < ONE_WEEK) {
            resolve(entry.data);
            return;
          }
          const deleteTx = db.transaction(STORE_NAME, 'readwrite');
          deleteTx.objectStore(STORE_NAME).delete(url);
        }
        resolve(null);
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
};

export const cacheImage = async (url: string, data: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const entry: CacheEntry = {
        url,
        data,
        timestamp: Date.now(),
      };

      const request = store.put(entry);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Failed to cache image in IndexedDB:', err);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        resolve();
      };
    });
  } catch {
  }
};

export const getCacheSize = async (): Promise<number> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = request.result as CacheEntry[];
        let size = 0;
        for (const entry of entries) {
          size += entry.data.length * 2;
        }
        resolve(size);
      };

      request.onerror = () => {
        resolve(0);
      };
    });
  } catch {
    return 0;
  }
};

export const deleteOldCache = async (maxEntries: number = 200): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.openCursor();

      const entries: { url: string; timestamp: number }[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          entries.push({
            url: cursor.value.url,
            timestamp: cursor.value.timestamp,
          });
          cursor.continue();
        } else {
          if (entries.length > maxEntries) {
            entries.sort((a, b) => a.timestamp - b.timestamp);
            const toDelete = entries.slice(0, entries.length - maxEntries);
            let deleted = 0;
            for (const entry of toDelete) {
              store.delete(entry.url).onsuccess = () => {
                deleted++;
                if (deleted === toDelete.length) {
                  resolve();
                }
              };
            }
          } else {
            resolve();
          }
        }
      };

      request.onerror = () => {
        resolve();
      };
    });
  } catch {
  }
};