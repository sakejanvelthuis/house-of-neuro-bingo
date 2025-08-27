import usePersistentState from './usePersistentState';
import seedStudents from '../data/students.json';

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
