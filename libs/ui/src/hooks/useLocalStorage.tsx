import { Dispatch, SetStateAction, useState } from 'react';

export const useLocalStorage = <T extends number | string | JSON | undefined>(
  key: string,
  initialValue?: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = (value: SetStateAction<T>) => {
    try {
      const valueToStore = value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(error);
    }
    return value;
  };
  return [storedValue, setValue];
};
