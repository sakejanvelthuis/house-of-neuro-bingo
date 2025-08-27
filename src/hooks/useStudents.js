import { useEffect } from 'react';
import usePersistentState from './usePersistentState';
import seedStudents from '../data/students.json';

const VERSION = 3;
const LS_KEY = `nm_points_students_v${VERSION}`;

export default function useStudents() {
  const [students, setStudents] = usePersistentState(LS_KEY, seedStudents);

  // migrate passwords, points and bingo from previous version
  useEffect(() => {
    try {
      let prevData = null;
      let prevKey = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nm_points_students_v') && key !== LS_KEY) {
          const data = JSON.parse(localStorage.getItem(key) || 'null');
          if (Array.isArray(data)) {
            prevData = data;
            prevKey = key;
            break;
          }
        }
      }
      if (prevData) {
        const merged = seedStudents.map((s) => {
          const old = prevData.find((p) => p.id === s.id);
          return old ? { ...s, ...old } : s;
        });
        setStudents(merged);
        if (prevKey) localStorage.removeItem(prevKey);
      }
    } catch {
      // ignore migration errors
    }
  }, [setStudents]);

  return [students, setStudents];

// bump this key when the students.json seed data changes

const LS_KEY = 'nm_points_students_v3';
const PREV_KEY = 'nm_points_students_v2';

function buildInitial() {
  try {
    const raw = localStorage.getItem(PREV_KEY);
    if (!raw) return seedStudents;
    const prev = JSON.parse(raw);
    return seedStudents.map((seed) => {
      const existing = prev.find((s) => s.id === seed.id);
      if (existing) {
        return { ...existing, bingo: seed.bingo };
      }
      return seed;
    });
  } catch {
    return seedStudents;
  }
}



export default function useStudents() {
  return usePersistentState(LS_KEY, buildInitial());

}
