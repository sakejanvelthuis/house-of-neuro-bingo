import { useEffect, useCallback } from 'react';
import usePersistentState from './usePersistentState';

const VERSION = 3;
const LS_KEY = `nm_points_students_v${VERSION}`;

export default function useStudents() {
  const [students, setStudentsBase] = usePersistentState(LS_KEY, []);

  // load students from JSON file and migrate any previous localStorage versions
  useEffect(() => {
    fetch('/data/students.json')
      .then((r) => r.json())
      .then((seedStudents) => {
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
            setStudentsBase(merged);
            if (prevKey) localStorage.removeItem(prevKey);
          } else {
            setStudentsBase(seedStudents);
          }
        } catch {
          setStudentsBase(seedStudents);
        }
      })
      .catch(() => {});
  }, [setStudentsBase]);

  const setStudents = useCallback(
    (value) => {
      setStudentsBase(value);
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      }).catch(() => {});
    },
    [setStudentsBase]
  );

  return [students, setStudents];
}
