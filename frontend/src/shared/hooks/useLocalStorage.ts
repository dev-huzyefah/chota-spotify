import { useState, useEffect, useCallback, useRef } from 'react';

interface LocalStorageEventDetail<T> {
  key: string;
  value: T;
}

declare global {
  interface WindowEventMap {
    'local-storage': CustomEvent<LocalStorageEventDetail<any>>;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Use a ref to store the latest initialValue
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined' || !key) {
      return initialValueRef.current;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Sync state if key changes - handle during render for responsiveness
  const lastKeyRef = useRef(key);
  if (key !== lastKeyRef.current) {
    lastKeyRef.current = key;
    setStoredValue(readValue());
  }

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    if (!key) return;

    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event to notify other instances in this window
        window.dispatchEvent(new CustomEvent('local-storage', { 
          detail: { key, value: valueToStore } 
        }));
        
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key]);

  useEffect(() => {
    if (!key) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue === null) {
          // Item was removed
          setStoredValue(initialValueRef.current);
        } else {
          try {
            setStoredValue(JSON.parse(e.newValue) as T);
          } catch {
            // ignore parse errors
          }
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<LocalStorageEventDetail<T>>;
      if (customEvent.detail && customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage', handleCustomEvent);
    };
  }, [key]);

  return [storedValue, setValue];
}
