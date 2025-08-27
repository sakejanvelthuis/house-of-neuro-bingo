import { useState, useEffect } from 'react';

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors
  }
}

export default function usePersistentState(key, initial) {
  const [state, setState] = useState(() => loadLS(key, initial));

  // if the storage key changes (e.g. bumped version), reload seed data
  useEffect(() => {
    setState(loadLS(key, initial));
  }, [key]);

  useEffect(() => saveLS(key, state), [key, state]);
  return [state, setState];
}
